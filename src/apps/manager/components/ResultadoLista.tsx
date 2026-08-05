import { ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/shared/components/ui/utils";
import type { PessoaIndexada, Tag } from "../filters";

interface ResultadoListaProps {
  pessoas: PessoaIndexada[];
  tagsBase: Tag[];
  onAbrirPessoa: (id: string) => void;
  onToggleTag: (id: string) => void;
  onAssumirPendencia: (pessoa: PessoaIndexada) => void;
}

export function ResultadoLista({ pessoas, tagsBase, onAbrirPessoa, onToggleTag, onAssumirPendencia }: ResultadoListaProps) {
  if (!pessoas.length) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-[14px] font-medium text-gray-700 mb-1">Nenhuma pessoa encontrada</p>
        <p className="text-[13px] max-w-xs mx-auto">Remova um filtro da barra ou limpe a busca para ampliar o resultado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 px-2 pb-4">
      {pessoas.map((p) => {
        const tagsDaPessoa = tagsBase.filter((t) => t.aplica(p));
        const pendente = p.statusCadastro === "aguardando-autorizacao";
        return (
          <div
            key={p.id}
            role="button"
            tabIndex={0}
            onClick={() => onAbrirPessoa(p.id)}
            onKeyDown={(e) => e.key === "Enter" && onAbrirPessoa(p.id)}
            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-none mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-gray-900">{p.nome}</p>
              <p className="text-[12px] text-gray-500 mt-0.5">{p.cpf}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {tagsDaPessoa.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTag(t.id);
                    }}
                    className={cn("inline-flex items-center gap-1 text-[11.5px] font-medium rounded px-2 py-0.5", t.cor.bg, t.cor.text)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-none">
              {p.dentroDoClube && (
                <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5">
                  <MapPin size={11} /> No clube
                </span>
              )}
              {pendente && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssumirPendencia(p);
                  }}
                  className="text-[12px] font-medium border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50"
                >
                  Definir autorização
                </button>
              )}
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
