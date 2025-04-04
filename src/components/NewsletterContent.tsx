'use client';

import { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import Layout from './Layout';
import { toast } from '@/hooks/use-toast';

export default function NewsletterContent() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar sua solicitação');
      }

      setIsSubmitted(true);
      setEmail('');
      setName('');

      toast({
        title: "Assinatura realizada!",
        description: "Você foi adicionado à newsletter com sucesso.",
      });
    } catch (error) {
      console.error('Error submitting newsletter form:', error);
      toast({
        title: "Erro ao processar",
        description: "Ocorreu um erro ao processar sua assinatura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="content-container py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Newsletter</h1>
            <p className="text-xl text-muted-foreground">
              Receba conteúdos exclusivos sobre desenvolvimento, tecnologia e programação
              diretamente no seu email.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-8 md:p-12">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Assinatura confirmada!</h2>
                <p className="text-muted-foreground mb-6">
                  Obrigado por se inscrever na nossa newsletter. Você receberá os próximos conteúdos
                  diretamente no seu email.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
                >
                  Inscrever outro email
                </button>
              </div>
            ) : (
              <>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nome
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center h-12 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Enviando...' : 'Assinar Newsletter'}
                    </button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground pt-4">
                    Ao assinar, você concorda em receber emails com conteúdos e atualizações.
                    Você pode cancelar sua inscrição a qualquer momento.
                  </p>
                </form>
              </>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Conteúdo exclusivo</h3>
              <p className="text-sm text-muted-foreground">
                Receba conteúdos que não são publicados no blog ou redes sociais.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Prioridade em novidades</h3>
              <p className="text-sm text-muted-foreground">
                Seja o primeiro a saber sobre novos cursos, eventos e projetos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Sem spam</h3>
              <p className="text-sm text-muted-foreground">
                Apenas conteúdo relevante, sem flood de emails desnecessários.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 