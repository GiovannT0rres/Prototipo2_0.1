import { useState } from "react";
import { ArrowLeft, CheckCircle2, User, MapPin, UserCheck, Calendar, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { labelPeriodoLinhas } from "../utils/dateLabel";

interface Props {
  dados: any;
  onConcluir: (novaAutorizacao?: any) => void;
  onVoltar: () => void;
}

// Última etapa da Autorização (CADASTRO → AUTORIZAÇÃO → LIBERAÇÃO — ver
// CLAUDE.md §4.1). Virou tela de revisão (design.md §14.7): mostra o resumo
// de Pessoa/Motivo/Destino/Autorizador/Período coletado nas telas anteriores
// antes de gravar, com "Observação" como campo opcional colapsado ao final.
// Sem autoFocus — o teclado só abre se o porteiro tocar no campo.
export function PerguntaObservacoes({ dados, onConcluir, onVoltar }: Props) {
  const jaCadastrado = !!dados?.id;

  const [observacoes, setObservacoes] = useState("");
  const [mostrarObservacao, setMostrarObservacao] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirmar = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      const novaAutorizacao = {
        id: `auth-${Date.now()}`,
        name: dados?.name,
        avatar: dados?.avatar,
        cpf: dados?.cpf,
        type: dados?.type,
        destino: dados?.destino,
        autorizador: dados?.autorizador,
        periodo: dados?.periodo,
        inicioISO: dados?.inicioISO,
        fimISO: dados?.fimISO,
        observacoes: observacoes || undefined,
        status: "Fora do clube",
        entrada: null,
      };

      setTimeout(() => onConcluir(novaAutorizacao), 2000);
    }, 1000);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center h-full bg-[var(--es-surface)] p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-[var(--es-success-soft)] text-[var(--es-success)] flex items-center justify-center mb-5"
        >
          <CheckCircle2 size={40} strokeWidth={1.75} />
        </motion.div>
        <h2 className="text-[21px] font-semibold text-[var(--es-ink)]">Autorização criada</h2>
        <p className="text-[17px] text-[var(--es-ink-2)] mt-1.5 max-w-xs leading-relaxed">
          {dados?.name || "Usuário"} está autorizado.
        </p>
        <p className="text-[16px] text-[var(--es-ink-3)] mt-6">
          {jaCadastrado ? "Voltando ao perfil…" : "Voltando ao início…"}
        </p>

        {/* Continuar imediatamente, sem esperar o timer — porteiro com fila
            não pode ser obrigado a esperar 2s (design.md §15.4). */}
        <button
          onClick={() => onConcluir({
            id: `auth-${Date.now()}`,
            name: dados?.name,
            avatar: dados?.avatar,
            cpf: dados?.cpf,
            type: dados?.type,
            destino: dados?.destino,
            autorizador: dados?.autorizador,
            periodo: dados?.periodo,
            observacoes: observacoes || undefined,
            status: "Fora do clube",
            entrada: null,
          })}
          className="mt-6 min-h-[50px] px-6 rounded-[14px] font-semibold text-[17px] text-[var(--es-navy)] bg-[var(--es-navy-soft)] hover:brightness-95 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          Continuar <ChevronRight size={20} strokeWidth={2.25} />
        </button>
      </motion.div>
    );
  }

  const resumo = [
    { icone: User, label: "Pessoa", valor: dados?.name },
    { icone: Calendar, label: "Motivo", valor: dados?.type },
    { icone: MapPin, label: "Destino", valor: dados?.destino },
    { icone: UserCheck, label: "Autorizador", valor: dados?.autorizador },
  ].filter((item) => item.valor);

  // Período ganha linha própria no resumo — "sex, 22/08/26 até sáb, 5 de
  // setembro" numa linha só estourava o card (truncava com reticências).
  // Com data real (inicioISO/fimISO) mostra início e fim empilhados; sem
  // isso (autorização antiga só com string), cai no valor único de sempre.
  const periodoLinhas =
    dados?.inicioISO && dados?.fimISO
      ? labelPeriodoLinhas(new Date(dados.inicioISO), new Date(dados.fimISO))
      : null;

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full min-h-0 bg-[var(--es-surface)]">
      <div className="flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] flex items-center gap-3 bg-[var(--es-surface)]">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-[50px] h-[50px] flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors shrink-0"
        >
          <ArrowLeft size={22} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-[var(--es-ink)] text-[16px]">Autorização</p>
      </div>

      <div className="flex-1 min-h-0 p-6 bg-[var(--es-bg)] overflow-y-auto">
        <p className="text-[25px] font-semibold text-[var(--es-ink)] mb-6 leading-tight tracking-[-0.01em]">
          Confirme a <strong className="font-bold">AUTORIZAÇÃO</strong>
        </p>

        <div className="bg-[var(--es-surface)] rounded-[14px] border-2 border-[var(--es-border)] divide-y divide-[var(--es-border)]">
          {resumo.map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-5 py-4">
              <item.icone size={22} strokeWidth={2.25} className="text-[var(--es-ink-3)] shrink-0" />
              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-[var(--es-ink-3)]">{item.label}</p>
                <p className="text-[17px] font-medium text-[var(--es-ink)] truncate">{item.valor}</p>
              </div>
            </div>
          ))}

          {periodoLinhas ? (
            <div className="flex items-start gap-3 px-5 py-4">
              <Calendar size={22} strokeWidth={2.25} className="text-[var(--es-ink-3)] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-[var(--es-ink-3)]">Período</p>
                <p className="text-[17px] font-medium text-[var(--es-ink)]">{periodoLinhas.inicio}</p>
                {periodoLinhas.fim && (
                  <p className="text-[17px] font-medium text-[var(--es-ink)] mt-0.5">até {periodoLinhas.fim}</p>
                )}
              </div>
            </div>
          ) : (
            dados?.periodo && (
              <div className="flex items-center gap-3 px-5 py-4">
                <Calendar size={22} strokeWidth={2.25} className="text-[var(--es-ink-3)] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold text-[var(--es-ink-3)]">Período</p>
                  <p className="text-[17px] font-medium text-[var(--es-ink)] truncate">{dados.periodo}</p>
                </div>
              </div>
            )
          )}
        </div>

        {!mostrarObservacao ? (
          <button
            type="button"
            onClick={() => setMostrarObservacao(true)}
            className="mt-5 min-h-[50px] w-full text-left px-5 rounded-[14px] border-2 border-dashed border-[var(--es-border-strong)] text-[17px] font-semibold text-[var(--es-ink-2)] hover:border-[var(--es-navy)] transition-colors"
          >
            + Observação (opcional)
          </button>
        ) : (
          <div className="mt-5">
            <p className="text-[16px] font-semibold text-[var(--es-ink-2)] mb-2">Observação (opcional)</p>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: chega de carro, vai direto pro salão principal..."
              rows={3}
              enterKeyHint="done"
              className="w-full bg-[var(--es-surface)] border-2 border-[var(--es-border-strong)] px-4 py-4 rounded-[14px] text-[17px] font-medium focus:outline-none focus:ring-4 focus:ring-[rgba(15,39,68,0.12)] focus:border-[var(--es-navy)] text-[var(--es-ink)] resize-none"
            />
          </div>
        )}
      </div>

      <div className="flex-shrink-0 p-6 pt-8 border-t border-[var(--es-border)] bg-[var(--es-surface)]">
        <button
          onClick={handleConfirmar}
          disabled={isSubmitting}
          className="w-full px-6 py-4 rounded-[14px] font-semibold text-[19px] text-white transition-all active:scale-[0.98] disabled:opacity-60 bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] flex justify-center items-center gap-2.5 min-h-[58px]"
        >
          {isSubmitting ? "Processando…" : <><CheckCircle2 size={25} strokeWidth={2.25} /> Confirmar autorização</>}
        </button>
      </div>
    </motion.div>
  );
}
