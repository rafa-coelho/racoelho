"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkAuth, signOut } from "@/lib/auth";
import { Loader, LogOut } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const pathname = usePathname();
    const router = useRouter();

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
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0 border-r border-white/5">
                <Sidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Admin Header */}
                <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Área Administrativa
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                        >
                            <LogOut size={18} /> Sair
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
