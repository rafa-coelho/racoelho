---
title: "Criando Primeiro App com NextJs e Typescript: Guia Passo a Passo"
excerpt: "Lorem ipsum."
coverImage: "/assets/blog/criando-primeiro-app-nextjs-com-typescript/banner.png"
date: "2024-03-26T14:34:49.353Z"
keywords: programação, dev, desenvolvimento, 
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg?updatedAt=1701730648991"
ogImage:
  url: "/assets/blog/criando-primeiro-app-nextjs-com-typescript/banner.png"
---

O Next.js emergiu como um dos frameworks mais populares para o desenvolvimento de aplicações web com React.

Oferecendo soluções prontas para problemas comuns como roteamento de páginas, otimização de desempenho e SEO, o Next.js simplifica a criação de aplicações web robustas e performáticas. 

Este artigo é um guia passo a passo para iniciar seu primeiro projeto Next.js utilizando TypeScript, abordando as principais vantagens e razões para escolher o Next.js para seus projetos.


## O que é o Next.js?

Next.js é um framework construído em cima do React e fornece infraestrutura e simples convenções para construir aplicações web e estáticas. Com foco em performance e experiência do desenvolvedor, o Next.js automatiza otimizações de código e fornece funcionalidades como Server-Side Rendering (SSR) e Static Site Generation (SSG).

## Vantagens do Uso do Next.js


**Renderização do Lado do Servidor (SSR):**
O NextJS renderiza o site do lado do servidor, melhorando a performance do carregamento inicial além de melhorar as técnicas de SEO, já que, diferente do React puro, ele permite a visualização do HTML em sua versão final sem a necessidade do uso do JavaScript do lado do cliente.

**Geração de Sites Estáticos (SSG):**
Com isso, você pode exportar sua aplicação para arquivos estáticos pré-renderizados que podem ser hospedados em servidores mais simples sem a necessidade do Node para executá-lo.

**Roteamento Baseado em Arquivos:** 
Com ele, você pode cria rotas automaticamente baseadas na estrutura de diretórios do projeto sem a necessidade de determinar um Router.
Ex:
Para a rota `https://localhost:3000/pedidos/C45F0077-A953-44EC-BF58-4751D883735B/editar` você pode simplesmente criar um arquivo no seguinte caminho: `src/pages/pedidos/:id/editar.tsx`


**Otimizações Automáticas:**
Inclui funcionalidades como: 
- **Divisão de código** que consiste em fragmentar o seu bundle JavaScript em múltiplos arquivos menores que são carregados apenas quando necessários. Por exemplo, quando um usuário acessa uma página específica, somente o código para essa página é carregado. Isso significa que o tempo de carregamento inicial é drasticamente reduzido, pois o navegador não precisa baixar um arquivo JavaScript monolítico com o código de todas as páginas do site. O Next.js faz isso automaticamente para cada página na pasta pages/, sem que o desenvolvedor precise configurar manualmente a divisão de código.
- **Carregamento de imagens otimizado** que oferece carregamento "lazy" (preguiçoso) por padrão, o que significa que as imagens só são carregadas quando entram no viewport (a parte visível da página). Além disso, o Next.js otimiza as imagens automaticamente, ajustando seu tamanho para o dispositivo do usuário, oferecendo suporte a formatos de imagem modernos e eficientes. Isso não só melhora o desempenho como reduz o consumo de dados, o que é especialmente valioso para usuários em conexões lentas ou com limites de dados.


## Requisitos de desenvolvimento

Você vai precisar do:
- Node ([clique aqui para instalar](https://nodejs.org/))
- Typescript 


## Criação de um Novo Projeto Next.js com TypeScript

Para criar um novo projeto Next.js com TypeScript, é necessário utilizar o comando **create-next-app**. Este comando irá criar um novo projeto Next.js com as configurações padrão.

```bash
npx create-next-app --typescript my-app
```

Este comando irá criar uma nova pasta chamada **my-app** com as configurações padrão do Next.js e TypeScript. É importante notar que o TypeScript já está configurado por padrão no Next.js, então não é necessário instalar nenhum pacote adicional.

Em resumo, configurar o ambiente de desenvolvimento para um novo projeto Next.js com TypeScript é fácil e simples. Basta instalar o Node.js e NPM e criar um novo projeto com o comando **create-next-app**.



## Estrutura Básica de um Projeto Next.js

- `pages/`: Contém componentes React que correspondem a rotas da aplicação.
- `public/`: Armazena arquivos estáticos, como imagens.
- `styles/`: Diretório para arquivos CSS.

- `pages/`: Contém suas páginas e a API routes. O Next.js usa o sistema de arquivos para roteamento.
- `public/`: Para arquivos estáticos como imagens.
- `styles/`: Para arquivos CSS.
- `next.config.js`: Configuração opcional do Next.js.
- `tsconfig.json`: Configurações do TypeScript.



## Tipagem de Componentes e Páginas

Com as configurações do TypeScript em dia, é possível adicionar tipagem aos componentes e páginas do Next.js. Para isso, basta adicionar interfaces aos props dos componentes e páginas. O seguinte exemplo de componente com tipagem pode ser utilizado como referência:

```typescript
import React from 'react';

interface Props {
  title: string;
  description: string;
}

const MyComponent: React.FC<Props> = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default MyComponent;
```

Com essas configurações e práticas em dia, é possível utilizar o Next.js com TypeScript de forma segura e produtiva.


