import { useState } from "react";
import { X, Check, Search, Ticket, Crown, Users, Briefcase, CheckCircle2, ChevronDown, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { MOCK_SOCIOS } from "../mocks/mockManager";
import {
  registrarAcessoCriado,
  buscarPessoaPorCpfManager,
  buscarNomeBigDataCorp,
  type AcessoCriado,
  type PessoaEncontrada,
} from "../mocks/mockManagerStore";
import { ESPACOS } from "@/shared/data/spaces";
import { SeletorPeriodo } from "./SeletorPeriodo";

// Classes por extenso (não interpoladas) — Tailwind só gera a classe se ela
// aparecer literal no código-fonte.
const CATEGORIAS: { valor: AcessoCriado["categoria"]; label: string; icon: any; badge: string }[] = [
  { valor: "Visitante", label: "Visitante", icon: Ticket, badge: "bg-blue-100 text-blue-600" },
  { valor: "Sócio Titular", label: "Sócio Titular", icon: Crown, badge: "bg-emerald-100 text-emerald-600" },
  { valor: "Sócio Dependente", label: "Sócio Dependente", icon: Users, badge: "bg-purple-100 text-purple-600" },
  { valor: "Prestador de Serviço", label: "Prestador de Serviço", icon: Briefcase, badge: "bg-amber-100 text-amber-600" },
];

const CATEGORIAS_SOCIO = ["Sócio Titular", "Sócio Remido", "Sócia Contribuinte"];
const AUTORIZADORES_PRESTADOR = ["Administração do Clube", ...MOCK_SOCIOS.map((s) => s.name)];

// CADASTRO → AUTORIZAÇÃO → LIBERAÇÃO (CLAUDE.md §4.1) — "dados-cadastro"
// cobre Nome/Telefone/Placa (cadastro) sempre antes de "categoria" (que é o
// campo Motivo, já parte da Autorização); "autorizacao" fecha com
// Destino/Autorizador/Período/Observações.
type Fase = "cpf" | "confirmacao" | "dados-cadastro" | "categoria" | "autorizacao";

interface Props {
  onFechar: () => void;
  onCriado: () => void;
}

function formatarCpf(valor: string) {
  let v = valor.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
}

export function CriarUsuarioModal({ onFechar, onCriado }: Props) {
  const [fase, setFase] = useState<Fase>("cpf");
  const [cpf, setCpf] = useState("");
  const [pessoaEncontrada, setPessoaEncontrada] = useState<PessoaEncontrada | null>(null);

  // CADASTRO
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [placa, setPlaca] = useState("");

  // AUTORIZAÇÃO — Motivo (categoria) + campos específicos do motivo
  const [categoria, setCategoria] = useState<AcessoCriado["categoria"] | null>(null);
  const [titularVinculadoId, setTitularVinculadoId] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [categoriaSocio, setCategoriaSocio] = useState(CATEGORIAS_SOCIO[0]);

  // AUTORIZAÇÃO — Destino/Autorizador/Período/Observações
  const [destino, setDestino] = useState("");
  const [autorizadorPrestador, setAutorizadorPrestador] = useState(AUTORIZADORES_PRESTADOR[0]);
  const [periodo, setPeriodo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ nome: string; mensagem: string } | null>(null);

  // Sócio Titular/Dependente tem livre acesso por natureza (mesma regra do
  // Concierge) — só Visitante e Prestador precisam de destino/autorizador/período.
  const precisaAutorizacao = categoria === "Visitante" || categoria === "Prestador de Serviço";

  const fasesAtuais: Fase[] = pessoaEncontrada
    ? (["cpf", "confirmacao", ...(precisaAutorizacao ? ["autorizacao"] as Fase[] : [])])
    : (["cpf", "dados-cadastro", "categoria", ...(precisaAutorizacao ? ["autorizacao"] as Fase[] : [])]);
  const indiceAtual = fasesAtuais.indexOf(fase) + 1;
  const totalFases = fasesAtuais.length;

  const titularVinculado = MOCK_SOCIOS.find((s) => s.id === titularVinculadoId);
  const opcoesDestino = categoria === "Visitante" ? [...ESPACOS.map((e) => e.name), "Clube Inteiro"] : ESPACOS.map((e) => e.name);

  const categoriaCompleta =
    !!categoria && (categoria === "Sócio Dependente" || categoria === "Visitante" ? !!titularVinculadoId : true);

  const handleBuscar = () => {
    const encontrada = buscarPessoaPorCpfManager(cpf);
    if (encontrada) {
      setPessoaEncontrada(encontrada);
      setCategoria(encontrada.categoria as AcessoCriado["categoria"]);
      setNome(encontrada.nome);
      setFase("confirmacao");
    } else {
      setPessoaEncontrada(null);
      setCategoria(null);
      setNome(buscarNomeBigDataCorp(cpf));
      setFase("dados-cadastro");
    }
  };

  const handleConfirmarIdentidade = () => {
    if (precisaAutorizacao) {
      setFase("autorizacao");
    } else {
      setSuccess({ nome, mensagem: `${nome} já tem acesso livre ao clube — nenhuma autorização adicional necessária.` });
    }
  };

  const handleContinuarCadastro = () => setFase("categoria");

  const handleContinuarCategoria = () => {
    if (precisaAutorizacao) {
      setFase("autorizacao");
    } else {
      handleCriar();
    }
  };

  const handleCriar = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const acesso: AcessoCriado = {
        id: `mg-${Date.now()}`,
        nome,
        cpf,
        telefone,
        placa: placa || undefined,
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(cpf || nome)}`,
        categoria: categoria!,
        titularVinculado: titularVinculado?.name,
        empresa: categoria === "Prestador de Serviço" ? empresa : undefined,
        destino: precisaAutorizacao ? destino : undefined,
        autorizador: precisaAutorizacao
          ? categoria === "Visitante"
            ? titularVinculado?.name
            : autorizadorPrestador
          : undefined,
        periodo: precisaAutorizacao ? periodo : undefined,
        observacoes: precisaAutorizacao ? (observacoes || undefined) : undefined,
        criadoEm: "Agora mesmo",
      };

      registrarAcessoCriado(acesso);
      toast.success(`${categoria} criado: ${nome}`);
      setSuccess({ nome, mensagem: `${categoria} criado com sucesso.` });
    }, 700);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => { onCriado(); onFechar(); }}>
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-10 flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-[18px] font-bold text-gray-900">{success.nome}</p>
          <p className="text-[14px] text-gray-500 mt-1">{success.mensagem}</p>
          <button
            onClick={() => { onCriado(); onFechar(); }}
            className="mt-6 px-5 py-2.5 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onFechar}>
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[16px] font-bold text-gray-900">Criar Usuário</p>
            <p className="text-[12px] text-gray-500">Etapa {indiceAtual} de {totalFases}</p>
          </div>
          <button onClick={onFechar} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-1.5 px-6 pt-4">
          {fasesAtuais.map((f) => (
            <div key={f} className={`h-1 flex-1 rounded-full ${fasesAtuais.indexOf(f) + 1 <= indiceAtual ? "bg-emerald-500" : "bg-gray-100"}`} />
          ))}
        </div>

        <div className="p-6 overflow-y-auto">
          {/* FASE — CPF */}
          {fase === "cpf" && (
            <div className="space-y-4">
              <p className="text-[13px] font-semibold text-gray-500">
                Digite o CPF pra ver se a pessoa já está cadastrada.
              </p>
              <div className="relative">
                <input
                  autoFocus
                  value={cpf}
                  onChange={(e) => setCpf(formatarCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full bg-gray-50 border border-gray-200 pl-4 pr-11 py-3.5 rounded-xl text-[16px] font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600"
                />
                <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <HelpCircle size={13} /> Busca entre sócios do ERP e usuários já criados nesta sessão.
              </p>
            </div>
          )}

          {/* FASE — Confirmação (pessoa encontrada) */}
          {fase === "confirmacao" && pessoaEncontrada && (
            <div className="flex flex-col items-center text-center py-4">
              <img src={pessoaEncontrada.avatar} alt={pessoaEncontrada.nome} className="w-20 h-20 rounded-full object-cover border border-gray-100 mb-4" />
              <p className="text-[18px] font-bold text-gray-900">{pessoaEncontrada.nome}</p>
              <p className="text-[13px] text-gray-500 font-mono mt-0.5">{pessoaEncontrada.cpf}</p>
              <span className="mt-2 text-[11px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                {pessoaEncontrada.categoria}
              </span>
            </div>
          )}

          {/* FASE — Cadastro (pessoa nova): Nome, Telefone, Placa */}
          {fase === "dados-cadastro" && (
            <div className="space-y-4">
              <p className="text-[13px] font-semibold text-gray-500">CPF não encontrado. Dados de cadastro da pessoa nova.</p>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Nome Completo</label>
                <input
                  autoFocus
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Telefone</label>
                  <input
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(51) 99999-9999"
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Placa (opcional)</label>
                  <input
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    placeholder="ABC1D23"
                    maxLength={7}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium uppercase focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FASE — Categoria/Motivo (pessoa nova) — já é campo de Autorização */}
          {fase === "categoria" && (
            <div className="space-y-4">
              <p className="text-[13px] font-semibold text-gray-500">Qual o motivo do acesso dessa pessoa?</p>
              <div className="space-y-2.5">
                {CATEGORIAS.map((c) => (
                  <button
                    key={c.valor}
                    onClick={() => setCategoria(c.valor)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-colors text-left ${
                      categoria === c.valor ? "border-emerald-600 bg-emerald-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${c.badge} flex items-center justify-center shrink-0`}>
                      <c.icon size={18} />
                    </div>
                    <span className="font-semibold text-gray-900">{c.label}</span>
                  </button>
                ))}
              </div>

              {categoria === "Sócio Titular" && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Categoria do Título</label>
                  <div className="relative">
                    <select
                      value={categoriaSocio}
                      onChange={(e) => setCategoriaSocio(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                    >
                      {CATEGORIAS_SOCIO.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {(categoria === "Sócio Dependente" || categoria === "Visitante") && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                    {categoria === "Sócio Dependente" ? "Titular Vinculado" : "Sócio Patrocinador"}
                  </label>
                  <div className="relative">
                    <select
                      value={titularVinculadoId}
                      onChange={(e) => setTitularVinculadoId(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                    >
                      <option value="">Selecione um sócio...</option>
                      {MOCK_SOCIOS.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {categoria === "Prestador de Serviço" && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Empresa (opcional)</label>
                  <input
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Deixe em branco se for autônomo"
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600"
                  />
                </div>
              )}
            </div>
          )}

          {/* FASE — Autorização (Visitante/Prestador): Destino, Autorizador, Período, Observações */}
          {fase === "autorizacao" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Destino</label>
                <div className="relative">
                  <select
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                  >
                    <option value="">Selecione o destino...</option>
                    {opcoesDestino.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Autorizador</label>
                {categoria === "Visitante" ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-semibold text-gray-700">
                    {titularVinculado?.name || "—"}
                    <p className="text-[11px] font-normal text-gray-400 mt-0.5">Definido pelo sócio patrocinador.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={autorizadorPrestador}
                      onChange={(e) => setAutorizadorPrestador(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                    >
                      {AUTORIZADORES_PRESTADOR.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Período</label>
                <SeletorPeriodo onChange={setPeriodo} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Observações (opcional)</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                  placeholder="Alguma informação adicional sobre esse acesso..."
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          {fase === "cpf" && (
            <button
              onClick={handleBuscar}
              disabled={cpf.replace(/\D/g, "").length !== 11}
              className="flex-1 py-3 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Search size={16} /> Buscar
            </button>
          )}

          {fase === "confirmacao" && (
            <>
              <button
                onClick={() => { setPessoaEncontrada(null); setCategoria(null); setNome(""); setFase("cpf"); }}
                className="px-5 py-3 rounded-xl font-semibold text-[14px] text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Não é essa pessoa
              </button>
              <button
                onClick={handleConfirmarIdentidade}
                className="flex-1 py-3 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={16} /> Confirmar
              </button>
            </>
          )}

          {fase === "dados-cadastro" && (
            <button
              onClick={handleContinuarCadastro}
              disabled={!nome}
              className="flex-1 py-3 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Continuar
            </button>
          )}

          {fase === "categoria" && (
            <>
              <button
                onClick={() => setFase("dados-cadastro")}
                className="px-5 py-3 rounded-xl font-semibold text-[14px] text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleContinuarCategoria}
                disabled={!categoriaCompleta || isSubmitting}
                className="flex-1 py-3 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {precisaAutorizacao ? "Continuar" : (isSubmitting ? "Criando..." : <><Check size={16} /> Criar Usuário</>)}
              </button>
            </>
          )}

          {fase === "autorizacao" && (
            <>
              <button
                onClick={() => setFase(pessoaEncontrada ? "confirmacao" : "categoria")}
                className="px-5 py-3 rounded-xl font-semibold text-[14px] text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleCriar}
                disabled={isSubmitting || !destino}
                className="flex-1 py-3 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Criando..." : <><Check size={16} /> Criar Usuário</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
