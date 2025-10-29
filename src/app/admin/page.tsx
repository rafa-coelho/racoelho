"use client";
import Link from "next/link";
import { FileText, Code2, ShoppingCart, Image, Settings, Link as LinkIcon, Share2, ToggleLeft, Folder } from "lucide-react";

type Module = {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    borderColor: string;
};

const sections: { title: string; modules: Module[] }[] = [
    {
        title: "Conteúdo",
        modules: [
            { title: "Posts", description: "Gerenciar artigos do blog", href: "/admin/editor/posts", icon: FileText, color: "from-blue-500/20 to-blue-600/20", borderColor: "border-blue-500/30" },
            { title: "Desafios", description: "Gerenciar desafios de programação", href: "/admin/editor/challenges", icon: Code2, color: "from-green-500/20 to-green-600/20", borderColor: "border-green-500/30" },
        ]
    },
    {
        title: "Mídia",
        modules: [
            { title: "Asset Packs", description: "Gerenciar pacotes de arquivos (ebooks, banners, etc)", href: "/admin/assets", icon: Folder, color: "from-emerald-500/20 to-emerald-600/20", borderColor: "border-emerald-500/30" },
            { title: "Anúncios", description: "Gerenciar banners publicitários", href: "/admin/ads", icon: Image, color: "from-purple-500/20 to-purple-600/20", borderColor: "border-purple-500/30" },
            { title: "Páginas de Venda", description: "Gerenciar páginas de vendas", href: "/admin/sales", icon: ShoppingCart, color: "from-orange-500/20 to-orange-600/20", borderColor: "border-orange-500/30" },
        ]
    },
    {
        title: "Site",
        modules: [
            { title: "Links do Setup", description: "Gerenciar itens do setup", href: "/admin/setup", icon: Settings, color: "from-pink-500/20 to-pink-600/20", borderColor: "border-pink-500/30" },
            { title: "Links do Site", description: "Gerenciar links da página /links", href: "/admin/links", icon: LinkIcon, color: "from-cyan-500/20 to-cyan-600/20", borderColor: "border-cyan-500/30" },
            { title: "Links Sociais", description: "Gerenciar links sociais do footer", href: "/admin/social", icon: Share2, color: "from-indigo-500/20 to-indigo-600/20", borderColor: "border-indigo-500/30" },
            { title: "Feature Flags", description: "Controlar funcionalidades do site", href: "/admin/feature-flags", icon: ToggleLeft, color: "from-red-500/20 to-red-600/20", borderColor: "border-red-500/30" },
        ]
    },
];

// Flatten para um grid único, mantendo a categoria no card
const allModules: Array<Module & { category: string }> = sections.flatMap((s) =>
    s.modules.map((m) => ({ ...m, category: s.title }))
);

export default function AdminDashboard() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
                <p className="text-muted-foreground">Gerencie todo o conteúdo do site</p>
            </div>

            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {allModules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <Link
                                key={`${module.category}-${module.title}`}
                                href={module.href}
                                className="relative card-modern p-5 hover:scale-[1.01] transition-all duration-300 group border hover:border-primary/40"
                                style={{ borderColor: 'transparent' }}
                            >
                                <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground tracking-wide">
                                    {module.category}
                                </span>
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color} mb-3 inline-block`}>
                                    <Icon className="w-8 h-8 text-foreground" />
                                </div>
                                <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                                    {module.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-snug">
                                    {module.description}
                                </p>
                                <div className="mt-3 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Gerenciar <span className="ml-2">→</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

