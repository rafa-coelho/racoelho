"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkAuth, signOut } from "@/lib/auth";
import { Loader, LogOut, Menu, X } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Fecha o drawer ao trocar de rota (no mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        const verify = async () => {
            const publicPaths = ['/admin/login', '/admin/auth/callback'];
            if (publicPaths.includes(pathname)) {
                setIsAuthenticated(true);
                return;
            }

            const auth = await checkAuth();
            setIsAuthenticated(auth);

            if (!auth && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        };

        verify();
    }, [pathname, router]);

    const handleSignOut = async () => {
        await signOut();
    };

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-4 text-primary" size={48} />
                    <p className="text-muted-foreground">Verificando autenticação...</p>
                </div>
            </div>
        );
    }

    // Public page (login)
    if (pathname === '/admin/login' || pathname === '/admin/auth/callback') {
        return children;
    }

    // Protected page - not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Protected page - authenticated
    return (
        <div className="min-h-screen flex">
            {/* Sidebar — fixa no desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0 border-r border-white/5">
                <Sidebar />
            </div>

            {/* Drawer no mobile */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-[60]">
                    {/* overlay */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setSidebarOpen(false)}
                    />
                    {/* painel */}
                    <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] border-r border-white/10 bg-background shadow-2xl animate-slide-in-left">
                        <div className="flex items-center justify-end px-4 pt-4">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                aria-label="Fechar menu"
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <Sidebar onNavigate={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Admin Header */}
                <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {/* Hambúrguer só no mobile */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Abrir menu"
                                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <Menu size={22} />
                            </button>
                            <div className="text-sm text-muted-foreground">
                                Área Administrativa
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="px-3 sm:px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                        >
                            <LogOut size={18} /> <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
}
