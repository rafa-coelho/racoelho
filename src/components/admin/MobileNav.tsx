"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ADMIN_NAV_GROUPS, ADMIN_TABS, isNavActive } from "./nav";

// Tudo que não está nas 4 abas fixas, na mesma ordem da sidebar
const TAB_HREFS = new Set(ADMIN_TABS.map((t) => t.href));
const MORE_GROUPS = ADMIN_NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((it) => !TAB_HREFS.has(it.href)),
})).filter((g) => g.items.length > 0);

const tabClasses = "flex h-14 flex-col items-center justify-center gap-1 font-mono text-[9.5px] lowercase transition-colors";

// Barra de abas inferior do admin (abaixo de md) + folha "Mais"
export default function MobileNav({ onSignOut }: { onSignOut: () => void }) {
    const pathname = usePathname();
    const [moreOpen, setMoreOpen] = useState(false);

    useEffect(() => {
        setMoreOpen(false);
    }, [pathname]);

    const moreActive = MORE_GROUPS.some((g) => g.items.some((it) => isNavActive(pathname, it.href)));

    return (
        <>
            <nav
                aria-label="Navegação do admin"
                className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-rc-border bg-rc-bg-admin px-1 pt-1.5 md:hidden"
                style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}
            >
                {ADMIN_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = isNavActive(pathname, tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(tabClasses, active ? "text-rc-blue-link" : "text-rc-ink-5")}
                        >
                            <Icon className="h-[19px] w-[19px]" aria-hidden="true" />
                            {tab.title}
                        </Link>
                    );
                })}
                <button
                    type="button"
                    onClick={() => setMoreOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={moreOpen}
                    className={cn(tabClasses, moreActive || moreOpen ? "text-rc-blue-link" : "text-rc-ink-5")}
                >
                    <MoreHorizontal className="h-[19px] w-[19px]" aria-hidden="true" />
                    mais
                </button>
            </nav>

            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                <SheetContent
                    side="bottom"
                    className="max-h-[85vh] overflow-y-auto rounded-t-rc-card-lg border-rc-border bg-rc-bg-admin px-4 pb-8 pt-5 text-rc-ink"
                    style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
                >
                    <SheetTitle className="text-[15.5px] font-semibold text-rc-ink">Mais seções</SheetTitle>
                    <div className="mt-4 flex flex-col gap-5">
                        {MORE_GROUPS.map((group) => (
                            <div key={group.title}>
                                <div className="mb-1.5 px-1 font-mono text-[10.5px] uppercase tracking-[.12em] text-rc-ink-5">{group.title}</div>
                                <div className="flex flex-col gap-0.5">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isNavActive(pathname, item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                aria-current={active ? "page" : undefined}
                                                className={cn(
                                                    "flex min-h-[48px] items-center gap-3 rounded-[10px] px-3 text-[15px] transition-colors",
                                                    active ? "bg-rc-blue-chip text-rc-ink" : "text-rc-ink-2 hover:bg-rc-nav-hover",
                                                )}
                                            >
                                                <Icon className={cn("h-[18px] w-[18px]", active ? "text-rc-blue-link" : "text-rc-ink-6")} aria-hidden="true" />
                                                {item.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={onSignOut}
                            className="flex min-h-[48px] items-center gap-3 rounded-[10px] border border-rc-border-strong bg-rc-surface-3 px-3 text-[15px] text-rc-ink"
                        >
                            <LogOut className="h-[18px] w-[18px] text-rc-ink-4" aria-hidden="true" />
                            Sair
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
