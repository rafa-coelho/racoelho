"use client";
import Link from "next/link";
import { useState } from "react";
import { FileText, Code2, ShoppingCart, Image, Settings, Link as LinkIcon, Share2, ToggleLeft, Folder, RefreshCw, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ViewsStatsCard from "@/components/admin/ViewsStatsCard";

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
        title: "Analytics",
        modules: [
            { title: "Visualizações", description: "Analytics detalhado de posts e desafios", href: "/admin/analytics", icon: Eye, color: "from-violet-500/20 to-violet-600/20", borderColor: "border-violet-500/30" },
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

// Coleções que podem ter cache invalidado
const cacheableCollections = [
    { name: 'posts', label: 'Posts', icon: FileText },
    { name: 'challenges', label: 'Desafios', icon: Code2 },
    { name: 'sales_pages', label: 'Páginas de Venda', icon: ShoppingCart },
    { name: 'setup', label: 'Setup', icon: Settings },
    { name: 'links', label: 'Links', icon: LinkIcon },
    { name: 'social_links', label: 'Links Sociais', icon: Share2 },
    { name: 'assets', label: 'Assets', icon: Folder },
    { name: 'ads', label: 'Anúncios', icon: Image },
];

export default function AdminDashboard() {
    const { toast } = useToast();
    const [invalidating, setInvalidating] = useState<string | null>(null);

    const handleInvalidateCache = async (collection: string) => {
        setInvalidating(collection);
        try {
            const response = await fetch('/api/cache/invalidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ collection }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao invalidar cache');
            }

            toast({
                title: "Sucesso",
                description: data.message || `Cache de ${collection} limpo com sucesso`,
            });
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao invalidar cache",
                variant: "destructive",
            });
        } finally {
            setInvalidating(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
                <p className="text-muted-foreground">Gerencie todo o conteúdo do site</p>
            </div>

            {/* Seção de Analytics */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Analytics & Visualizações</h2>
                </div>
                <ViewsStatsCard />
            </div>

            {/* Seção de Cache */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <RefreshCw className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Gerenciamento de Cache</h2>
                </div>
                <div className="card-modern p-6">
                    <p className="text-sm text-muted-foreground mb-4">
                        Limpe o cache de coleções específicas para forçar atualização dos dados
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {cacheableCollections.map((item) => {
                            const Icon = item.icon;
                            const isInvalidating = invalidating === item.name;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleInvalidateCache(item.name)}
                                    disabled={isInvalidating}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                    {isInvalidating && (
                                        <RefreshCw className="w-3 h-3 animate-spin ml-auto" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Módulos do Dashboard */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Módulos</h2>
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

