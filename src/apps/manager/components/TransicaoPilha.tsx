import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigationType } from "react-router";

type Fase = "idle" | "push-out" | "push-in" | "pop-out" | "pop-in";

// React Router já É a pilha (histórico do navegador) — em vez de reimplementar
// a bookkeeping manual que o mockup fazia, isto chaveia a animação a partir
// de useNavigationType(): "PUSH" empurra da direita, "POP" volta pra direita,
// "REPLACE" (paginação entre irmãos no Perfil) também empurra — spec §5.1:
// mesmo indo pro resultado anterior, a transição é sempre de avanço.
export function TransicaoPilha({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navType = useNavigationType();
  const [exibido, setExibido] = useState(children);
  const [fase, setFase] = useState<Fase>("idle");
  const chaveAnterior = useRef(location.key);

  useEffect(() => {
    if (chaveAnterior.current === location.key) return;
    chaveAnterior.current = location.key;

    if (navType === "REPLACE") {
      setFase("push-out");
      const t = setTimeout(() => {
        setExibido(children);
        setFase("push-in");
      }, 130);
      return () => clearTimeout(t);
    }

    const saindo = navType === "POP" ? "pop-out" : "push-out";
    const entrando = navType === "POP" ? "pop-in" : "push-in";
    setFase(saindo);
    const t = setTimeout(() => {
      setExibido(children);
      setFase(entrando);
    }, 130);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    if (fase === "push-in" || fase === "pop-in") {
      const t = setTimeout(() => setFase("idle"), 260);
      return () => clearTimeout(t);
    }
  }, [fase]);

  const classePorFase: Record<Fase, string> = {
    idle: "flex-1 flex flex-col min-h-0",
    "push-out": "flex-1 flex flex-col min-h-0 animate-[pushOut_130ms_ease-out_both]",
    "pop-out": "flex-1 flex flex-col min-h-0 animate-[popOut_130ms_ease-out_both]",
    "push-in": "flex-1 flex flex-col min-h-0 animate-[pushIn_260ms_cubic-bezier(.32,.72,0,1)_both]",
    "pop-in": "flex-1 flex flex-col min-h-0 animate-[popIn_260ms_cubic-bezier(.32,.72,0,1)_both]",
  };

  return (
    <div className="relative flex-1 overflow-hidden flex flex-col min-h-0">
      <div className={classePorFase[fase]}>{exibido}</div>
    </div>
  );
}
