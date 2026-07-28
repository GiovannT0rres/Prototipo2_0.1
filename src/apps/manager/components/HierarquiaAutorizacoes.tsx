import { useState } from "react";
import { ChevronRight, Plus, X, Network } from "lucide-react";
import { MOCK_HIERARQUIAS } from "../mocks/mockManager";

export function HierarquiaAutorizacoes() {
  const [hierarquias, setHierarquias] = useState(MOCK_HIERARQUIAS);
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");
  const [evento, setEvento] = useState("");
  const [niveis, setNiveis] = useState(["", ""]);

  const updateNivel = (index: number, value: string) => {
    setNiveis((prev) => prev.map((n, i) => (i === index ? value : n)));
  };

  const addNivel = () => setNiveis((prev) => [...prev, ""]);
  const removeNivel = (index: number) => setNiveis((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const niveisPreenchidos = niveis.map((n) => n.trim()).filter(Boolean);
    if (!nome || niveisPreenchidos.length < 2) return;

    setHierarquias((prev) => [
      ...prev,
      { id: `h${prev.length + 1}`, nome, evento: evento || "Aplicável a qualquer evento", niveis: niveisPreenchidos },
    ]);
    setNome("");
    setEvento("");
    setNiveis(["", ""]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hierarquia de Autorizações</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Escalas configuráveis de autorização para grandes eventos — não é uma árvore de delegação fixa, é um modelo por evento.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold text-[14px] shadow-sm hover:bg-emerald-700 transition-colors shrink-0"
        >
          <Plus size={16} />
          Nova Hierarquia
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-gray-900">Configurar nova escala</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Nome da hierarquia</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Baile de Debutantes — Buffet"
                required
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Evento (opcional)</label>
              <input
                value={evento}
                onChange={(e) => setEvento(e.target.value)}
                placeholder="Ex.: Baile de Debutantes (22/08/2026)"
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Níveis de autorização (do topo para a base)
            </label>
            {niveis.map((nivel, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-[12px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <input
                  value={nivel}
                  onChange={(e) => updateNivel(i, e.target.value)}
                  placeholder={`Nível ${i + 1} (ex.: Sócio / Cerimonialista)`}
                  className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                {niveis.length > 2 && (
                  <button type="button" onClick={() => removeNivel(i)} className="text-gray-400 hover:text-red-500 shrink-0">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addNivel}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700 hover:text-emerald-800 mt-1"
            >
              <Plus size={14} /> Adicionar nível
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold text-[15px] py-3.5 rounded-xl active:bg-gray-800 transition-all shadow-sm"
          >
            Salvar Hierarquia
          </button>
        </form>
      )}

      <div className="space-y-4">
        {hierarquias.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Network size={18} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900">{h.nome}</p>
                <p className="text-[12px] text-gray-500">{h.evento}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {h.niveis.map((nivel, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[13px] font-semibold text-gray-800">{nivel}</span>
                  </div>
                  {i < h.niveis.length - 1 && <ChevronRight size={16} className="text-gray-300 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
