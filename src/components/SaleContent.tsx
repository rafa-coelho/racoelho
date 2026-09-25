'use client';
import { CheckCircle } from 'lucide-react';
import type { SalesPage, SalesPageBlock } from '@/lib/api';
import { useState } from 'react';
import { buttonClasses, cardClasses } from '@/components/rc';

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
          className={buttonClasses({ className: 'h-12 px-8 text-base md:h-[52px]' })}
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
          <h1 className="mb-6 text-rc-h1-m font-semibold text-rc-ink md:text-rc-h1">{block.title}</h1>
          {block.content && <p className="text-[16.5px] leading-[1.6] text-rc-ink-3 md:text-rc-lead">{block.content}</p>}
          {block.image && (
            <div className="mt-8 overflow-hidden rounded-rc-card-lg border border-rc-border-card">
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
        <div className="prose prose-lg prose-invert max-w-none">
          {block.title && <h2 className="mb-6 text-rc-h2-article font-semibold text-rc-ink">{block.title}</h2>}
          {block.content && <div dangerouslySetInnerHTML={{ __html: block.content }} />}
        </div>
      );
      
    case 'image':
      return (
        <div className="overflow-hidden rounded-rc-card-lg border border-rc-border-card">
          <img
            src={block.image}
            alt={block.title || "Image"}
            className="w-full h-auto"
          />
          {block.title && (
            <p className="mt-2 text-center font-mono text-rc-meta text-rc-ink-5">{block.title}</p>
          )}
        </div>
      );
      
    case 'pricing':
      return (
        <div className={cardClasses({ tone: 'blue', size: 'lg', className: 'p-6 text-center md:p-8' })}>
          {block.title && <h2 className="mb-4 text-rc-h2-article font-semibold text-rc-ink">{block.title}</h2>}
          {block.content && <p className="mb-6 text-rc-body text-rc-ink-3">{block.content}</p>}
          {block.price && (
            <div className="mb-6">
              <span className="text-4xl font-semibold tracking-[-.03em] text-rc-ink">{block.price}</span>
            </div>
          )}
        </div>
      );
      
    case 'features':
      return (
        <div>
          {block.title && <h2 className="mb-8 text-center text-rc-h2-article font-semibold text-rc-ink">{block.title}</h2>}
          {block.items && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {block.items.map((item, idx) => (
                <div key={idx} className="flex space-x-4">
                  <div className="flex-shrink-0 text-rc-green">
                    <CheckCircle size={22} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-rc-ink">{item.title}</h3>
                    <p className="text-rc-body text-rc-ink-4">{item.description}</p>
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
          {block.title && <h2 className="mb-8 text-center text-rc-h2-article font-semibold text-rc-ink">{block.title}</h2>}
          {block.items && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {block.items.map((item, idx) => (
                <div key={idx} className={cardClasses({ className: 'p-6' })}>
                  <p className="mb-4 text-rc-body text-rc-ink-2">{item.description}</p>
                  <div className="font-mono text-[12px] text-rc-ink-4">{item.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
      
    case 'cta':
      return (
        <div className={cardClasses({ tone: 'blue', size: 'lg', className: 'p-6 text-center md:p-8' })}>
          {block.title && <h2 className="mb-4 text-rc-h2 font-semibold text-rc-ink">{block.title}</h2>}
          {block.content && <p className="mb-6 text-rc-body text-rc-ink-3">{block.content}</p>}
        </div>
      );
      
    case 'faq':
      return (
        <div>
          {block.title && <h2 className="mb-8 text-center text-rc-h2-article font-semibold text-rc-ink">{block.title}</h2>}
          {block.items && (
            <div className="space-y-6">
              {block.items.map((item, idx) => (
                <div key={idx} className="border-b border-rc-border pb-6">
                  <h3 className="mb-2 text-lg font-semibold text-rc-ink">{item.title}</h3>
                  <p className="text-rc-body text-rc-ink-4">{item.description}</p>
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
    <div className={cardClasses({ tone: 'blue', size: 'lg', className: 'mx-auto max-w-2xl p-6 md:p-8' })} id="form-block">
      {title && <h2 className="mb-4 text-center text-rc-h2-article font-semibold text-rc-ink">{title}</h2>}
      {content && <div className="prose prose-lg prose-invert mb-6 max-w-none" dangerouslySetInnerHTML={{ __html: content }} />}
      
      {isSuccess ? (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto mb-4 h-10 w-10 text-rc-green" strokeWidth={1.75} aria-hidden="true" />
          <h3 className="mb-2 text-rc-h2 font-semibold text-rc-ink">Inscrição Confirmada!</h3>
          <p className="text-rc-body text-rc-ink-4">{successMessage || 'Obrigado! Você receberá o ebook em breve.'}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields?.map((field, index) => (
            <div key={index} className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-rc-ink-2">
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
                className="h-12 w-full rounded-rc-control border border-rc-border-strong bg-rc-input px-3.5 text-[15px] text-rc-ink outline-none transition-colors duration-150 placeholder:text-rc-ink-5 focus:border-rc-blue-link"
              />
            </div>
          ))}
          
          {error && (
            <div role="alert" className="text-sm text-rc-amber">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonClasses({ className: 'h-12 w-full' })}
          >
            {isSubmitting ? 'Enviando...' : submitText || 'Enviar'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SaleContent; 