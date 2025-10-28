"use client";
import { useState } from "react";
import { signInWithPassword, signInWithOAuth } from "@/lib/auth";
import { Mail, Lock, Loader } from "lucide-react";

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
            <div className="card-modern p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/60 to-primary/20 mx-auto mb-4 flex items-center justify-center">
                        <Lock className="text-primary" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Área Administrativa</h1>
                    <p className="text-muted-foreground">Entre para gerenciar posts e conteúdo</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-primary/40"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-primary/40"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" size={18} />
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground mb-3">Ou entre com</p>
                    <button
                        onClick={() => signInWithOAuth('google')}
                        className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continuar com Google
                    </button>
                </div>
            </div>
        </div>
    );
}
