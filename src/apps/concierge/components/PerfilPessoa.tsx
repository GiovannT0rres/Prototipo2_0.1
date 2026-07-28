import { useState } from "react";
import { ArrowLeft, Plus, CheckCircle2, LogOut, History, LogIn } from "lucide-react";
import { motion } from "motion/react";
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

  // Sócio Titular e Familiar têm acesso liberado por natureza — não dependem
  // de uma autorização vinda de um sponsor, então não faz sentido mostrar
  // "Nenhuma autorização encontrada" pra eles.
  const temLivreAcesso = dados.type === "Sócio Titular" || dados.type === "Familiar";

  const handleToggle = (auth: any) => {
    const estavaNoLocal = auth.status === "No local";
    setAutorizacoes((prev: any[]) =>
      prev.map((a) => (a.id === auth.id ? { ...a, status: estavaNoLocal ? "Fora do clube" : "No local" } : a)),
    );
    onLiberarAcesso({ ...auth, _saida: estavaNoLocal });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full bg-gray-50">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <p className="font-bold text-gray-900 text-[15px]">Perfil do Usuário</p>
        <div className="w-10" />
      </div>

      <div className="flex-shrink-0 bg-white p-6 border-b border-gray-100 flex items-center gap-4">
        <img src={dados.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover" />
        <div>
          <h2 className="text-[18px] font-bold text-gray-900">{dados.name}</h2>
          <p className="text-[13px] text-gray-500 font-medium font-mono">{dados.cpf}</p>
          <span className="inline-block mt-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
            {dados.type}
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">
            {temLivreAcesso ? "Acesso" : "Autorizações Vigentes"}
          </h3>
        </div>

        {temLivreAcesso ? (
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[13px] text-gray-500 mb-4">
              {dados.type === "Sócio Titular" ? "Sócio" : "Dependente"} tem livre acesso a todo o clube — não
              depende de autorização de terceiros para entrar.
            </p>
            <button
              onClick={() => onLiberarAcesso({ id: "livre", spot: "Clube Inteiro", type: dados.type })}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <CheckCircle2 size={16} /> Liberar Acesso (Registrar Entrada)
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {autorizacoes.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center text-gray-500 text-[14px]">
                Nenhuma autorização ativa encontrada.
              </div>
            ) : (
              autorizacoes.map((auth: any) => {
                const noLocal = auth.status === "No local";
                return (
                  <div key={auth.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase px-2 py-0.5 rounded">
                        {auth.type}
                      </span>
                      {noLocal && (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <LogIn size={12} /> No local desde {auth.entrada}
                        </span>
                      )}
                    </div>
                    <p className="text-[16px] font-bold text-gray-900">{auth.spot}</p>
                    <p className="text-[13px] text-gray-500 mb-4">
                      Responsável: <strong className="text-gray-700">{auth.sponsor || "Portaria"}</strong>
                    </p>

                    <button
                      onClick={() => handleToggle(auth)}
                      className={`w-full py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-colors ${
                        noLocal ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {noLocal ? (
                        <><LogOut size={16} /> Registrar Saída</>
                      ) : (
                        <><CheckCircle2 size={16} /> Liberar Acesso (Registrar Entrada)</>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mb-4 mt-8">
          <History size={16} className="text-gray-400" />
          <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Histórico de Acessos</h3>
        </div>

        <div className="space-y-2">
          {historico.length === 0 ? (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center text-gray-500 text-[13px]">
              Nenhum acesso registrado ainda.
            </div>
          ) : (
            historico.map((h) => (
              <div key={h.id} className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  h.status === "Entrada" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                }`}>
                  {h.status === "Entrada" ? <LogIn size={16} /> : <LogOut size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900">{h.status} • {h.gate}</p>
                  <p className="text-[12px] text-gray-500">{h.data}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {!temLivreAcesso && (
        <div className="p-6 bg-white border-t border-gray-100">
          <button
            onClick={onNovaAutorizacao}
            className="w-full py-4 rounded-xl font-bold text-[15px] text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
          >
            <Plus size={20} /> Nova Autorização (Portaria como Responsável)
          </button>
        </div>
      )}
    </motion.div>
  );
}
