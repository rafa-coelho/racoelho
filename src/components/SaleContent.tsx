'use client';
import { CheckCircle } from 'lucide-react';
import type { SalesPage, SalesPageBlock } from '@/lib/api';
import { useState } from 'react';

interface SaleContentProps {
  salesPage: SalesPage;
}

const SaleContent = ({ salesPage }: SaleContentProps) => {
  return (
    <>
      {/* Render each block based on its type */}
      {salesPage.blocks.map((block, index) => (
        <div key={index} id={`${block.type}-${index}`} className="mb-16">
          {renderSalesPageBlock(block, index)}
        </div>
      ))}

      {/* Call to Action */}
      <div className="sticky bottom-8 mt-12 text-center">
        <a
          href={salesPage.paymentUrl || salesPage.ctaUrl}
          target={salesPage.paymentUrl.startsWith("#") ? '' : '_target'}
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 text-lg font-medium transition-transform hover:scale-105"
        >
          {salesPage.ctaText}
        </a>
      </div>
    </>
  );
};

// Helper function to render different types of blocks
const renderSalesPageBlock = (block: SalesPageBlock, index: number) => {
  switch (block.type) {
    case 'header':
      return (
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{block.title}</h1>
          {block.content && <p className="text-xl text-muted-foreground">{block.content}</p>}
          {block.image && (
            <div className="mt-8 rounded-lg overflow-hidden">
              <img
                src={block.image}
                alt={block.title}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      );
      
    case 'text':
      return (
        <div className="prose prose-lg max-w-none">
          {block.title && <h2 className="text-3xl font-bold mb-6">{block.title}</h2>}
          {block.content && <div dangerouslySetInnerHTML={{ __html: block.content }} />}
        </div>
      );
      
    case 'image':
      return (
        <div className="rounded-lg overflow-hidden">
          <img
            src={block.image}
            alt={block.title || "Image"}
            className="w-full h-auto"
          />
          {block.title && (
            <p className="text-sm text-muted-foreground text-center mt-2">{block.title}</p>
          )}
        </div>
      );
      
    case 'pricing':
      return (
        <div className="glass-panel rounded-xl p-8 text-center">
          {block.title && <h2 className="text-3xl font-bold mb-4">{block.title}</h2>}
          {block.content && <p className="text-muted-foreground mb-6">{block.content}</p>}
          {block.price && (
            <div className="mb-6">
              <span className="text-4xl font-bold">{block.price}</span>
            </div>
          )}
        </div>
      );
      
    case 'features':
      return (
        <div>
          {block.title && <h2 className="text-3xl font-bold mb-8 text-center">{block.title}</h2>}
          {block.items && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {block.items.map((item, idx) => (
                <div key={idx} className="flex space-x-4">
                  <div className="flex-shrink-0 text-primary">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
      
    case 'testimonials':
      return (
        <div>
          {block.title && <h2 className="text-3xl font-bold mb-8 text-center">{block.title}</h2>}
          {block.items && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {block.items.map((item, idx) => (
                <div key={idx} className="glass-panel rounded-lg p-6">
                  <p className="italic mb-4">{item.description}</p>
                  <div className="font-semibold">{item.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
      
    case 'cta':
      return (
        <div className="glass-panel rounded-xl p-8 text-center">
          {block.title && <h2 className="text-2xl font-bold mb-4">{block.title}</h2>}
          {block.content && <p className="text-muted-foreground mb-6">{block.content}</p>}
        </div>
      );
      
    case 'faq':
      return (
        <div>
          {block.title && <h2 className="text-3xl font-bold mb-8 text-center">{block.title}</h2>}
          {block.items && (
            <div className="space-y-6">
              {block.items.map((item, idx) => (
                <div key={idx} className="border-b border-border pb-6">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
      
    case 'form':
      return <FormBlock {...block} />;
      
    default:
      return null;
  }
};

// Componente para o bloco de formulário
const FormBlock = ({ title, content, apiUrl, fields, submitText, successMessage }: SalesPageBlock) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(apiUrl || '/api/send-ebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: window.location.pathname.split('/').pop() || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar o formulário. Tente novamente.');
      }

      setIsSuccess(true);
      setFormData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-8 max-w-2xl mx-auto" id="form-block">
      {title && <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>}
      {content && <div className="prose prose-lg max-w-none mb-6" dangerouslySetInnerHTML={{ __html: content }} />}
      
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h3 className="text-2xl font-bold mb-2">Inscrição Confirmada!</h3>
          <p className="text-muted-foreground">{successMessage || 'Obrigado! Você receberá o ebook em breve.'}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields?.map((field, index) => (
            <div key={index} className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium">
                {field.label}
              </label>
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required !== false}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : submitText || 'Enviar'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SaleContent; 