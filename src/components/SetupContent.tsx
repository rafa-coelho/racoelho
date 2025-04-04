'use client';

import { useState } from 'react';
import { SetupItem } from '@/lib/api';
import { ExternalLink } from 'lucide-react';
import Layout from './Layout';
import { cn } from '@/lib/utils';

interface SetupContentProps {
  items: SetupItem[];
  categories: string[];
}

export default function SetupContent({ items, categories }: SetupContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  console.log(filteredItems);

  return (
    <Layout>
      <div className="content-container py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Meu Setup</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Equipamentos e ferramentas que utilizo no meu dia a dia como desenvolvedor.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            className={cn(
              "px-4 py-2 rounded-md transition-colors",
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </button>

          {categories.map((category) => (
            <button
              key={category}
              className={cn(
                "px-4 py-2 rounded-md transition-colors",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Setup Items */}
        {
          filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <SetupItemCard key={item.name} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-2">Nenhum item encontrado</p>
              <p className="text-muted-foreground">
                Tente selecionar outra categoria.
              </p>
            </div>
          )
        }
      </div>
    </Layout>
  );
} 


const SetupItemCard = ({ item }: { item: SetupItem }) => {
  return (
    <div className="glass-panel rounded-lg overflow-hidden flex flex-col h-full">
      <div className="relative pb-[60%] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x240?text=Item';
          }}
        />
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-1">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">
            {item.category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1">{item.description}</p>
        
        <div className="flex justify-between items-center">
          
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Ver detalhes <ExternalLink size={16} className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};