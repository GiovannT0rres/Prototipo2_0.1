import { useState } from "react";
import { X, Check, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  buscarPessoaPorCpf,
  buscarNomeBigDataCorp,
  registrarPessoa,
  concederAutorizacao,
} from "../mocks/mockManagerStore";
import { MOTIVOS, MOTIVO_COR, type Motivo } from "../types";
import type { Person } from "../types";
import { SeletorPeriodo, type Periodo } from "./SeletorPeriodo";

// Caminho 1 do modelo de domínio: concessão direta — o manager cadastra ou
// encontra a pessoa e concede a autorização na hora. É o caminho mais rápido
// e o mais usado no dia a dia; antes do redesign não existia como ação
// direta na interface (só existia via convite).
// CADASTRO → AUTORIZAÇÃO (CLAUDE.md §4.1): CPF → confirma/cadastra pessoa →
// Motivo → Autorizador/Período/Observações, nessa ordem. Espaço saiu do
// modelo — a área é decidida pelo perfil de acesso, fora deste app (spec §1.1).
type Fase = "cpf" | "confirmacao" | "dados-cadastro" | "motivo" | "autorizacao";

interface Props {
  onFechar: () => void;
  pessoaFixa?: Person; // quando aberto a partir da ficha de uma pessoa já conhecida
}

function formatarCpf(valor: string) {
  let v = valor.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
}

const AUTORIZADORES = ["Administração do Clube"];

export function ConcederAutorizacaoModal({ onFechar, pessoaFixa }: Props) {
  const [fase, setFase] = useState<Fase>(pessoaFixa ? "motivo" : "cpf");
  const [cpf, setCpf] = useState(pessoaFixa?.cpf ?? "");
  const [pessoa, setPessoa] = useState<Person | null>(pessoaFixa ?? null);
  const [pessoaExistente, setPessoaExistente] = useState(!!pessoaFixa);

  // CADASTRO (pessoa nova)
  const [nome, setNome] = useState(pessoaFixa?.nome ?? "");
  const [telefone, setTelefone] = useState(pessoaFixa?.telefone ?? "");
  const [placa, setPlaca] = useState("");

  // AUTORIZAÇÃO
  const [motivo, setMotivo] = useState<Motivo | null>(null);
  const [autorizador, setAutorizador] = useState(AUTORIZADORES[0]);
  const [periodo, setPeriodo] = useState<Periodo | null>(null);
  const [observacoes, setObservacoes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ nome: string; mensagem: string } | null>(null);

  const SEM_PRAZO: Motivo[] = ["Sócio Titular", "Dependente", "Equipe Administrativa", "Porteiro"];
  const precisaPeriodo = motivo ? !SEM_PRAZO.includes(motivo) : false;

  const fasesAtuais: Fase[] = pessoaFixa
    ? ["motivo", ...(precisaPeriodo ? (["autorizacao"] as Fase[]) : [])]
    : pessoaExistente
      ? ["cpf", "confirmacao", "motivo", ...(precisaPeriodo ? (["autorizacao"] as Fase[]) : [])]
      : ["cpf", "dados-cadastro", "motivo", ...(precisaPeriodo ? (["autorizacao"] as Fase[]) : [])];
  const indiceAtual = fasesAtuais.indexOf(fase) + 1;
  const totalFases = fasesAtuais.length;

  const handleBuscar = () => {
    const encontrada = buscarPessoaPorCpf(cpf);
    if (encontrada) {
      setPessoa(encontrada);
      setPessoaExistente(true);
      setNome(encontrada.nome);
      setFase("confirmacao");
    } else {
      setPessoa(null);
      setPessoaExistente(false);
      setNome(buscarNomeBigDataCorp(cpf));
      setFase("dados-cadastro");
    }
  };

  const handleContinuarCadastro = () => setFase("motivo");
  const handleConfirmarIdentidade = () => setFase("motivo");

  const handleContinuarMotivo = () => {
    if (precisaPeriodo) {
      setFase("autorizacao");
    } else {
      handleConceder();
    }
  };

  const handleConceder = () => {
    if (!motivo) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      let pessoaFinal = pessoa;
      if (!pessoaFinal) {
        pessoaFinal = {
          id: `p-${Date.now()}`,
          nome,
          cpf,
          telefone,
          placa: placa || undefined,
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(cpf || nome)}`,
        };
        registrarPessoa(pessoaFinal);
      }

      concederAutorizacao({
        personId: pessoaFinal.id,
        motivo,
        periodoInicio: precisaPeriodo ? periodo?.inicio ?? null : null,
        periodoFim: precisaPeriodo ? periodo?.fim ?? null : null,
        autorizadorId: null,
        autorizadorLabel: precisaPeriodo ? autorizador : "Administração do Clube",
        observacoes: observacoes || undefined,
      });

      toast.success(`Autorização concedida: ${pessoaFinal.nome} — ${motivo}`);
      setSuccess({ nome: pessoaFinal.nome, mensagem: `Autorização de ${motivo} concedida com sucesso.` });
    }, 600);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onFechar}>
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-10 flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-[18px] font-bold text-gray-900">{success.nome}</p>
          <p className="text-[14px] text-gray-500 mt-1">{success.mensagem}</p>
          <button
            onClick={onFechar}
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
            <p className="text-[16px] font-bold text-gray-900">Conceder Autorização</p>
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
          {fase === "cpf" && (
            <div className="space-y-4">
              <p className="text-[13px] font-semibold text-gray-500">Digite o CPF pra ver se a pessoa já está cadastrada.</p>
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
            </div>
          )}

          {fase === "confirmacao" && pessoa && (
            <div className="flex flex-col items-center text-center py-4">
              <img src={pessoa.avatar} alt={pessoa.nome} className="w-20 h-20 rounded-full object-cover border border-gray-100 mb-4" />
              <p className="text-[18px] font-bold text-gray-900">{pessoa.nome}</p>
              <p className="text-[13px] text-gray-500 font-mono mt-0.5">{pessoa.cpf}</p>
            </div>
          )}

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

          {fase === "motivo" && (
            <div className="space-y-4">
              {pessoaFixa && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-2">
                  <img src={pessoaFixa.avatar} alt={pessoaFixa.nome} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 truncate">{pessoaFixa.nome}</p>
                    <p className="text-[11px] text-gray-500 font-mono">{pessoaFixa.cpf}</p>
                  </div>
                </div>
              )}
              <p className="text-[13px] font-semibold text-gray-500">Qual o motivo dessa autorização?</p>
              <div className="grid grid-cols-2 gap-2.5">
                {MOTIVOS.map((m) => {
                  const cor = MOTIVO_COR[m];
                  const selecionado = motivo === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setMotivo(m)}
                      className={`p-3 rounded-xl border-2 transition-colors text-left ${
                        selecionado ? `${cor.border} ${cor.bg}` : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className={`text-[13px] font-bold ${selecionado ? cor.text : "text-gray-700"}`}>{m}</span>
                    </button>
                  );
                })}
              </div>
              {motivo && !precisaPeriodo && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-[13px] text-gray-500 leading-relaxed">
                  {motivo} tem acesso ligado ao status de associação/função — sem período a definir.
                </div>
              )}
            </div>
          )}

          {fase === "autorizacao" && motivo && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Autorizador</label>
                <input
                  value={autorizador}
                  onChange={(e) => setAutorizador(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600"
                />
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
                  placeholder="Alguma informação adicional sobre essa autorização..."
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
                onClick={() => { setPessoa(null); setPessoaExistente(false); setNome(""); setFase("cpf"); }}
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
              className="flex-1 py-3 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40"
            >
              Continuar
            </button>
          )}

          {fase === "motivo" && (
            <>
              {!pessoaFixa && (
                <button
                  onClick={() => setFase(pessoaExistente ? "confirmacao" : "dados-cadastro")}
                  className="px-5 py-3 rounded-xl font-semibold text-[14px] text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Voltar
                </button>
              )}
              <button
                onClick={handleContinuarMotivo}
                disabled={!motivo || isSubmitting}
                className="flex-1 py-3 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {precisaEspacoEPeriodo ? "Continuar" : (isSubmitting ? "Concedendo..." : <><Check size={16} /> Conceder Autorização</>)}
              </button>
            </>
          )}

          {fase === "autorizacao" && (
            <>
              <button
                onClick={() => setFase("motivo")}
                className="px-5 py-3 rounded-xl font-semibold text-[14px] text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleConceder}
                disabled={isSubmitting || !periodo}
                className="flex-1 py-3 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Concedendo..." : <><Check size={16} /> Conceder Autorização</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
