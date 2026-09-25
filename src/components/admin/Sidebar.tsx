"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ADMIN_NAV_GROUPS, ADMIN_NAV_TOP, isNavActive, type AdminNavItem } from "./nav";

function TopLink({ item, active, onNavigate }: { item: AdminNavItem; active: boolean; onNavigate?: () => void }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
                "flex items-center gap-[11px] rounded-[9px] border px-3 py-2.5 text-[14.5px] transition-colors duration-150",
                active
                    ? "border-rc-border-hover bg-rc-blue-chip font-medium text-rc-ink"
                    : "border-transparent text-rc-nav-ink hover:bg-rc-nav-hover hover:text-rc-ink",
            )}
        >
            <Icon className={cn("h-4 w-4", active ? "text-rc-blue-link" : "text-rc-ink-6")} aria-hidden="true" />
            {item.title}
        </Link>
    );
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <aside className="flex h-full w-full flex-col gap-[22px] overflow-y-auto border-r border-rc-border bg-rc-bg-admin px-4 py-5">
            {/* Marca */}
            <div className="flex items-center gap-3 px-2 py-1">
                <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] border border-rc-border-hover bg-rc-blue-logo text-base font-semibold text-rc-logo-ink" aria-hidden="true">
                    A
                </span>
                <div>
                    <div className="text-[15.5px] font-semibold tracking-[-.015em] text-rc-ink">Admin</div>
                    <div className="mt-0.5 font-mono text-[10.5px] text-rc-ink-5">painel de controle</div>
                </div>
            </div>

            {/* Dashboard e Analytics fora das categorias */}
            <div className="flex flex-col gap-[3px]">
                {ADMIN_NAV_TOP.map((item) => (
                    <TopLink key={item.href} item={item} active={isNavActive(pathname, item.href)} onNavigate={onNavigate} />
                ))}
            </div>

            <nav aria-label="Seções do admin" className="flex flex-col gap-1.5">
                {ADMIN_NAV_GROUPS.map((group) => {
                    const groupActive = group.items.some((it) => isNavActive(pathname, it.href));
                    return (
                        <Collapsible key={group.title} defaultOpen={groupActive} className="flex flex-col gap-1.5">
                            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-[9px] border border-rc-border-card bg-rc-surface px-3 py-[9px] font-mono text-[10.5px] uppercase tracking-[.12em] text-rc-ink-4 transition-colors hover:border-rc-border-hover hover:text-rc-ink">
                                <span>{group.title}</span>
                                <ChevronDown className="h-3.5 w-3.5 text-rc-ink-6 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="flex flex-col gap-[3px] pb-1 pl-2">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isNavActive(pathname, item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={onNavigate}
                                                aria-current={active ? "page" : undefined}
                                                className={cn(
                                                    "flex items-center gap-[11px] rounded-lg px-3 py-[9px] text-sm transition-colors duration-150",
                                                    active
                                                        ? "bg-rc-blue-chip font-medium text-rc-ink"
                                                        : "text-rc-nav-ink hover:bg-rc-nav-hover hover:text-rc-ink",
                                                )}
                                            >
                                                <Icon className={cn("h-4 w-4", active ? "text-rc-blue-link" : "text-rc-ink-6")} aria-hidden="true" />
                                                {item.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-rc-border pt-3.5">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-rc-ink-6 transition-colors hover:text-rc-blue-link"
                >
                    ver o site <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
            </div>
        </aside>
    );
}
