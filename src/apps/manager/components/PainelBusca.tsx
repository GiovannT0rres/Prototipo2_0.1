import type { ReactNode } from "react";
import { Clock, MapPin, AlertTriangle, PartyPopper, User, Users, ShieldCheck, KeyRound, DoorOpen, ChevronRight, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PessoaIndexada, Tag } from "../filters";

const ICONE_SECAO: Record<Tag["secao"], LucideIcon> = {
  cadastro: Gauge,
  perfil: User,
  status: Clock,
  presenca: MapPin,
  financeiro: AlertTriangle,
  evento: PartyPopper,
  autorizador: Users,
};

const ICONE_PERFIL: Record<string, LucideIcon> = {
  "Sócio Titular": User,
  "Dependente": User,
  "Visitante": User,
  "Prestador de Serviço": KeyRound,
  "Equipe Administrativa": ShieldCheck,
  "Porteiro": DoorOpen,
};

interface PainelBuscaProps {
  texto: string;
  tagsAtivas: string[];
  recentes: PessoaIndexada[];
  pendentes: PessoaIndexada[];
  sugestoesPessoas: PessoaIndexada[];
  sugestoesTags: Tag[];
  tagsPorSecao: Partial<Record<Tag["secao"], Tag[]>>;
  onEscolherPessoa: (id: string) => void;
  onToggleTag: (id: string) => void;
  onVerbo: (verbo: "pessoas" | "pendencias" | "notificacoes" | "nova" | "convite") => void;
}

const SECOES_DIREITA: { secao: Tag["secao"]; titulo: string }[] = [
  { secao: "cadastro", titulo: "Precisa de você" },
  { secao: "status", titulo: "Precisa de você" },
  { secao: "financeiro", titulo: "Precisa de você" },
  { secao: "presenca", titulo: "Agora" },
  { secao: "evento", titulo: "Agora" },
  { secao: "perfil", titulo: "Perfil de acesso" },
  { secao: "autorizador", titulo: "Autorizado por" },
];

const ROTULO_VERBO: Record<Parameters<PainelBuscaProps["onVerbo"]>[0], string> = {
  pessoas: "Pessoas",
  pendencias: "Pendências",
  notificacoes: "Notificações",
  nova: "Nova autorização",
  convite: "Gerar convite",
};

export function PainelBusca({
  texto,
  tagsAtivas,
  recentes,
  pendentes,
  sugestoesPessoas,
  sugestoesTags,
  tagsPorSecao,
  onEscolherPessoa,
  onToggleTag,
  onVerbo,
}: PainelBuscaProps) {
  const digitando = texto.trim().length > 0;

  const gruposDireita = new Map<string, Tag[]>();
  SECOES_DIREITA.forEach(({ secao, titulo }) => {
    const existentes = gruposDireita.get(titulo) ?? [];
    const novos = (tagsPorSecao[secao] ?? []).filter((t) => !tagsAtivas.includes(t.id));
    gruposDireita.set(titulo, [...existentes, ...novos]);
  });

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-30">
      <div className="grid grid-cols-[1fr_260px] max-sm:grid-cols-1 min-h-0">
        <div className="min-w-0 overflow-y-auto max-h-[320px] py-1">
          {!digitando ? (
            <>
              {recentes.length > 0 && (
                <Grupo titulo="Visto por último">
                  {recentes.map((p) => (
                    <LinhaPessoa key={p.id} p={p} onClick={() => onEscolherPessoa(p.id)} />
                  ))}
                </Grupo>
              )}
              <Grupo titulo="Pendências abertas">
                {pendentes.length ? (
                  pendentes.map((p) => <LinhaPessoa key={p.id} p={p} onClick={() => onEscolherPessoa(p.id)} />)
                ) : (
                  <p className="px-3 py-2 text-[13px] text-gray-400">Nenhuma pendência agora.</p>
                )}
              </Grupo>
            </>
          ) : (
            <>
              {sugestoesPessoas.length > 0 && (
                <Grupo titulo="Pessoas">
                  {sugestoesPessoas.map((p) => (
                    <LinhaPessoa key={p.id} p={p} onClick={() => onEscolherPessoa(p.id)} />
                  ))}
                </Grupo>
              )}
              {sugestoesTags.length > 0 && (
                <Grupo titulo="Filtros">
                  {sugestoesTags.map((t) => {
                    const Icone = ICONE_SECAO[t.secao];
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onToggleTag(t.id)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-left"
                      >
                        <Icone size={15} className={t.cor.text} />
                        <span className="flex-1 text-[13px]">{t.label}</span>
                      </button>
                    );
                  })}
                </Grupo>
              )}
              {!sugestoesPessoas.length && !sugestoesTags.length && (
                <p className="px-3 py-4 text-[13px] text-gray-400 text-center">Nada corresponde a "{texto}".</p>
              )}
            </>
          )}
        </div>

        <div className="border-l border-gray-100 bg-gray-50/60 overflow-y-auto max-h-[320px] py-1">
          {[...gruposDireita.entries()].map(([titulo, tags]) =>
            tags.length ? (
              <Grupo key={titulo} titulo={titulo}>
                {tags.map((t) => {
                  const Icone = t.secao === "perfil" ? (ICONE_PERFIL[t.label] ?? User) : ICONE_SECAO[t.secao];
                  return (
                    <label key={t.id} className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-gray-100/70 text-[12.5px]">
                      <input
                        type="checkbox"
                        checked={tagsAtivas.includes(t.id)}
                        onChange={() => onToggleTag(t.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/40"
                      />
                      <Icone size={13} className={t.cor.text} />
                      <span className="flex-1 truncate">{t.label}</span>
                    </label>
                  );
                })}
              </Grupo>
            ) : null,
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2 px-3 py-2 flex-wrap text-[12px] text-gray-500">
          <span>Acessar tudo:</span>
          {(Object.keys(ROTULO_VERBO) as (keyof typeof ROTULO_VERBO)[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onVerbo(v)}
              className="border border-gray-200 rounded px-2.5 py-0.5 text-[12px] hover:bg-gray-50"
            >
              {ROTULO_VERBO[v]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onVerbo("pessoas")}
          className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-100 hover:bg-gray-50 text-[13px]"
        >
          <span className="flex-1 text-left">
            {digitando ? `Ver todos os resultados para "${texto}"` : "Ver todas as pessoas"}
          </span>
          <span className="text-[11px] text-gray-400 border border-gray-200 rounded px-1">↵</span>
        </button>
      </div>
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <p className="px-3 pt-2.5 pb-1 text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide">{titulo}</p>
      {children}
    </div>
  );
}

function LinhaPessoa({ p, onClick }: { p: PessoaIndexada; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-left">
      <img src={p.avatar} alt="" className="w-6 h-6 rounded-full object-cover flex-none" />
      <span className="flex-1 text-[13px] truncate">{p.nome}</span>
      <span className="text-[11.5px] text-gray-400">{p.motivoAtual ?? "—"}</span>
    </button>
  );
}
