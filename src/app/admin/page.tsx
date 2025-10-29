"use client";
import Link from "next/link";
import { FileText, Code2, ShoppingCart, Image, Settings, Link as LinkIcon, Share2, ToggleLeft, Folder } from "lucide-react";

const adminModules = [
    {
        title: "Posts",
        description: "Gerenciar artigos do blog",
        href: "/admin/editor/posts",
        icon: FileText,
        color: "from-blue-500/20 to-blue-600/20",
        borderColor: "border-blue-500/30"
    },
    {
        title: "Desafios",
        description: "Gerenciar desafios de programação",
        href: "/admin/editor/challenges",
        icon: Code2,
        color: "from-green-500/20 to-green-600/20",
        borderColor: "border-green-500/30"
    },
    {
        title: "Anúncios",
        description: "Gerenciar banners publicitários",
        href: "/admin/ads",
        icon: Image,
        color: "from-purple-500/20 to-purple-600/20",
        borderColor: "border-purple-500/30"
    },
    {
        title: "Páginas de Venda",
        description: "Gerenciar páginas de vendas",
        href: "/admin/sales",
        icon: ShoppingCart,
        color: "from-orange-500/20 to-orange-600/20",
        borderColor: "border-orange-500/30"
    },
    {
        title: "Setup",
        description: "Gerenciar itens do setup",
        href: "/admin/setup",
        icon: Settings,
        color: "from-pink-500/20 to-pink-600/20",
        borderColor: "border-pink-500/30"
    },
    {
        title: "Links do Site",
        description: "Gerenciar links da página /links",
        href: "/admin/links",
        icon: LinkIcon,
        color: "from-cyan-500/20 to-cyan-600/20",
        borderColor: "border-cyan-500/30"
    },
    {
        title: "Links Sociais",
        description: "Gerenciar links sociais do footer",
        href: "/admin/social",
        icon: Share2,
        color: "from-indigo-500/20 to-indigo-600/20",
        borderColor: "border-indigo-500/30"
    },
    {
        title: "Asset Packs",
        description: "Gerenciar pacotes de arquivos (ebooks, banners, etc)",
        href: "/admin/assets",
        icon: Folder,
        color: "from-emerald-500/20 to-emerald-600/20",
        borderColor: "border-emerald-500/30"
    },
    {
        title: "Feature Flags",
        description: "Controlar funcionalidades do site",
        href: "/admin/feature-flags",
        icon: ToggleLeft,
        color: "from-red-500/20 to-red-600/20",
        borderColor: "border-red-500/30"
    }
];

export default function AdminDashboard() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
                <p className="text-muted-foreground">Gerencie todo o conteúdo do site</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminModules.map((module) => {
                    const Icon = module.icon;
                    return (
                        <Link
                            key={module.title}
                            href={module.href}
                            className="card-modern p-6 hover:scale-[1.02] transition-all duration-300 group border-2 hover:border-primary/40"
                            style={{ borderColor: 'transparent' }}
                        >
                            <div className={`p-4 rounded-xl bg-gradient-to-br ${module.color} mb-4 inline-block`}>
                                <Icon className="w-8 h-8 text-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                {module.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {module.description}
                            </p>
                            <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Gerenciar <span className="ml-2">→</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

