"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, AlertCircle } from "lucide-react";

export default function AuthCallbackPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get token from URL params
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token');
                
                if (!token) {
                    setStatus('error');
                    return;
                }

                // Store token
                localStorage.setItem('pb_auth', token);
                
                setStatus('success');
                
                // Redirect to admin panel
                setTimeout(() => {
                    router.push('/admin/editor/posts');
                }, 1000);
            } catch (error) {
                console.error('Auth callback error:', error);
                setStatus('error');
            }
        };

        handleCallback();
    }, [router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-4 text-primary" size={48} />
                    <p className="text-muted-foreground">Autenticando...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card-modern p-8 max-w-md w-full text-center">
                    <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                    <h1 className="text-2xl font-bold mb-2">Erro na autenticação</h1>
                    <p className="text-muted-foreground mb-6">
                        Não foi possível completar a autenticação. Tente novamente.
                    </p>
                    <button
                        onClick={() => router.push('/admin/login')}
                        className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                    >
                        Voltar para o login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="text-green-500 mb-4">✓</div>
                <p className="text-muted-foreground">Autenticação realizada com sucesso!</p>
            </div>
        </div>
    );
}

