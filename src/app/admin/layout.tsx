"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkAuth, signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import MobileNav from "@/components/admin/MobileNav";
import { currentSectionTitle } from "@/components/admin/nav";
import { LogoMark, Skeleton } from "@/components/rc";
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
            <div className="flex min-h-screen items-center justify-center bg-rc-bg px-4" role="status">
                <div className="flex w-full max-w-xs flex-col items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-[11px]" />
                    <p className="font-mono text-[11.5px] text-rc-ink-5">verificando acesso…</p>
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
        <div className="min-h-screen bg-rc-bg text-rc-ink md:grid md:grid-cols-[248px_minmax(0,1fr)]">
            {/* Sidebar — só no desktop */}
            <div className="sticky top-0 hidden h-screen md:block">
                <Sidebar />
            </div>

            <div className="flex min-w-0 flex-col">
                {/* Header desktop */}
                <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-rc-border bg-rc-bg px-8 md:flex">
                    <span className="font-mono text-[11.5px] uppercase tracking-[.12em] text-rc-ink-4">Área administrativa</span>
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-[9px] rounded-[9px] border border-rc-border-strong bg-rc-surface-3 px-4 py-[9px] text-sm font-medium text-rc-ink transition-colors hover:border-rc-border-hover"
                    >
                        <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
                    </button>
                </header>

                {/* Header mobile (56px) */}
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-rc-border bg-rc-bg-admin pl-4 pr-1 md:hidden">
                    <div className="flex min-w-0 items-center gap-[9px]">
                        <LogoMark size="sm" />
                        <span className="truncate text-[14.5px] font-semibold">{currentSectionTitle(pathname)}</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleSignOut}
                        aria-label="Sair"
                        className="grid h-11 w-11 place-items-center rounded-lg text-rc-ink-3 transition-colors hover:bg-rc-nav-hover hover:text-rc-ink"
                    >
                        <LogOut className="h-[19px] w-[19px]" aria-hidden="true" />
                    </button>
                </header>

                {/* Conteúdo — no mobile reserva espaço para a barra de abas */}
                <main className="flex-1 pb-[calc(88px+env(safe-area-inset-bottom))] md:pb-0">
                    {children}
                </main>
            </div>

            <MobileNav onSignOut={handleSignOut} />
            <Toaster />
        </div>
    );
}
