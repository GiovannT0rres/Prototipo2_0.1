import { useState } from "react";
import { ArrowLeft, Plus, CheckCircle2, LogOut, History, Ban, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { MOCK_ACCESS_HISTORY } from "../mocks/mockConcierge";

interface Props {
  dados: any;
  onNovaAutorizacao: () => void;
  onLiberarAcesso: (auth: any) => void;
  onVoltar: () => void;
}

export function PerfilPessoa({ dados, onNovaAutorizacao, onLiberarAcesso, onVoltar }: Props) {
  const [autorizacoes, setAutorizacoes] = useState(dados.autorizacoes || []);
  const historico = MOCK_ACCESS_HISTORY[dados.id] || [];
  const [historicoAberto, setHistoricoAberto] = useState(false);

  // Sócio Titular e Dependente têm acesso liberado por natureza — não dependem
  // de uma autorização vinda de um sponsor, então não faz sentido mostrar
  // "Nenhuma autorização encontrada" pra eles.
  const temLivreAcesso = dados.type === "Sócio Titular" || dados.type === "Dependente";

  // Acesso livre não vem de uma lista de autorizações, mas se comporta igual
  // pra fins de toggle Entrada/Saída — por isso vira um pseudo-registro local.
  const [acessoLivre, setAcessoLivre] = useState({
    id: "livre",
    name: dados.name,
    avatar: dados.avatar,
    cpf: dados.cpf,
    type: dados.type,
    destino: "Clube Inteiro",
    status: "Fora do clube",
    entrada: null as string | null,
  });

  // Logo após liberar, o botão mostra "Liberado" por um instante (confirmação
  // visual) antes de virar "Saída" — deixa claro que a partir daí um novo
  // clique registra a saída, em vez de já nascer parecendo uma ação de saída.
  const [liberadoRecente, setLiberadoRecente] = useState<Record<string, boolean>>({});

  // Só existe uma autorização pendente (fora do clube) — caso dominante do
  // atendimento. Aqui "Dar Entrada" vira a ação primária fixa do rodapé, com
  // o destino escrito no próprio botão (design.md §14.8: dar entrada acontece
  // em quase todo atendimento e merece a posição de maior destaque, não
  // "Nova Autorização", que é a exceção).
  const autorizacoesForaDoClube = autorizacoes.filter((a: any) => a.status !== "No local");
  const autorizacaoUnica = autorizacoesForaDoClube.length === 1 ? autorizacoesForaDoClube[0] : null;

  const handleToggle = (auth: any) => {
    const estavaNoLocal = auth.status === "No local";
    const novoStatus = estavaNoLocal ? "Fora do clube" : "No local";
    const novaEntrada = estavaNoLocal ? null : "Agora";

    if (auth.id === "livre") {
      setAcessoLivre((prev) => ({ ...prev, status: novoStatus, entrada: novaEntrada }));
    } else {
      setAutorizacoes((prev: any[]) =>
        prev.map((a) => (a.id === auth.id ? { ...a, status: novoStatus, entrada: novaEntrada } : a)),
      );
    }
    onLiberarAcesso({ ...auth, status: novoStatus, entrada: novaEntrada, _saida: estavaNoLocal });

    if (!estavaNoLocal) {
      setLiberadoRecente((prev) => ({ ...prev, [auth.id]: true }));
      setTimeout(() => {
        setLiberadoRecente((prev) => ({ ...prev, [auth.id]: false }));
      }, 1400);
    }
  };

  const [recusarModal, setRecusarModal] = useState<any>(null);

  const confirmarRecusa = () => {
    const auth = recusarModal;
    setAutorizacoes((prev: any[]) => prev.filter((a) => a.id !== auth.id));
    toast.error(`Autorização recusada: ${auth.name} → ${auth.destino}`, { duration: 8000 });
    setRecusarModal(null);
  };

  // Botão único reaproveitado pro acesso livre e pra cada autorização da
  // lista — três estados: Dar Entrada / Liberado (transitório) / Saída.
  function BotaoAcesso({ auth, tamanho = "normal" }: { auth: any; tamanho?: "normal" | "grande" }) {
    const noLocal = auth.status === "No local";
    const mostrarLiberado = noLocal && liberadoRecente[auth.id];
    const classeBase =
      tamanho === "grande"
        ? "flex-1 py-4 rounded-[14px] text-[21px] min-h-[64px]"
        : "flex-1 py-3 rounded-[14px] text-[19px] min-h-[56px]";

    if (!noLocal) {
      return (
        <button
          onClick={() => handleToggle(auth)}
          className={`${classeBase} font-semibold text-white bg-[var(--es-success)] hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5`}
        >
          <CheckCircle2 size={tamanho === "grande" ? 26 : 22} strokeWidth={2.25} />
          {tamanho === "grande" ? `Dar entrada — ${auth.destino}` : "Dar Entrada"}
        </button>
      );
    }

    if (mostrarLiberado) {
      return (
        <div className={`${classeBase} font-semibold text-[var(--es-success)] bg-[var(--es-success-soft)] flex items-center justify-center gap-2.5`}>
          <CheckCircle2 size={tamanho === "grande" ? 26 : 22} strokeWidth={2.25} /> Liberado
        </div>
      );
    }

    return (
      <button
        onClick={() => handleToggle(auth)}
        className={`${classeBase} font-semibold text-[var(--es-danger)] bg-[var(--es-danger-soft)] hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5`}
      >
        <LogOut size={tamanho === "grande" ? 26 : 22} strokeWidth={2.25} /> Saída
      </button>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full bg-[var(--es-bg)]">
      <div className="flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] bg-[var(--es-surface)] flex items-center justify-between">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center -ml-2 rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-[var(--es-ink)] text-[17px]">Perfil do Usuário</p>
        <div className="w-14" />
      </div>

      <div className="flex-shrink-0 bg-[var(--es-surface)] px-6 py-5 border-b border-[var(--es-border)] flex items-center gap-4">
        <img src={dados.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover shrink-0" />
        <div>
          <h2 className="text-[21px] font-semibold text-[var(--es-ink)]">{dados.name}</h2>
          <p className="text-[17px] text-[var(--es-ink-2)] tabular-nums mt-0.5">{dados.cpf}</p>
          <p className="text-[17px] text-[var(--es-ink-3)] mt-1">{dados.type}</p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-5 pb-6 overflow-y-auto">
        <h3 className="text-[17px] font-semibold text-[var(--es-ink-3)] uppercase tracking-wider mb-3">
          {temLivreAcesso ? "Acesso" : "Autorizações"}
        </h3>

        {temLivreAcesso ? (
          <div className="bg-[var(--es-surface)] p-4 rounded-[14px] border border-[var(--es-border)]">
            {acessoLivre.status === "No local" && (
              <p className="text-[17px] font-medium text-[var(--es-success)] mb-2">No local desde {acessoLivre.entrada}</p>
            )}
            <p className="text-[19px] text-[var(--es-ink-2)] mb-4 leading-relaxed">
              {dados.type === "Sócio Titular" ? "Sócio" : "Dependente"} tem livre acesso a todo o clube.
            </p>
            <div className="flex">
              <BotaoAcesso auth={acessoLivre} />
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {autorizacoes.length === 0 ? (
              <div className="bg-[var(--es-surface)] p-6 rounded-[14px] border border-[var(--es-border)] text-center text-[var(--es-ink-3)] text-[19px]">
                Nenhuma autorização ativa encontrada.
              </div>
            ) : (
              autorizacoes.map((auth: any) => {
                const noLocal = auth.status === "No local";
                // Quando há só uma autorização pendente, ela já ganhou o botão
                // primário do rodapé — o cartão mostra só o status e a saída
                // de recusa, sem duplicar o "Dar Entrada" aqui dentro.
                const ehAUnicaPendente = !noLocal && autorizacaoUnica?.id === auth.id;

                return (
                  <div key={auth.id} className="bg-[var(--es-surface)] p-4 rounded-[14px] border border-[var(--es-border)]">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[19px] font-semibold text-[var(--es-ink)]">{auth.destino}</p>
                      <span className="text-[17px] font-semibold text-[var(--es-ink-3)] uppercase tracking-wide pt-0.5 shrink-0">
                        {auth.type}
                      </span>
                    </div>
                    <p className="text-[17px] text-[var(--es-ink-3)]">
                      {auth.autorizador || "Portaria"} {auth.periodo && `• ${auth.periodo}`}
                    </p>
                    {noLocal && (
                      <p className="text-[17px] font-medium text-[var(--es-success)] mt-1">No local desde {auth.entrada}</p>
                    )}

                    {/* Recusar nunca fica adjacente ao botão de entrada — é a
                        receita clássica do erro de toque (design.md §14.8
                        item 5). Fica separado, com rótulo textual próprio. */}
                    {!ehAUnicaPendente && (
                      <div className="mt-3.5">
                        <BotaoAcesso auth={auth} />
                        {!noLocal && (
                          <button
                            onClick={() => setRecusarModal(auth)}
                            className="mt-2 min-h-[44px] px-3 -ml-3 rounded-[14px] text-[var(--es-ink-2)] hover:text-[var(--es-danger)] hover:bg-[var(--es-danger-soft)] transition-colors flex items-center gap-1.5 text-[17px] font-semibold"
                          >
                            <Ban size={20} strokeWidth={2.25} /> Recusar esta autorização
                          </button>
                        )}
                      </div>
                    )}
                    {ehAUnicaPendente && (
                      <button
                        onClick={() => setRecusarModal(auth)}
                        className="mt-3.5 min-h-[44px] px-3 -ml-3 rounded-[14px] text-[var(--es-ink-2)] hover:text-[var(--es-danger)] hover:bg-[var(--es-danger-soft)] transition-colors flex items-center gap-1.5 text-[17px] font-semibold"
                      >
                        <Ban size={20} strokeWidth={2.25} /> Recusar esta autorização
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {historico.length > 0 && (
          <div className="mt-7">
            <button
              onClick={() => setHistoricoAberto((v) => !v)}
              className="w-full flex items-center justify-between gap-1.5 text-[17px] font-semibold text-[var(--es-ink-3)] uppercase tracking-wider mb-3 min-h-[44px]"
            >
              <span className="flex items-center gap-1.5">
                <History size={20} strokeWidth={2.25} /> Ver histórico de acessos
              </span>
              {historicoAberto ? (
                <ChevronUp size={22} strokeWidth={2.25} />
              ) : (
                <ChevronDown size={22} strokeWidth={2.25} />
              )}
            </button>

            {historicoAberto && (
              <div className="space-y-2">
                {historico.map((h) => (
                  <div key={h.id} className="bg-[var(--es-surface)] px-4 py-3.5 rounded-[14px] border border-[var(--es-border)] flex items-center justify-between gap-3">
                    <p className="text-[17px] font-medium text-[var(--es-ink-2)]">{h.status} · {h.gate}</p>
                    <p className="text-[17px] text-[var(--es-ink-3)] shrink-0">{h.data}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!temLivreAcesso && (
        <div className="flex-shrink-0 p-4 pt-6 bg-[var(--es-surface)] border-t border-[var(--es-border)] space-y-2.5">
          {/* Nova Autorização rebaixada a secundário, acima do primário — dar
              entrada é o caso dominante (design.md §14.8 item 1 e 4). */}
          <button
            onClick={onNovaAutorizacao}
            className={`w-full rounded-[14px] font-semibold flex justify-center items-center gap-2 transition-all active:scale-[0.98] ${
              autorizacaoUnica
                ? "py-3 text-[19px] min-h-[56px] text-[var(--es-ink-2)] bg-[var(--es-bg)] hover:bg-[var(--es-border-strong)]/20"
                : "py-4 text-[21px] min-h-[64px] text-white bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)]"
            }`}
          >
            <Plus size={autorizacaoUnica ? 22 : 26} strokeWidth={2.25} /> Nova Autorização
          </button>
          {autorizacaoUnica && <BotaoAcesso auth={autorizacaoUnica} tamanho="grande" />}
        </div>
      )}

      {recusarModal && (
        <div
          onClick={() => setRecusarModal(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-blur-in"
        >
          <div
            className="bg-[var(--es-surface)] w-full max-w-sm rounded-t-[28px] overflow-hidden shadow-2xl flex flex-col animate-spring-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[var(--es-border-strong)] rounded-full mx-auto mt-3 mb-5" />
            <div className="px-6 pb-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[var(--es-danger-soft)] rounded-full flex items-center justify-center text-[var(--es-danger)] mb-4">
                <AlertTriangle size={32} strokeWidth={2.25} />
              </div>
              <h3 className="text-[28px] font-bold text-[var(--es-ink)] mb-2">Recusar autorização?</h3>
              <p className="text-[19px] text-[var(--es-ink-2)] leading-relaxed mb-6">
                Tem certeza que deseja recusar a autorização de <strong className="text-[var(--es-ink)]">{recusarModal.name}</strong> para{" "}
                <strong className="text-[var(--es-ink)]">{recusarModal.destino}</strong>?
              </p>
              <div className="w-full space-y-2.5">
                <button
                  onClick={confirmarRecusa}
                  className="w-full bg-[var(--es-danger)] text-white font-semibold text-[21px] py-4 rounded-[14px] active:scale-[0.98] transition-all shadow-sm min-h-[64px]"
                >
                  Sim, recusar
                </button>
                <button
                  onClick={() => setRecusarModal(null)}
                  className="w-full bg-[var(--es-bg)] text-[var(--es-ink-2)] font-semibold text-[21px] py-4 rounded-[14px] active:scale-[0.98] transition-all min-h-[64px]"
                >
                  Cancelar
                </button>
              </div>
            </div>
            <div className="h-5" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
