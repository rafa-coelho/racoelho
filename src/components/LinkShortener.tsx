'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Copy, Link as LinkIcon, Loader2 } from 'lucide-react';
import { analyticsService } from '@/lib/services/analytics.service';
import { generateShortUrl, SOCIAL_NETWORKS } from '@/lib/services/shortener.service';

const formSchema = z.object({
  url: z.string().url({ message: 'Por favor, insira uma URL válida' }),
  type: z.string().min(1, { message: 'Por favor, selecione um tipo de link' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LinkShortener() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      type: '',
    },
  });

  const detectSocialNetwork = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      for (const [key, network] of Object.entries(SOCIAL_NETWORKS)) {
        if (network.patterns.some((pattern: string) => hostname.includes(pattern))) {
          return key;
        }
      }
    } catch (error) {
      console.error('Erro ao detectar rede social:', error);
    }
    return '';
  };

  useEffect(() => {
    if (url) {
      const detectedType = detectSocialNetwork(url);
      if (detectedType) {
        setType(detectedType);
        setValue('type', detectedType);
      }
    }
  }, [url, setValue]);

  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    const detectedType = detectSocialNetwork(value);
    if (detectedType) {
      setType(detectedType);
      setValue('type', detectedType);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    
    if (pastedText) {
      const detectedType = detectSocialNetwork(pastedText);
      if (detectedType) {
        setType(detectedType);
        setValue('type', detectedType);
      }
    }
  };

  const handleSubmitForm = async (data: FormValues) => {
    setIsLoadingForm(true);
    try {
      // Gerar o ID curto diretamente usando o serviço
      const shortId = await generateShortUrl(data.url);
      
      const shortUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/r/${shortId}`;
      
      setShortUrl(shortUrl);
      toast.success('Link encurtado com sucesso!');
      analyticsService.event('link_created', 'links', data.type);
    } catch (error) {
      toast.error('Erro ao encurtar o link. Tente novamente.');
      console.error(error);
    } finally {
      setIsLoadingForm(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar o link');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encurtar Link</CardTitle>
        <CardDescription>
          Cole o link da sua rede social abaixo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              {...register('url')}
              className={errors.url ? 'border-red-500' : ''}
              onBlur={(e) => {
                handleUrlBlur(e);
                register('url').onBlur(e);
              }}
              onPaste={handlePaste}
            />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoadingForm}>
            {isLoadingForm ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Encurtando...
              </>
            ) : (
              <>
                <LinkIcon className="mr-2 h-4 w-4" />
                Encurtar Link
              </>
            )}
          </Button>
        </form>
      </CardContent>

      {shortUrl && (
        <CardFooter className="flex flex-col space-y-4">
          <div className="w-full p-3 bg-muted rounded-md flex items-center justify-between">
            <span className="truncate">{shortUrl}</span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 