"use client";
import { useState } from "react";
import { signInWithPassword, signInWithOAuth } from "@/lib/auth";
import { AlertCircle, Loader, Lock, Mail } from "lucide-react";

// Login com email + senha. "Entrar com GitHub" fica de fora (DECIDIR, FEATURES §8).
export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signInWithPassword(email, password);
            window.location.href = "/admin/editor/posts";
        } catch (err: any) {
            setError("Email ou senha inválidos");
        } finally {
            setLoading(false);
        }
    };

    const fieldCls =
        "flex items-center gap-2.5 rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 transition-colors focus-within:border-rc-blue-link";
    const inputCls =
        "h-12 min-w-0 flex-1 bg-transparent text-[15px] text-rc-ink placeholder:text-rc-ink-6 focus:outline-none";

    return (
        <div className="relative grid min-h-screen place-items-center overflow-hidden bg-rc-bg px-5 py-10 text-rc-ink">
            {/* Grade de pontos */}
            <div aria-hidden="true" className="rc-dots-bg" />

            <div className="relative w-full max-w-[420px] rounded-[16px] border border-rc-border-card bg-rc-surface px-[18px] py-[22px] md:rounded-[18px] md:p-9">
                <div className="text-center">
                    <span className="mx-auto grid h-[52px] w-[52px] place-items-center rounded-[14px] border border-rc-border-strong bg-rc-tag text-rc-blue-link md:h-[60px] md:w-[60px] md:rounded-2xl">
                        <Lock className="h-[22px] w-[22px]" aria-hidden="true" />
                    </span>
                    <h1 className="mt-5 text-[21px] font-semibold tracking-[-.026em] md:text-[25px]">Área Administrativa</h1>
                    <p className="mt-2 text-sm text-rc-ink-4 md:text-[15px]">Entre para gerenciar posts e conteúdo.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-7">
                    {error && (
                        <div role="alert" className="mb-4 flex items-center gap-2.5 rounded-[10px] border border-rc-amber-border-soft bg-rc-amber-surface-2 px-3.5 py-3 text-sm text-rc-ink-2">
                            <AlertCircle className="h-4 w-4 shrink-0 text-rc-amber" aria-hidden="true" />
                            {error}
                        </div>
                    )}

                    <label htmlFor="login-email" className="block text-[13.5px] font-medium text-rc-ink-4">
                        Email
                    </label>
                    <div className={`mt-2 ${fieldCls}`}>
                        <Mail className="h-[17px] w-[17px] shrink-0 text-rc-ink-6" aria-hidden="true" />
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputCls}
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <label htmlFor="login-password" className="mt-[18px] block text-[13.5px] font-medium text-rc-ink-4">
                        Senha
                    </label>
                    <div className={`mt-2 ${fieldCls}`}>
                        <Lock className="h-[17px] w-[17px] shrink-0 text-rc-ink-6" aria-hidden="true" />
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputCls}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-[10px] bg-rc-blue text-[15.5px] font-semibold text-white shadow-rc-primary transition-colors duration-150 hover:bg-rc-blue-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader className="h-[18px] w-[18px] animate-spin motion-reduce:animate-none" aria-hidden="true" />
                                Entrando…
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </button>
                </form>

                {/* Login com Google já existia antes do rebranding; o GitHub do design fica de fora (DECIDIR) */}
                <div className="my-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.1em] text-rc-ink-6">
                    <span className="h-px flex-1 bg-rc-border" aria-hidden="true" />
                    ou
                    <span className="h-px flex-1 bg-rc-border" aria-hidden="true" />
                </div>
                <button
                    type="button"
                    onClick={() => signInWithOAuth('google')}
                    className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[10px] border border-rc-border-strong bg-rc-surface-3 text-[15px] font-medium text-rc-ink transition-colors duration-150 hover:border-rc-border-hover"
                >
                    {/* logo do Google nas cores da marca */}
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continuar com Google
                </button>
            </div>
        </div>
    );
}
