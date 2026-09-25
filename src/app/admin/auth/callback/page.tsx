"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, AlertCircle, Check } from "lucide-react";

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
            <div className="grid min-h-screen place-items-center bg-rc-bg px-5 text-rc-ink" role="status">
                <div className="flex flex-col items-center gap-3">
                    <Loader className="h-6 w-6 animate-spin text-rc-blue-link motion-reduce:animate-none" aria-hidden="true" />
                    <p className="font-mono text-[11.5px] text-rc-ink-5">autenticando…</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="grid min-h-screen place-items-center bg-rc-bg px-5 text-rc-ink">
                <div className="w-full max-w-[420px] rounded-[18px] border border-rc-amber-border-soft bg-rc-amber-surface-2 p-8 text-center">
                    <AlertCircle className="mx-auto mb-4 h-8 w-8 text-rc-amber" aria-hidden="true" />
                    <h1 className="text-[21px] font-semibold tracking-[-.026em]">Erro na autenticação</h1>
                    <p className="mb-6 mt-2 text-sm text-rc-ink-4">
                        Não foi possível completar a autenticação. Tente novamente.
                    </p>
                    <button
                        onClick={() => router.push('/admin/login')}
                        className="h-12 rounded-[10px] bg-rc-blue px-6 font-semibold text-white transition-colors hover:bg-rc-blue-hover"
                    >
                        Voltar para o login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid min-h-screen place-items-center bg-rc-bg px-5 text-rc-ink" role="status">
            <div className="flex flex-col items-center gap-3">
                <Check className="h-6 w-6 text-rc-green" aria-hidden="true" />
                <p className="text-sm text-rc-ink-4">Autenticação realizada com sucesso!</p>
            </div>
        </div>
    );
}
