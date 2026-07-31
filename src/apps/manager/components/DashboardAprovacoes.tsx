import { useMemo, useState } from "react";
import {
  Check, X, Plus, UserPlus,
  Link2, Sparkles, Wand2, Play, ChevronDown, Copy, Ban,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  getAcessosCriados,
  getConvites,
  getPessoasConvidadas,
  simularConclusaoCadastro,
  recusarPessoaConvidada,
  recusarPessoasConvidadas,
  aceitarPessoasConvidadas,
  revogarConvite,
  type Convite,
} from "../mocks/mockManagerStore";
import { CriarUsuarioModal } from "./CriarUsuarioModal";
import { CriarConviteModal } from "./CriarConviteModal";
import { ConvitePendenteCard } from "./ConvitePendenteCard";

export function DashboardAprovacoes() {
  const [modalUsuario, setModalUsuario] = useState(false);
  const [modalConvite, setModalConvite] = useState<"aberto" | "predefinido" | null>(null);
  const [menuConviteAberto, setMenuConviteAberto] = useState(false);

  const [acessosCriados, setAcessosCriados] = useState(() => getAcessosCriados());
  const [convites, setConvites] = useState(() => getConvites());
  const [pessoasConvidadas, setPessoasConvidadas] = useState(() => getPessoasConvidadas());
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  const recarregarConvites = () => {
    setConvites(getConvites());
    setPessoasConvidadas(getPessoasConvidadas());
  };

  const handleSimular = (convite: Convite) => {
    simularConclusaoCadastro(convite);
    setPessoasConvidadas(getPessoasConvidadas());
    toast.success("Cadastro concluído pelo Bot (simulado).");
  };

  const handleCopiarConvite = (convite: Convite) => {
    navigator.clipboard?.writeText(convite.url);
    toast.success("Link copiado.");
  };

  const handleRevogarConvite = (convite: Convite) => {
    revogarConvite(convite.id);
    setConvites(getConvites());
    toast.error("Convite revogado — o link não vale mais.");
  };

  const handleRecusar = (id: string) => {
    recusarPessoaConvidada(id);
    setPessoasConvidadas(getPessoasConvidadas());
    toast.error("Convite recusado.");
  };

  const handleAceitarUm = (id: string) => {
    aceitarPessoasConvidadas([id]);
    setPessoasConvidadas(getPessoasConvidadas());
    toast.success("Convite aceito.");
  };

  const pendentesConfiguracao = pessoasConvidadas.filter((p) => p.status === "aguardando-configuracao");
  const pendentesAceite = pessoasConvidadas.filter((p) => p.status === "aguardando-aceite");

  // Uma pessoa pode ter chegado por qualquer um de vários convites
  // pré-definidos diferentes (ex.: dois eventos ao mesmo tempo) — agrupado
  // por conviteId pra não misturar lotes na hora de aceitar em massa.
  const gruposPredefinidos = useMemo(() => {
    const porConvite = new Map<string, typeof pendentesAceite>();
    pendentesAceite.forEach((p) => {
      const lista = porConvite.get(p.conviteId) || [];
      lista.push(p);
      porConvite.set(p.conviteId, lista);
    });
    return Array.from(porConvite.entries()).map(([conviteId, pessoas]) => ({
      conviteId,
      label: convites.find((c) => c.id === conviteId)?.label || "Convite",
      pessoas,
    }));
  }, [pendentesAceite, convites]);

  const toggleSelecionado = (id: string) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id); else novo.add(id);
      return novo;
    });
  };

  const toggleTodosDoGrupo = (ids: string[]) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      const todosSelecionados = ids.every((id) => novo.has(id));
      ids.forEach((id) => (todosSelecionados ? novo.delete(id) : novo.add(id)));
      return novo;
    });
  };

  const handleAceitarSelecionadosDoGrupo = (ids: string[]) => {
    const selecionadosDoGrupo = ids.filter((id) => selecionados.has(id));
    aceitarPessoasConvidadas(selecionadosDoGrupo);
    setPessoasConvidadas(getPessoasConvidadas());
    toast.success(`${selecionadosDoGrupo.length} convite(s) aceito(s) em lote.`);
    setSelecionados((prev) => {
      const novo = new Set(prev);
      selecionadosDoGrupo.forEach((id) => novo.delete(id));
      return novo;
    });
  };

  const handleRecusarSelecionadosDoGrupo = (ids: string[]) => {
    const selecionadosDoGrupo = ids.filter((id) => selecionados.has(id));
    recusarPessoasConvidadas(selecionadosDoGrupo);
    setPessoasConvidadas(getPessoasConvidadas());
    toast.error(`${selecionadosDoGrupo.length} convite(s) recusado(s) em lote.`);
    setSelecionados((prev) => {
      const novo = new Set(prev);
      selecionadosDoGrupo.forEach((id) => novo.delete(id));
      return novo;
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ativar</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Configuração de convites e criação direta de usuário/acesso.
          </p>
        </div>

        {/* Atalhos discretos — servem pra teste/demo (simular alguém completando
            cadastro etc.), não são a ação principal da tela, por isso ficam
            pequenos e sem destaque. */}
        <div className="flex items-center gap-4 text-[12px] shrink-0">
          <button
            onClick={() => setModalUsuario(true)}
            className="text-gray-400 hover:text-gray-600 underline decoration-dotted underline-offset-4 transition-colors"
          >
            + Criar Usuário (teste)
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuConviteAberto((v) => !v)}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 underline decoration-dotted underline-offset-4 transition-colors"
            >
              + Gerar Convite (teste) <ChevronDown size={12} />
            </button>
            {menuConviteAberto && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuConviteAberto(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20">
                  <button
                    onClick={() => { setModalConvite("aberto"); setMenuConviteAberto(false); }}
                    className="w-full text-left px-3.5 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Convite aberto
                  </button>
                  <button
                    onClick={() => { setModalConvite("predefinido"); setMenuConviteAberto(false); }}
                    className="w-full text-left px-3.5 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Convite pré-definido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Convites ativos — links gerados nesta sessão, com atalho de teste */}
      {convites.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <Link2 size={18} className="text-gray-500" />
            <span className="text-[15px] font-semibold text-gray-700">Convites Ativos</span>
          </div>
          <div className="divide-y divide-gray-50">
            {convites.map((c) => {
              const pessoasDoConvite = pessoasConvidadas.filter((p) => p.conviteId === c.id);
              const aceitos = pessoasDoConvite.filter((p) => p.status === "aceito").length;
              const pendentes = pessoasDoConvite.filter(
                (p) => p.status === "aguardando-configuracao" || p.status === "aguardando-aceite",
              ).length;

              return (
                <div key={c.id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-900 truncate">
                      {c.label} <span className="text-[11px] font-bold uppercase text-gray-400 ml-1">{c.tipo}</span>
                    </p>
                    <p className="text-[12px] text-gray-500 font-mono truncate">{c.url}</p>

                    {c.tipo === "predefinido" && (
                      <p className="text-[12px] text-gray-500 truncate mt-0.5">
                        {c.motivo}
                        {c.destino && ` • ${c.destino}`}
                        {c.autorizador && ` • ${c.autorizador}`}
                        {c.periodo && ` • ${c.periodo}`}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[11px] text-gray-400">Criado {c.criadoEm}</span>
                      {pessoasDoConvite.length > 0 && (
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                          {pessoasDoConvite.length} pessoa(s) usaram este link
                          {aceitos > 0 && ` • ${aceitos} aceito(s)`}
                          {pendentes > 0 && ` • ${pendentes} pendente(s)`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopiarConvite(c)}
                      title="Copiar link"
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => handleRevogarConvite(c)}
                      title="Revogar convite — o link deixa de valer"
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Ban size={15} />
                    </button>
                    <button
                      onClick={() => handleSimular(c)}
                      title="Simular Conclusão via Bot (teste — não há integração real com o app Bot neste protótipo)"
                      className="p-2 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                    >
                      <Play size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Convites abertos — cada pessoa que completou o cadastro precisa que o
          Manager escolha o motivo (abre as configurações que faltam logo
          abaixo, no mesmo card) ou rejeite. Grade, não lista, pra caber várias
          pessoas na tela ao mesmo tempo. */}
      {pendentesConfiguracao.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles size={16} className="text-gray-400" />
            <h2 className="text-[15px] font-bold text-gray-900">Convites Aguardando Configuração</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-600">{pendentesConfiguracao.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
            {pendentesConfiguracao.map((p) => (
              <ConvitePendenteCard key={p.id} pessoa={p} onAtualizado={recarregarConvites} />
            ))}
          </div>
        </div>
      )}

      {/* Convites pré-definidos — agrupados por convite (uma pessoa pode ter
          vindo de qualquer um de vários lotes diferentes), cada grupo com seu
          próprio "marcar todos" e aceite em lote, pra não misturar eventos. */}
      {gruposPredefinidos.map((grupo) => {
        const idsDoGrupo = grupo.pessoas.map((p) => p.id);
        const todosSelecionados = idsDoGrupo.length > 0 && idsDoGrupo.every((id) => selecionados.has(id));
        const quantidadeSelecionada = idsDoGrupo.filter((id) => selecionados.has(id)).length;

        return (
          <div key={grupo.conviteId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-purple-50/40">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={todosSelecionados}
                    onChange={() => toggleTodosDoGrupo(idsDoGrupo)}
                    className="w-4 h-4 rounded accent-purple-600"
                  />
                  <span className="text-[12px] font-semibold text-gray-500">Marcar todos</span>
                </label>
                <div className="flex items-center gap-2">
                  <Wand2 size={16} className="text-purple-600" />
                  <span className="text-[15px] font-semibold text-purple-700">{grupo.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-purple-100 text-purple-700">{grupo.pessoas.length}</span>
                </div>
              </div>
              {quantidadeSelecionada > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRecusarSelecionadosDoGrupo(idsDoGrupo)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-semibold text-[13px] transition-colors"
                  >
                    <X size={15} /> Recusar {quantidadeSelecionada}
                  </button>
                  <button
                    onClick={() => handleAceitarSelecionadosDoGrupo(idsDoGrupo)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white bg-purple-600 hover:bg-purple-700 font-semibold text-[13px] transition-colors"
                  >
                    <Check size={15} /> Aceitar {quantidadeSelecionada}
                  </button>
                </div>
              )}
            </div>
            <div className="divide-y divide-gray-50">
              {grupo.pessoas.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-3.5">
                  <input
                    type="checkbox"
                    checked={selecionados.has(p.id)}
                    onChange={() => toggleSelecionado(p.id)}
                    className="w-4 h-4 rounded accent-purple-600 shrink-0"
                  />
                  <img src={p.avatar} alt={p.nome} className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-900 truncate">{p.nome}</p>
                    <p className="text-[12px] text-gray-500 truncate">
                      {p.motivo} • {p.destino} • {p.autorizador} • {p.periodo}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRecusar(p.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Recusar"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleAceitarUm(p.id)}
                      className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Aceitar"
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Acessos criados diretamente pelo Manager (Criar Usuário) */}
      {acessosCriados.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
            <UserPlus size={18} className="text-gray-500" />
            <span className="text-[15px] font-semibold text-gray-700">Usuários Criados Recentemente</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-600">{acessosCriados.length}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {acessosCriados.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900 truncate">{item.nome}</p>
                  <p className="text-[12px] text-gray-500">
                    {item.categoria}
                    {item.titularVinculado && ` • Vinculado a ${item.titularVinculado}`}
                    {item.destino && ` • ${item.destino}`}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 shrink-0">{item.criadoEm}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendentesConfiguracao.length === 0 && gruposPredefinidos.length === 0 && convites.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
          <p className="text-[16px] font-bold text-gray-900">Nenhum convite ativo</p>
          <p className="text-[14px] text-gray-500 mt-1">Gere um convite ou crie um usuário pra começar.</p>
        </div>
      )}

      {modalUsuario && (
        <CriarUsuarioModal
          onFechar={() => setModalUsuario(false)}
          onCriado={() => setAcessosCriados(getAcessosCriados())}
        />
      )}

      {modalConvite && (
        <CriarConviteModal
          predefinido={modalConvite === "predefinido"}
          onFechar={() => setModalConvite(null)}
          onCriado={recarregarConvites}
        />
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
}
