// Classes do visual rc para formulários do admin (mesmo input do NewsletterForm).
export const rcInput =
  'w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link disabled:opacity-60';

export const rcTextarea = `${rcInput} resize-y leading-[1.55]`;

export const rcSelect = `${rcInput} cursor-pointer`;

export const rcLabel = 'mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4';

export const rcHint = 'mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5';

export const rcFormCard = 'rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8';

export const rcCheckbox = 'h-[18px] w-[18px] shrink-0 cursor-pointer accent-rc-blue';

export const rcBtnPrimary =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-rc-blue px-5 text-[14.5px] font-semibold text-white shadow-rc-primary transition-colors duration-150 hover:bg-rc-blue-hover disabled:cursor-not-allowed disabled:opacity-60';

export const rcBtnSecondary =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-rc-border-strong bg-rc-surface-3 px-4 text-[14px] font-medium text-rc-ink transition-colors duration-150 hover:border-rc-border-hover disabled:cursor-not-allowed disabled:opacity-60';

export const rcIconBtn =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-rc-border-strong bg-rc-surface-3 text-rc-ink-3 transition-colors duration-150 hover:border-rc-border-hover hover:text-rc-ink disabled:cursor-not-allowed disabled:opacity-40';
