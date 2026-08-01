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
    toast.error(`Autorização recusada: ${auth.name} → ${auth.destino}`);
    setRecusarModal(null);
  };

  // Botão único reaproveitado pro acesso livre e pra cada autorização da
  // lista — três estados: Dar Entrada / Liberado (transitório) / Saída.
  function BotaoAcesso({ auth, tamanho = "normal" }: { auth: any; tamanho?: "normal" | "grande" }) {
    const noLocal = auth.status === "No local";
    const mostrarLiberado = noLocal && liberadoRecente[auth.id];
    const classeBase =
      tamanho === "grande"
        ? "flex-1 py-4 rounded-xl text-[19px] min-h-[64px]"
        : "flex-1 py-3 rounded-lg text-[17px] min-h-[56px]";

    if (!noLocal) {
      return (
        <button
          onClick={() => handleToggle(auth)}
          className={`${classeBase} font-bold text-white bg-[#0B7A3B] hover:bg-[#096530] transition-colors flex items-center justify-center gap-2`}
        >
          <CheckCircle2 size={tamanho === "grande" ? 22 : 18} strokeWidth={2.25} />
          {tamanho === "grande" ? `Dar entrada — ${auth.destino}` : "Dar Entrada"}
        </button>
      );
    }

    if (mostrarLiberado) {
      return (
        <div className={`${classeBase} font-bold text-emerald-800 bg-emerald-50 flex items-center justify-center gap-2`}>
          <CheckCircle2 size={tamanho === "grande" ? 22 : 18} strokeWidth={2.25} /> Liberado
        </div>
      );
    }

    return (
      <button
        onClick={() => handleToggle(auth)}
        className={`${classeBase} font-bold text-red-700 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2`}
      >
        <LogOut size={tamanho === "grande" ? 22 : 18} strokeWidth={2.25} /> Saída
      </button>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full bg-gray-50">
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center -ml-2 rounded-lg text-gray-600 hover:bg-gray-50 shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-gray-900 text-[17px]">Perfil do Usuário</p>
        <div className="w-14" />
      </div>

      <div className="flex-shrink-0 bg-white px-6 py-5 border-b border-gray-100 flex items-center gap-4">
        <img src={dados.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover shrink-0" />
        <div>
          <h2 className="text-[21px] font-semibold text-gray-900">{dados.name}</h2>
          <p className="text-[17px] text-gray-600 font-mono mt-0.5">{dados.cpf}</p>
          <p className="text-[15px] text-gray-500 mt-1">{dados.type}</p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-5 pb-6 overflow-y-auto">
        <h3 className="text-[15px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
          {temLivreAcesso ? "Acesso" : "Autorizações"}
        </h3>

        {temLivreAcesso ? (
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            {acessoLivre.status === "No local" && (
              <p className="text-[15px] font-medium text-emerald-700 mb-2">No local desde {acessoLivre.entrada}</p>
            )}
            <p className="text-[17px] text-gray-600 mb-4 leading-relaxed">
              {dados.type === "Sócio Titular" ? "Sócio" : "Dependente"} tem livre acesso a todo o clube.
            </p>
            <div className="flex">
              <BotaoAcesso auth={acessoLivre} />
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {autorizacoes.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-gray-500 text-[17px]">
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
                  <div key={auth.id} className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[19px] font-semibold text-gray-900">{auth.destino}</p>
                      <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide pt-0.5 shrink-0">
                        {auth.type}
                      </span>
                    </div>
                    <p className="text-[15px] text-gray-500">
                      {auth.autorizador || "Portaria"} {auth.periodo && `• ${auth.periodo}`}
                    </p>
                    {noLocal && (
                      <p className="text-[15px] font-medium text-emerald-700 mt-1">No local desde {auth.entrada}</p>
                    )}

                    {!ehAUnicaPendente && (
                      <div className="flex gap-2 mt-3.5">
                        <BotaoAcesso auth={auth} />
                        {!noLocal && (
                          <button
                            onClick={() => setRecusarModal(auth)}
                            className="min-h-[56px] px-4 rounded-lg text-gray-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5 text-[15px] font-semibold"
                          >
                            <Ban size={18} strokeWidth={2.25} /> Recusar
                          </button>
                        )}
                      </div>
                    )}
                    {ehAUnicaPendente && (
                      <button
                        onClick={() => setRecusarModal(auth)}
                        className="mt-3.5 min-h-[44px] px-3 -ml-3 rounded-lg text-gray-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5 text-[15px] font-semibold"
                      >
                        <Ban size={16} strokeWidth={2.25} /> Recusar esta autorização
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
              className="w-full flex items-center justify-between gap-1.5 text-[15px] font-semibold text-gray-500 uppercase tracking-wider mb-3 min-h-[44px]"
            >
              <span className="flex items-center gap-1.5">
                <History size={16} strokeWidth={2.25} /> Histórico de Acessos
              </span>
              {historicoAberto ? (
                <ChevronUp size={18} strokeWidth={2.25} />
              ) : (
                <ChevronDown size={18} strokeWidth={2.25} />
              )}
            </button>

            {historicoAberto && (
              <div className="space-y-2">
                {historico.map((h) => (
                  <div key={h.id} className="bg-white px-4 py-3.5 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
                    <p className="text-[17px] font-medium text-gray-800">{h.status} · {h.gate}</p>
                    <p className="text-[15px] text-gray-500 shrink-0">{h.data}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!temLivreAcesso && (
        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100 space-y-2.5">
          {autorizacaoUnica && <BotaoAcesso auth={autorizacaoUnica} tamanho="grande" />}
          <button
            onClick={onNovaAutorizacao}
            className={`w-full rounded-xl font-semibold flex justify-center items-center gap-2 transition-colors ${
              autorizacaoUnica
                ? "py-3 text-[17px] min-h-[56px] text-gray-600 bg-gray-50 hover:bg-gray-100"
                : "py-4 text-[21px] min-h-[64px] text-white bg-[#0F2744] hover:bg-[#0B1D33]"
            }`}
          >
            <Plus size={autorizacaoUnica ? 18 : 22} strokeWidth={2.25} /> Nova Autorização
          </button>
        </div>
      )}

      {recusarModal && (
        <div
          onClick={() => setRecusarModal(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-blur-in"
        >
          <div
            className="bg-white w-full max-w-sm rounded-t-[28px] overflow-hidden shadow-2xl flex flex-col animate-spring-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-5" />
            <div className="px-6 pb-4 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle size={26} strokeWidth={1.75} />
              </div>
              <h3 className="text-[23px] font-bold text-gray-900 mb-2">Recusar Autorização?</h3>
              <p className="text-[17px] text-gray-600 leading-relaxed mb-6">
                Tem certeza que deseja recusar a autorização de <strong className="text-gray-900">{recusarModal.name}</strong> para{" "}
                <strong className="text-gray-900">{recusarModal.destino}</strong>?
              </p>
              <div className="w-full space-y-2.5">
                <button
                  onClick={confirmarRecusa}
                  className="w-full bg-red-600 text-white font-semibold text-[19px] py-4 rounded-2xl ios-press shadow-sm min-h-[64px]"
                >
                  Sim, recusar
                </button>
                <button
                  onClick={() => setRecusarModal(null)}
                  className="w-full bg-[#f2f2f7] text-gray-700 font-semibold text-[19px] py-4 rounded-2xl ios-press min-h-[64px]"
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
