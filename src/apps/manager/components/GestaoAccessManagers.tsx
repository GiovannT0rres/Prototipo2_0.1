import { useState } from "react";
import { UserPlus, Mail, ShieldCheck, X, Clock, UserCog, ChevronDown, ChevronRight } from "lucide-react";
import { MOCK_ACCESS_MANAGERS, type AccessManagerSubordinado } from "../mocks/mockManager";

const CARGOS = ["Cerimonialista", "Coordenador de Eventos", "Gestor de Portaria", "Administração"];

export function GestaoAccessManagers() {
  const [gestores, setGestores] = useState(MOCK_ACCESS_MANAGERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState(CARGOS[0]);
  const [vinculo, setVinculo] = useState("");
  const [temporario, setTemporario] = useState(true);
  const [validade, setValidade] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setGestores((prev) => [
      ...prev,
      {
        id: `am${prev.length + 1}`,
        name,
        email,
        cargo,
        vinculo: vinculo || "A definir",
        temporario,
        validade: temporario ? (validade || "A definir") : null,
        promovidoPor: "Administração",
        status: "Convite Pendente",
        subordinados: [] as AccessManagerSubordinado[],
      },
    ]);
    setName("");
    setEmail("");
    setVinculo("");
    setValidade("");
    setTemporario(true);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Access Managers</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Poder temporário de convidar pessoas e vinculá-las a um lugar (ex.: um cerimonialista
            de evento) — o Manager acompanha quem promoveu quem e quem cada um trouxe abaixo.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold text-[14px] shadow-sm hover:bg-emerald-700 transition-colors shrink-0"
        >
          <UserPlus size={16} />
          Novo Gestor
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-gray-900">Promover novo Access Manager</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                required
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@paccclube.com.br"
                required
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Cargo</label>
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {CARGOS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Vinculado a (evento/espaço)</label>
              <input
                value={vinculo}
                onChange={(e) => setVinculo(e.target.value)}
                placeholder="Ex.: Baile de Debutantes, Salão Social 1"
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-gray-900">Poder temporário?</p>
              <p className="text-[12px] text-gray-500">Desligado, vira uma função permanente da equipe (ex.: portaria).</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={temporario}
                onChange={(e) => setTemporario(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {temporario && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Validade</label>
              <input
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                placeholder="Ex.: 22/08/2026 a 23/08/2026"
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold text-[15px] py-3.5 rounded-xl active:bg-gray-800 transition-all shadow-sm"
          >
            Enviar Convite
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {gestores.map((gestor) => {
          const isExpanded = expandedId === gestor.id;
          const temSubordinados = gestor.subordinados.length > 0;
          return (
            <div key={gestor.id}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4">
                <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-gray-900">{gestor.name}</p>
                  <p className="text-[12px] text-gray-500 flex items-center gap-1.5">
                    <Mail size={12} /> {gestor.email}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    Vinculado a: <span className="font-semibold text-gray-700">{gestor.vinculo}</span> • Promovido por: <span className="font-semibold text-gray-700">{gestor.promovidoPor}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                    {gestor.cargo}
                  </span>
                  {gestor.temporario && (
                    <span className="text-[11px] font-bold uppercase tracking-wide bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Clock size={11} /> {gestor.validade}
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md ${
                      gestor.status === "Ativo" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {gestor.status}
                  </span>
                </div>
              </div>

              {temSubordinados && (
                <div className="px-6 pb-4">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : gestor.id)}
                    className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <UserCog size={14} />
                    {gestor.subordinados.length} pessoa(s) vinculada(s) abaixo
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 ml-2 pl-4 border-l-2 border-emerald-100 space-y-2">
                      {gestor.subordinados.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3.5 py-2.5">
                          <span className="text-[13px] font-semibold text-gray-800">{sub.name}</span>
                          <span className="text-[11px] font-bold uppercase tracking-wide bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md">
                            {sub.categoria}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
