---
title: "NextJS e o Server Side Rendering: Impulsionando o Desempenho Web"
excerpt: "Explore como o Server Side Rendering com Next.js pode transformar a performance e o SEO do seu site, destacando-se com exemplos reais de empresas como Hulu e Twitch que melhoraram significativamente suas interfaces de usuário e eficiência de desenvolvimento."
coverImage: "/assets/blog/next-e-server-side-rendering/banner.png"
date: "2024-04-24T00:41:28.383Z"
keywords: programação, dev, desenvolvimento, Next.js SSR, Performance web, SEO com Next.js, SSR vantagens, Desenvolvimento eficiente, Experiência do usuário com SSR, Hulu SSR, Twitch desenvolvimento
author:
  name: "racoelho"
  picture: "https://github.com/rafa-coelho.png"
ogImage:
  url: "/assets/blog/next-e-server-side-rendering/banner.png"
---


NextJS é um framework de código aberto baseado em Node.js, projetado para aplicações React, que potencializa a renderização no lado do servidor, ou SSR (Server Side Rendering). Esse método melhora o desempenho e a SEO das páginas, pois o servidor faz a maior parte do trabalho de renderização antes de enviar o conteúdo ao navegador do cliente.

O SSR é especialmente útil para páginas que exigem carregamento rápido e conteúdo dinâmico, já que a página chega ao navegador do usuário completamente renderizada. Isso elimina a necessidade de processamento adicional pelo navegador, proporcionando uma experiência de usuário mais fluida e rápida.

Além disso, NextJS simplifica a implementação do SSR com sua API integrada e estrutura de roteamento eficiente, permitindo aos desenvolvedores criar aplicações robustas que são otimizadas tanto para performance quanto para SEO, adaptando-se perfeitamente às necessidades específicas dos usuários.

### Conceitos Básicos

**NextJS** se baseia em React para a construção de interfaces de usuário. Ele introduz o conceito de *páginas*, que são associadas a uma rota dentro da aplicação. Cada página em NextJS é um arquivo React que exporta por padrão um componente React. A plataforma também oferece um sistema de roteamento baseado em arquivos, onde a estrutura de diretórios do projeto reflete as rotas da aplicação.

- **Renderização no Lado do Servidor (SSR)**: As páginas são renderizadas no servidor, gerando HTML que é então enviado ao navegador.
- **Geração de Sites Estáticos (SSG)**: Páginas são pré-renderizadas em tempo de build, criando arquivos HTML estáticos.

### Vantagens e Desvantagens

**Vantagens:**

1. **Otimização de desempenho**: SSR e SSG contribuem para uma carga inicial mais rápida das páginas.
2. **SEO aprimorado**: O conteúdo já está disponível assim que o robô de busca acessa a página, o que facilita a indexação.

**Desvantagens:**

1. **Custo de servidor**: A renderização servidor exige mais recursos do servidor.
2. **Complexidade**: Pode aumentar a complexidade da aplicação em comparação a CSR.

### Comparação com Client Side Rendering

**CSR (Client Side Rendering)** é quando o JavaScript roda no navegador para construir a página. Enquanto o **SSR (Server Side Rendering)** do NextJS processa a página no servidor antes de enviá-la ao navegador.

- Renderização:
  - SSR (NextJS): No servidor.
  - CSR: No cliente (navegador).
- Tempo de Carregamento:
  - SSR (NextJS): Menor tempo para o conteúdo aparecer.
  - CSR: Dependente do download do JS.
- SEO:
  - SSR (NextJS): Melhorado devido ao SSR.
  - CSR: Pode ser desafiador.
- Custo:
  - SSR (NextJS): Maior uso de recursos do servidor.
  - CSR: Menores custos no servidor.

## Server Side Rendering no NextJS

No NextJS, o Server Side Rendering (SSR) é uma técnica fundamental para otimizar a performance e a indexação de aplicações pela busca. A abordagem do SSR no NextJS permite que páginas sejam renderizadas no servidor, servindo conteúdo dinâmico e estático com eficiência.

### Processo de SSR

O processo de Server Side Rendering no NextJS começa no servidor, onde o código da aplicação é executado para gerar o HTML correspondente à página requisitada. Este HTML é então enviado ao cliente, junto com os dados necessários para que a página possa ser interativa. A renderização no servidor proporciona um carregamento rápido da página, pois o conteúdo já está formatado antes de chegar ao navegador do usuário.

### getServerSideProps

**getServerSideProps** é uma função disponível no NextJS para ser utilizada durante o processo de SSR. Ela permite carregar dados de forma assíncrona que serão usados na renderização da página no lado do servidor. O código abaixo exemplifica o uso de `getServerSideProps`:

```jsx
export async function getServerSideProps(context) {
  // Lógica para buscar dados
  const data = await fetchData(context.params.id);

  // Retornar os dados como props para a página
  return {
    props: {
      data
    }
  };
}

```

Na função `getServerSideProps`, dados são buscados e repassados como props para a página que será renderizada. Isso significa que a página terá acesso aos dados necessários antes mesmo de ser enviada ao cliente, otimizando a experiência do usuário e sendo favorável para SEO.

## Roteamento e Páginas no NextJS

No NextJS, as páginas são associadas a rotas de uma forma intuitiva e configurar roteamento dinâmico é uma tarefa simples.

### Criação de Páginas

Para criar uma página no NextJS, basta adicionar um arquivo `.js`, `.jsx`, `.ts` ou `.tsx` no diretório `pages`. O nome do arquivo definirá a rota da página. Por exemplo, um arquivo `sobre.js` resulta em uma rota `/sobre`. Estruturas de diretórios também são replicadas em rotas; um arquivo `pages/produtos/camisas.js` corresponderá à rota `/produtos/camisas`.

### Roteamento Dinâmico

Rotas dinâmicas permitem a criação de padrões flexíveis para páginas. No NextJS, utiliza-se colchetes para definir parâmetros dinâmicos. Um arquivo chamado `[id].js` em uma pasta `pages/produtos` permite acessar rotas como `/produtos/1`, onde `1` pode ser um identificador de produto. O parâmetro pode ser obtido no componente da página por meio de `getServerSideProps` ou hooks como `useRouter`.

## Otimização e Performance

No contexto de NextJS e Server Side Rendering (SSR), otimização e performance são fundamentais para a velocidade de carregamento da página e a melhoria na experiência do usuário.

### Técnicas de Otimização

NextJS oferece várias técnicas para otimizar a performance de aplicações SSR. **Renderização estática** e **geração de páginas estáticas no build time** (Static Generation) permitem servir páginas rapidamente através de cache CDN. A **minificação de arquivos CSS e JavaScript** reduz seus tamanhos, acelerando o tempo de carregamento. O SSR propriamente dito possibilita a renderização do lado do servidor, o que significa que o conteúdo da página é gerado antes de chegar ao navegador do usuário, diminuindo o tempo até a primeira pintura (First Paint) e a interatividade (Time to Interactive).

### Lazy Loading e Code Splitting

O **lazy loading** é uma estratégia eficaz para melhorar a performance de uma aplicação NextJS. Ela consiste em carregar componentes ou módulos apenas quando são necessários, o que reduz o tempo de carregamento inicial das páginas. NextJS suporta lazy loading de imagens e componentes de forma nativa.

O **code splitting** permite dividir o código em vários bundles e apenas carregar o necessário para renderizar a página atual. O NextJS implanta automaticamente o code splitting com importações dinâmicas, facilitando a vida dos desenvolvedores e melhorando a performance da aplicação.

## SEO e NextJS

NextJS é uma framework de React popular que oferece soluções robustas para otimização de motores de busca (SEO). O suporte a **Server Side Rendering (SSR)** é fundamental, pois permite que os motores de busca indexem o conteúdo das páginas mais eficientemente.

Com NextJS, os desenvolvedores podem gerar páginas HTML no lado do servidor. Isso significa que quando um robô de busca acessa uma página, ele obtém todo o conteúdo já renderizado, o que é crucial para que o conteúdo seja indexado corretamente. Além disso, NextJS suporta a geração estática de páginas através do **Static Site Generation (SSG)**, o que pode ser benéfico para o SEO, já que as páginas carregam mais rapidamente.

- SSR garante que o conteúdo esteja disponível para os rastreadores de busca assim que eles acessam a página.
- O SSG permite que as páginas sejam servidas rapidamente, o que melhora a experiência do usuário e pode contribuir para um melhor ranking de SEO.

O NextJS também oferece facilidades para a manipulação de metadados de páginas por meio do componente `Head`, permitindo a personalização de tags de SEO, como **title**, **description**, e outras meta tags relevantes para melhorar a visibilidade nos motores de busca.

Listas de benefícios no SEO com NextJS:

- **HTML pré-renderizado**: Maior facilidade de indexação pelo conteúdo ser gerado no servidor.
- **Carregamento rápido**: Melhoria na velocidade de carregamento através do SSG.
- **Roteamento dinâmico**: Possibilidade de criar URLs otimizadas para SEO.
- **Personalização de metadados**: Controle sobre as meta tags para otimização.

NextJS apresenta-se como um aliado poderoso no que diz respeito à otimização de SEO para aplicações React, fornecendo ferramentas e opções para aprimorar a presença online de um site.

## Casos de Uso e Estudos

NextJS é uma framework React popular utilizada para construir aplicações web com renderização no lado do servidor (*Server Side Rendering* - SSR). Seus principais casos de uso incluem:

1. **SEO Melhorado**: Websites com conteúdo dinâmico se beneficiam do SSR para melhor indexação pelos motores de busca.
2. **Carregamento Rápido**: Ao servir páginas pré-renderizadas, os usuários percebem uma redução no tempo de carregamento.
3. **Websites Estáticos e Dinâmicos**: Permite a combinação de geração de sites estáticos (SSG) com SSR para flexibilidade.

**Estudos de caso** destacam o sucesso do NextJS em diferentes cenários:

- *Hulu*: Melhorou o desempenho e a experiência do usuário adotando SSR para suas páginas.
- **Twitch**: Aumentou a eficiência do desenvolvimento ao utilizar NextJS para SSR, otimizando o tempo de desenvolvimento.


Esses casos exemplificam como a renderização no lado do servidor pode aprimorar tanto o desempenho quanto a experiência de desenvolvimento em aplicações complexas.


### Conclusão 
Next.js com SSR é uma ferramenta poderosa que oferece vantagens significativas em termos de desempenho e experiência do usuário. Empresas como Hulu e Twitch já demonstraram o potencial de melhorias com SSR, aproveitando a eficiência em desenvolvimento e aprimorando a interatividade do usuário. Adotar SSR pode ser um diferencial estratégico para projetos que buscam excelência em performance e otimização para motores de busca.


Se você ainda não criou nenhuma aplicação com NextJS, olhe esse post aqui: [Criando Primeiro App com NextJs e Typescript: Guia Passo a Passo](https://racoelho.com.br/posts/criando-primeiro-app-nextjs-com-typescript)
