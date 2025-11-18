"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Code2, ShoppingCart, Image, Settings, Link as LinkIcon, Share2, ToggleLeft, LayoutDashboard, Folder, ChevronDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

type NavSection = {
    title: string;
    items: NavItem[];
};

const navSections: NavSection[] = [
    {
        title: "Conteúdo",
        items: [
            { title: "Posts", href: "/admin/editor/posts", icon: FileText },
            { title: "Desafios", href: "/admin/editor/challenges", icon: Code2 }
        ]
    },
    {
        title: "Mídia",
        items: [
            { title: "Asset Packs", href: "/admin/assets", icon: Folder },
            { title: "Anúncios", href: "/admin/ads", icon: Image },
            { title: "Páginas de Venda", href: "/admin/sales", icon: ShoppingCart }
        ]
    },
    {
        title: "Site",
        items: [
            { title: "Links do Setup", href: "/admin/setup", icon: Settings },
            { title: "Links do Site", href: "/admin/links", icon: LinkIcon },
            { title: "Links Sociais", href: "/admin/social", icon: Share2 },
            { title: "Feature Flags", href: "/admin/feature-flags", icon: ToggleLeft }
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r border-white/5 px-4 py-6 overflow-y-auto">
            <div className="mb-8">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/60 to-primary/20 flex items-center justify-center mb-3">
                    <span className="text-primary font-bold text-xl">A</span>
                </div>
                <h2 className="text-lg font-semibold">Admin</h2>
                <p className="text-xs text-muted-foreground">Painel de Controle</p>
            </div>

            {/* Dashboard e Analytics fora das categorias */}
            <div className="mb-3 space-y-1">
                <Link
                    href="/admin"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group",
                        pathname === '/admin'
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                >
                    <LayoutDashboard className={cn(
                        "w-5 h-5",
                        pathname === '/admin' ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <span className="text-sm">Dashboard</span>
                </Link>
                <Link
                    href="/admin/analytics"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group",
                        pathname === '/admin/analytics'
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                >
                    <BarChart3 className={cn(
                        "w-5 h-5",
                        pathname === '/admin/analytics' ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <span className="text-sm">Analytics</span>
                </Link>
            </div>

            <nav className="space-y-2">
                {navSections.map((section) => {
                    const isSectionActive = section.items.some((it) => it.href === '/admin'
                        ? pathname === '/admin'
                        : pathname === it.href || pathname?.startsWith(it.href + '/'));
                    return (
                        <Collapsible key={section.title} defaultOpen={isSectionActive} className="rounded-md border border-white/5 bg-white/[0.02]">
                            <CollapsibleTrigger className="group w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground flex items-center justify-between">
                                <span>{section.title}</span>
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground group-hover:text-foreground" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="space-y-1 mb-2 pt-1 pb-2 border-t border-white/5">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = item.href === '/admin'
                                            ? pathname === '/admin'
                                            : pathname === item.href || pathname?.startsWith(item.href + '/');
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 ml-1 mr-1 rounded-md transition-colors group",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "w-5 h-5",
                                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                )} />
                                                <span className="text-sm">{item.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </nav>
        </aside>
    );
}

