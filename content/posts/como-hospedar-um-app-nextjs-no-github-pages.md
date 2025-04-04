---
title: "Como hospedar um app NextJS no Github Pages"
excerpt: "Descubra como hospedar facilmente seu app NextJS no GitHub Pages, uma solução gratuita e eficaz para compartilhar seus projetos web. Este guia detalhado passa por todas as etapas necessárias, desde a configuração do projeto NextJS até o deploy no GitHub Pages, garantindo que seu site esteja acessível e otimizado para o mundo. Ideal para desenvolvedores que buscam uma forma simples e direta de publicar suas criações."
coverImage: "/assets/blog/como-hospedar-um-app-nextjs-no-github-pages/banner.png"
date: "2024-04-10T21:30:32.456Z"
keywords: programação, dev, desenvolvimento, Hospedar app NextJS, GitHub Pages deploy, Configuração NextJS GitHub Pages, Publicação gratuita GitHub, Deploy NextJS projeto, GitHub Pages tutorial, NextJS estático GitHub, Desenvolvimento web NextJS, SEO GitHub Pages, NextJS GitHub Pages guia
tags: ["Next.js", "GitHub Pages", "Deploy", "Hospedagem", "Desenvolvimento Web", "Hospedagem Gratuita", "SEO"]
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg?updatedAt=1701730648991"
ogImage:
  url: "/assets/blog/como-hospedar-um-app-nextjs-no-github-pages/banner.png"
---

Se você acabou de fazer um projeto NextJS e está querendo uma forma de publicar de graça, talvez o Github Pages seja uma boa opção!

> Caso não tenha criado ainda, veja como criar uma aplicação com NextJS [nesse artigo aqui](https://racoelho.com.br/posts/criando-primeiro-app-nextjs-com-typescript).


Hospedar um aplicativo NextJS no GitHub Pages pode parecer complicado à primeira vista, já que o GitHub Pages é tradicionalmente mais usado para conteúdo estático e o NextJS é uma framework React com renderização do lado do servidor (SSR) e geração de sites estáticos (SSG). 

Mas, com algumas configurações, é possível utilizar o GitHub Pages para servir seu aplicativo NextJS. 

Neste post, vamos explorar o passo a passo para fazer isso acontecer.


### Pré-requisitos

Antes de começarmos, certifique-se de que você tenha:

- Uma conta no GitHub.
- Git instalado na sua máquina.
- Node.js e npm (ou yarn) instalados.
- Um projeto NextJS pronto para ser publicado.


## Passo 1: Preparando seu projeto NextJS

Primeiro, você precisa configurar seu projeto NextJS para gerar uma versão estática do seu site, que pode ser hospedada no GitHub Pages.

- Abra o arquivo next.config.js no seu projeto.
- Adicione a seguinte configuração para definir o diretório base:

```typescript
module.exports = {
  assetPrefix: './',
  basePath: '/nome-do-seu-repositorio',
  trailingSlash: true,
}
```

Só lembre de trocar o `/nome-do-seu-repositorio` pelo nome do seu repositório no GitHub. Essa configuração é necessária para garantir que os caminhos dos ativos estejam corretos quando o site estiver hospedado no GitHub Pages.


### Importante!!!!!!!

Como o GitHub Pages só hospeda sites estáticos, você vai precisar exportá-lo como site estático.

E caso haja alguma rota dinâmica (como `/usuarios/:id/visualizar`) ela pode não funcionar e vai precisar ser atualizada pra usar a estrutura de queries (ex: `/usuarios/visualizar?id=123`).


Configure o seu `next.config.js` para exportar estáticamente.

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // <=== habilita o export estático
  reactStrictMode: true,
};

module.exports = nextConfig;
```

Com isso, quando rodar o `next build`, o NextJS vai gerar uma pasta "out" contendo a aplicação exportada com arquivos estáticos.

## Passo 2: Exportando seu projeto

Com o seu projeto configurado, é hora de gerar os arquivos estáticos.

Execute o seguinte comando no terminal:

```bash
npm run build
```

ou se estiver usando yarn:

```bash
yarn build
```

Esse comando gera uma pasta out no diretório do seu projeto, contendo os arquivos estáticos do seu site.

## Passo 3: O Repositório no GitHub

Se ainda não tiver um, crie um repositório no GitHub para hospedar seu projeto.

Para criar um novo repositório no GitHub, siga estas etapas:

1. Faça login na sua conta do GitHub e clique em '+', no canto superior direito da tela, e selecione 'Novo repositório'.
2. Dê um nome ao seu repositório, adicione uma descrição (opcional), escolha se deseja torná-lo público ou privado e clique em 'Criar Repositório'.

Agora que você tem um repositório, é hora de conectar seu projeto local ao repositório do GitHub. Abra o terminal na raiz do seu projeto e siga estas etapas:

1. Inicialize um repositório Git local com o comando: `git init`.
2. Adicione todos os arquivos ao repositório local com o comando: `git add .`.
3. Faça commit das alterações com o comando: `git commit -m "Initial commit"`.
4. Conecte seu repositório local ao repositório do GitHub com o comando: `git remote add origin https://github.com/username/repo-name.git`. Substitua 'username' pelo seu nome de usuário do GitHub e 'repo-name' pelo nome do seu repositório.
5. Por fim, faça push das alterações para o repositório do GitHub com o comando: `git push -u origin master`.

Pronto! Seu projeto local agora está conectado ao seu repositório no GitHub.

## Passo 4: Configure a Github Actions

Com o repositório criado, configure para usar o GitHub Pages:

![Configurando GitHub Pages Parte 1](/assets/blog/como-hospedar-um-app-nextjs-no-github-pages/config-github-pages-1.png)


E selecione a opção "GitHub Actions":

![Configurando GitHub Pages Parte 2](/assets/blog/como-hospedar-um-app-nextjs-no-github-pages/config-github-pages-2.png)


Em seguida, clique em "configurar" na sugestão "NextJS":

![Configurando GitHub Pages Parte 3](/assets/blog/como-hospedar-um-app-nextjs-no-github-pages/config-github-pages-3.png)


Em seguida, commite as alterações:

![Configurando GitHub Pages Parte 4](/assets/blog/como-hospedar-um-app-nextjs-no-github-pages/config-github-pages-4.png)

![Configurando GitHub Pages Parte 5](/assets/blog/como-hospedar-um-app-nextjs-no-github-pages/config-github-pages-5.png)

## E pronto!

Assim que a Action estiver criada, ela já vai executar.
Você pode ver na aba "Actions":

![Configurando GitHub Pages Parte 6](/assets/blog/como-hospedar-um-app-nextjs-no-github-pages/config-github-pages-6.png)


Para acessar a sua aplicação, só precisa acessar o link nesse formato:

``` bash
https://<SEU_USUARIO_GITHUB>.github.io/<NOME_DO_SEU_REPOSITORIO>
```


**E PRONTO!**
Sua aplicação já está hospedada e funcionando!

![Aplicação hospedada no GitHub Pages](/assets/blog/como-hospedar-um-app-nextjs-no-github-pages/resultado.png)


## Conclusão

Pode parecer complicado, mas no final é bem simples, não é?

Espero que esse artigo tenha te ajudado! E se ajudou, compartinha aí pra ajudar mais gente!

Muito obrigado e bom código ❤️
