import { useState } from "react";
import { UserPlus, Mail, ShieldCheck, X } from "lucide-react";
import { MOCK_ACCESS_MANAGERS } from "../mocks/mockManager";

const CARGOS = ["Coordenador de Eventos", "Gestor de Portaria", "Administração"];

export function GestaoAccessManagers() {
  const [gestores, setGestores] = useState(MOCK_ACCESS_MANAGERS);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState(CARGOS[0]);
  const [escopo, setEscopo] = useState("");

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
        escopo: escopo || "A definir",
        status: "Convite Pendente",
      },
    ]);
    setName("");
    setEmail("");
    setEscopo("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Access Managers</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Equipe com permissão para gerenciar eventos e autorizações (RBAC — sem hierarquia de delegação).
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
            <h2 className="text-[16px] font-bold text-gray-900">Convidar novo Access Manager</h2>
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
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Escopo (opcional)</label>
              <input
                value={escopo}
                onChange={(e) => setEscopo(e.target.value)}
                placeholder="Ex.: Salão Social 1, Baile de Debutantes"
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold text-[15px] py-3.5 rounded-xl active:bg-gray-800 transition-all shadow-sm"
          >
            Enviar Convite
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {gestores.map((gestor) => (
          <div key={gestor.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4">
            <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-900">{gestor.name}</p>
              <p className="text-[12px] text-gray-500 flex items-center gap-1.5">
                <Mail size={12} /> {gestor.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                {gestor.cargo}
              </span>
              <span className="text-[12px] text-gray-500">{gestor.escopo}</span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md ${
                  gestor.status === "Ativo" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {gestor.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
