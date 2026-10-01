// Barra de navegador de mentira no topo do card de produto: três pontos e o domínio.
export function BrowserBar({ host }: { host: string }) {
  return (
    <div aria-hidden="true" className="flex h-7 items-center gap-1.5 border-b border-rc-border-card bg-rc-surface-2 px-3">
      <span className="h-1.5 w-1.5 rounded-full bg-rc-border-strong" />
      <span className="h-1.5 w-1.5 rounded-full bg-rc-border-strong" />
      <span className="h-1.5 w-1.5 rounded-full bg-rc-border-strong" />
      <span className="ml-2 truncate font-mono text-[10.5px] text-rc-ink-5">{host}</span>
    </div>
  );
}
