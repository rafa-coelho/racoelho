"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Code2, ShoppingCart, Image, Settings, Link as LinkIcon, Share2, ToggleLeft, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Posts", href: "/admin/editor/posts", icon: FileText },
    { title: "Desafios", href: "/admin/editor/challenges", icon: Code2 },
    { title: "Anúncios", href: "/admin/ads", icon: Image },
    { title: "Páginas de Venda", href: "/admin/sales", icon: ShoppingCart },
    { title: "Setup", href: "/admin/setup", icon: Settings },
    { title: "Links do Site", href: "/admin/links", icon: LinkIcon },
    { title: "Links Sociais", href: "/admin/social", icon: Share2 },
    { title: "Feature Flags", href: "/admin/feature-flags", icon: ToggleLeft },
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

            <nav className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname === item.href || pathname?.startsWith(item.href + '/');
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
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
            </nav>
        </aside>
    );
}

