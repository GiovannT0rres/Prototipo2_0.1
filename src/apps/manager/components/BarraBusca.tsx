import type { RefObject } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/components/ui/utils";
import type { Tag } from "../filters";

interface BarraBuscaProps {
  texto: string;
  onTexto: (v: string) => void;
  tagsAtivas: Tag[];
  onRemoverTag: (id: string) => void;
  onAbrir: () => void;
  hero: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

export function BarraBusca({ texto, onTexto, tagsAtivas, onRemoverTag, onAbrir, hero, inputRef }: BarraBuscaProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 flex-wrap rounded-2xl border border-gray-200 bg-white shadow-sm mx-auto w-full transition-shadow focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500",
        hero ? "max-w-xl min-h-[54px] px-4 py-2 shadow-md" : "max-w-2xl min-h-[44px] px-3 py-1.5",
      )}
      onClick={() => {
        inputRef.current?.focus();
        onAbrir();
      }}
    >
      <Search size={hero ? 18 : 16} className="text-gray-400 flex-none" />
      {tagsAtivas.map((tag) => (
        <span
          key={tag.id}
          className={cn("inline-flex items-center gap-1 h-6 pl-2.5 pr-1 rounded-full text-[12.5px] font-medium", tag.cor.bg, tag.cor.text)}
        >
          {tag.label}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoverTag(tag.id);
            }}
            className="rounded-full w-4 h-4 grid place-items-center opacity-60 hover:opacity-100"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={texto}
        onChange={(e) => onTexto(e.target.value)}
        onFocus={onAbrir}
        placeholder="Buscar pessoa, tag ou autorizador"
        className={cn("flex-1 min-w-[130px] outline-none bg-transparent", hero ? "text-[16px]" : "text-[14px]")}
      />
      {!tagsAtivas.length && !texto && (
        <span className="text-[11px] text-gray-400 border border-gray-200 rounded px-1.5 flex-none">⌘K</span>
      )}
      {texto && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTexto("");
          }}
          className="text-gray-400 hover:text-gray-700 p-1 rounded"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
