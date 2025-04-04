import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center">
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Desenvolvimento, Tecnologia e Desafios
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Compartilhando conhecimento e experiências sobre o mundo do
          desenvolvimento de software, novas tecnologias e desafios de programação.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/posts"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ver Blog
          </Link>
          <Link
            href="/listas/desafios"
            className="inline-flex h-11 items-center justify-center rounded-md bg-secondary px-8 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Explorar Desafios
          </Link>
        </div>
      </div>
    </div>
  );
} 