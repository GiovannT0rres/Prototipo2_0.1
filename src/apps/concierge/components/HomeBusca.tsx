import { useState, useMemo } from "react";
import { Search, Shield, RefreshCw, LogOut, Clock, Users, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Props {
  onBuscar: (cpf: string) => void;
  pessoasNoLocal: any[];
  onSaida: (id: string, nome: string) => void;
}

export function HomeBusca({ onBuscar, pessoasNoLocal, onSaida }: Props) {
  // Estado do input principal (Busca de CPF para nova entrada)
  const [cpfPrincipal, setCpfPrincipal] = useState("");

  // Estados da lista de pessoas no local
  const [filtroLista, setFiltroLista] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- LÓGICA DO INPUT PRINCIPAL ---
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpfPrincipal(value);
  };

  const handleBuscarNovo = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpfPrincipal.length === 14) onBuscar(cpfPrincipal);
  };

  // --- LÓGICA DA LISTA ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simula uma requisição ao servidor para checar outras portarias
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Lista atualizada com sucesso!");
    }, 1000);
  };

  const censurarCpf = (cpf: string) => {
    return cpf.replace(/^\d{3}/, "***").replace(/\d{2}$/, "**");
  };

  // Filtra a lista pelo nome ou CPF digitado no input de filtro
  const listaFiltrada = useMemo(() => {
    const query = filtroLista.toLowerCase();
    return pessoasNoLocal.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.cpf.replace(/\D/g, "").includes(query.replace(/\D/g, ""))
    );
  }, [filtroLista, pessoasNoLocal]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full bg-gray-50">
      
      {/* ================= SEÇÃO SUPERIOR: BUSCA DE CPF ================= */}
      <div className="flex-shrink-0 bg-white p-6 shadow-sm z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-gray-900 leading-tight">PORTARIA</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mt-0.5">
              Controle de Acesso
            </p>
          </div>
        </div>

        <form onSubmit={handleBuscarNovo} className="relative">
          <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            Iniciar Atendimento
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={cpfPrincipal}
              onChange={handleCpfChange}
              placeholder="Digite o CPF..."
              autoFocus
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-5 py-4 text-[18px] font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all placeholder:font-medium tracking-wide text-gray-800"
            />
            <button
              type="submit"
              disabled={cpfPrincipal.length < 14}
              className="h-[60px] px-6 rounded-xl font-bold text-[15px] text-white transition-opacity active:opacity-80 disabled:opacity-40 bg-gray-900 hover:bg-gray-800 flex justify-center items-center gap-2"
            >
              <Search size={20} /> <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>
        </form>

        {/* Dica de teste: quais CPFs simulam cada cenário de usuário existente vs novo */}
        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
          💡 Para testar usuário já cadastrado → Confirmação de Selfie:{" "}
          <span className="font-mono font-semibold text-gray-500">111.222.333-44</span> (João Silva, Sócio
          Titular — acesso livre) ou <span className="font-mono font-semibold text-gray-500">555.666.777-88</span>{" "}
          (Maria Souza, Visitante — já tem 2 autorizações vigentes). Qualquer outro CPF simula usuário novo →
          Validação + Cadastro.
        </p>
      </div>

      {/* ================= SEÇÃO INFERIOR: PESSOAS NO LOCAL ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Controles da Lista */}
        <div className="flex-shrink-0 p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-bold text-gray-900">Quem está no clube</h2>
            <span className="bg-gray-200 text-gray-700 text-[12px] font-bold px-2 py-0.5 rounded-full">
              {pessoasNoLocal.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filtroLista}
                onChange={(e) => setFiltroLista(e.target.value)}
                placeholder="Filtrar nome/CPF..."
                className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-700"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Atualizar lista"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Lista Scrollável */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-3 mt-2">
            <AnimatePresence>
              {listaFiltrada.map((pessoa) => (
                <motion.div
                  key={pessoa.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={pessoa.avatar}
                      alt={pessoa.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <p className="text-[15px] font-bold text-gray-900">{pessoa.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[13px] text-gray-500 font-medium font-mono">
                          {censurarCpf(pessoa.cpf)}
                        </p>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      </div>
                      <p className="text-[12px] text-gray-400 mt-1 flex items-center gap-1 font-medium">
                        <Clock size={12} /> Entrada: {pessoa.entrada}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSaida(pessoa.id, pessoa.name)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut size={16} /> Registrar Saída
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {listaFiltrada.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
                  <Users size={24} />
                </div>
                {pessoasNoLocal.length === 0 ? (
                  <>
                    <p className="text-[15px] font-bold text-gray-900">Ninguém no clube no momento</p>
                    <p className="text-[13px] text-gray-500 mt-1">
                      Assim que alguém der entrada, a pessoa aparece aqui.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[15px] font-bold text-gray-900">Nenhuma pessoa encontrada</p>
                    <p className="text-[13px] text-gray-500 mt-1">
                      Não há registros que correspondam à sua busca atual.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}