// Constantes de className compartilhadas pelas telas do app de Portaria —
// implementação das specs de componente do DESIGN.md §7 (botões, campos,
// cartões de opção, chips, header). Mantém o padrão de Tailwind utility
// classes já usado no app; não é uma lib de componentes, só evita repetir a
// mesma string de estilo em 16 arquivos.

// §7.1 Botões — 64px primário/sucesso/destrutivo, 56px secundário/terciário.
export const btnPrimary =
  "w-full min-h-[64px] py-4 rounded-[14px] font-semibold text-[21px] text-white bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] active:scale-[0.98] transition-all disabled:opacity-45 disabled:cursor-not-allowed flex justify-center items-center gap-2.5";

export const btnSuccess =
  "w-full min-h-[64px] py-4 rounded-[14px] font-semibold text-[21px] text-white bg-[var(--es-success)] hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-45 disabled:cursor-not-allowed flex justify-center items-center gap-2.5";

export const btnDestructive =
  "w-full min-h-[64px] py-4 rounded-[14px] font-semibold text-[21px] text-white bg-[var(--es-danger)] hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-45 disabled:cursor-not-allowed flex justify-center items-center gap-2.5";

export const btnSecondary =
  "w-full min-h-[56px] py-3.5 rounded-[14px] font-semibold text-[19px] text-[var(--es-ink)] bg-[var(--es-surface)] border-2 border-[var(--es-border-strong)] hover:bg-[var(--es-bg)] active:scale-[0.98] transition-all disabled:opacity-45 disabled:cursor-not-allowed flex justify-center items-center gap-2.5";

export const btnTertiary =
  "min-h-[56px] py-3 px-4 rounded-[14px] font-semibold text-[19px] text-[var(--es-ink-2)] bg-transparent hover:bg-[var(--es-bg)] active:scale-[0.98] transition-all disabled:opacity-45 disabled:cursor-not-allowed flex justify-center items-center gap-2";

export const btnIcon =
  "w-14 h-14 min-w-[56px] min-h-[56px] flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] bg-[var(--es-surface)] hover:bg-[var(--es-bg)] active:scale-[0.98] transition-all shrink-0";

// §7.2 Campos de entrada — 64px, borda 2px, foco navy + halo.
export const input =
  "w-full min-h-[64px] bg-[var(--es-surface)] border-2 border-[var(--es-border-strong)] rounded-[14px] px-5 py-4 text-[21px] font-semibold text-[var(--es-ink)] tabular-nums focus:outline-none focus:ring-4 focus:ring-[rgba(15,39,68,0.12)] focus:border-[var(--es-navy)] transition-colors placeholder:font-medium placeholder:text-[var(--es-ink-3)]";

export const label =
  "text-[17px] font-semibold text-[var(--es-ink-2)] tracking-wide mb-2 block";

// §7.3 Cartões de opção — 72–80px, borda 2px, ativo = navy + navy-soft.
export const optionCard =
  "w-full text-left px-5 py-5 min-h-[80px] rounded-[14px] border-2 border-[var(--es-border)] bg-[var(--es-surface)] hover:border-[var(--es-border-strong)] active:scale-[0.99] transition-all flex items-center gap-4";

export const optionCardIcon =
  "w-12 h-12 rounded-full flex items-center justify-center shrink-0";

// §7.5 Chips — 44px altura, pill, preenche mas não confirma.
export const chip =
  "inline-flex items-center gap-2 px-[18px] min-h-[44px] rounded-full text-[17px] font-semibold border-[1.5px] transition-colors active:scale-[0.98]";
export const chipDefault =
  "bg-[var(--es-surface)] text-[var(--es-ink-2)] border-[var(--es-border-strong)] hover:border-[var(--es-ink-3)]";
export const chipSelected = "bg-[var(--es-navy)] text-white border-[var(--es-navy)]";

// §7.6 Header — 64px, voltar à esquerda, rótulo de fase ao centro.
export const header =
  "flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] flex items-center gap-3 bg-[var(--es-surface)]";
export const headerLabel = "font-semibold text-[var(--es-ink)] text-[17px]";

// Tela — pergunta 28px/600, fundo padrão da área de conteúdo.
export const question = "text-[28px] font-semibold text-[var(--es-ink)] leading-[1.25] tracking-[-0.01em]";
export const helper = "text-[17px] text-[var(--es-ink-3)]";

// Rodapé de ação primária — fixo, respiro de 32px acima, safe-area embaixo.
export const footer =
  "flex-shrink-0 p-6 pt-8 border-t border-[var(--es-border)] bg-[var(--es-surface)]";
export const footerStyle = { paddingBottom: "max(24px, env(safe-area-inset-bottom))" };
