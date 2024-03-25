---
title: "Criando um app React com Typescript: guia passo a passo"
excerpt: "Aprenda como fazer seu próximo app com esse tutorial de como criar um app com React usando Typescript."
coverImage: "/assets/blog/criando-um-app-com-react-e-typescript/banner.png"
date: "2024-03-25T12:45:00.918Z"
keywords: React, TypeScript, Desenvolvimento Web, Programação Front-end, Criação de Aplicativos, Tipagem Estática, Componentes React, Gerenciamento de Estado, Estilização de Aplicativos, CSS-in-JS, Styled Components, SASS/SCSS, Hooks React, Desenvolvimento de Software
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg?updatedAt=1701730648991"
ogImage:
  url: "/assets/blog/criando-um-app-com-react-e-typescript/banner.png"
---

Se você está com uma ideia de um projeto que precisa ser dinâmico e moderno, talvez React seja uma boa escolha de tecnologia para você usar.
E um ótimo jeito de manter os bugs longe do seu projeto é usando [Typescript](https://racoelho.com.br/posts/o-que-e-o-typescript), que é um *super set* de tipos para o javascript.
Para saber mais, leia [esse artigo](https://racoelho.com.br/posts/o-que-e-o-typescript).


## Primeiros passos

Primeiro, você precisará configurar o ambiente de desenvolvimento. Isso envolve a instalação do Node.js, que é uma plataforma de desenvolvimento JavaScript, e do npm, que é o gerenciador de pacotes do Node.js. Em seguida, você precisará instalar o create-react-app, que é uma ferramenta que ajuda a criar um novo aplicativo React com facilidade. 

Depois de instalar essas ferramentas, você estará pronto para começar a criar seu aplicativo React com Typescript.


## Configurando o Ambiente

### Instalação do Node.js e NPM

Antes de começar a criar o primeiro app React com TypeScript, é necessário instalar o Node.js e o NPM. Essas ferramentas são essenciais para o desenvolvimento de aplicações web modernas.

Para instalar o Node.js e o NPM, basta acessar o [site oficial](https://nodejs.org) e baixar o instalador correspondente ao seu sistema operacional. Após a instalação, verifique se tudo foi instalado corretamente executando os comandos `node -v` e `npm -v` no terminal.

### Criação do Projeto React com TypeScript
Com o Node.js e o NPM instalados, é possível criar o projeto React com TypeScript. 
Para isso, basta executar o seguinte comando no terminal:

```bash
npx create-react-app my-app --template typescript
```

Esse comando cria um novo projeto React com TypeScript, utilizando o template padrão do Create React App. Após a criação do projeto, é possível executá-lo com o comando `npm start`.

É importante ressaltar que o Create React App já configura automaticamente o ambiente de desenvolvimento com as ferramentas necessárias para o desenvolvimento de aplicações React com TypeScript, como o Webpack e o Babel. Dessa forma, o desenvolvedor pode focar apenas na criação do app, sem se preocupar com a configuração do ambiente.

## Estrutura Básica do Projeto
Ao criar um aplicativo React com TypeScript, é importante ter uma estrutura básica bem definida. Isso ajuda a organizar os arquivos e torna mais fácil a manutenção do código. Nesta seção, serão apresentados os principais elementos da estrutura básica de um projeto React com TypeScript.

### Organização dos Arquivos

A organização dos arquivos em um projeto React com TypeScript pode variar de acordo com as necessidades do desenvolvedor e do projeto em questão. No entanto, é comum que a estrutura básica do projeto contenha os seguintes diretórios:

- src: diretório que contém o código-fonte do aplicativo.
- public: diretório que contém os arquivos públicos do aplicativo, como o arquivo HTML principal e as imagens.
- node_modules: diretório que contém as dependências do projeto.
- build: diretório que contém os arquivos gerados pelo processo de build do aplicativo.

Dentro do diretório **src**, é comum que os arquivos sejam organizados em subdiretórios de acordo com a funcionalidade que eles implementam. Por exemplo, pode-se ter um subdiretório para os componentes, outro para as páginas e outro para os serviços.

## Componentes React

### Criando um Componente
Um componente React é uma parte reutilizável de uma interface de usuário. Ele pode ser definido como uma função ou uma classe. Para criar um componente React, é necessário importar o React e definir uma função que retorne um elemento React. A seguir, um exemplo de como criar um componente simples:

``` typescript
import React from 'react';

function HelloWorld() {
  return <h1>Hello, World!</h1>;
}

export default HelloWorld;
```

Este componente pode ser usado em outras partes da aplicação como qualquer outro elemento HTML.

### Props e State com TypeScript
Os componentes React podem receber dados através de suas propriedades (props) e armazenar dados em seu estado interno (state). O TypeScript pode ser usado para definir o tipo desses dados e garantir que eles sejam usados corretamente.

``` typescript
import React, { useState } from 'react';

interface Props {
  name: string;
}

function Greeting(props: Props) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Greeting;
``` 

Neste exemplo, o componente Greeting recebe uma propriedade name do tipo string. Ele também armazena um estado interno count do tipo number que é atualizado quando o botão é clicado. O TypeScript garante que o name seja sempre uma string e que o count seja sempre um número.

## Gerenciamento de Estado
O gerenciamento de estado é uma parte crucial de qualquer aplicativo React. 
Nesta seção, vamos explorar algumas das opções disponíveis para gerenciar o estado em um aplicativo React com TypeScript.

### Utilizando o useState
O hook useState é uma das principais formas de gerenciar o estado de um componente em React. Ele permite que você adicione estado a um componente funcional sem precisar converter para uma classe.

Para utilizar o useState, basta importá-lo do React e chamar a função dentro do componente. O primeiro parâmetro é o valor inicial do estado e o segundo é uma função que permite atualizar o estado.

``` typescript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Você clicou {count} vezes</p>
      <button onClick={() => setCount(count + 1)}>
        Clique aqui
      </button>
    </div>
  );
}
``` 

## Context API com TypeScript
O Context API é uma forma de compartilhar dados entre vários componentes em uma árvore de componentes, sem precisar passar explicitamente as props através de cada nível.

Para utilizar o Context API, primeiro é necessário criar um contexto com a função createContext. Em seguida, pode-se definir um provedor para o contexto, que é responsável por fornecer o valor do contexto para os componentes filhos.

``` typescript
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

function Header() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header>
      <h1>Meu aplicativo</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Trocar tema
      </button>
    </header>
  );
}
``` 

## Estilização e CSS
A estilização de um aplicativo React com TypeScript é uma parte crucial do desenvolvimento de uma aplicação moderna. Existem várias opções para estilização em React, incluindo CSS-in-JS e pré-processadores de CSS como SASS e SCSS.

### CSS-in-JS com TypeScript
CSS-in-JS é uma técnica que permite escrever estilos diretamente em arquivos JavaScript ou TypeScript. Isso pode ajudar a reduzir o tempo de carregamento da página e melhorar a modularidade do código.

Uma biblioteca popular para CSS-in-JS com TypeScript é o Styled Components. Ele permite que os desenvolvedores escrevam estilos como componentes React, tornando-os mais fáceis de gerenciar e reutilizar.


Exemplo com o styled-components:

```typescript
import React from 'react';
import styled from 'styled-components';

// Cria um componente de estilo
const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const App: React.FC = () => {
  return (
    <div>
      <StyledButton>Clique aqui</StyledButton>
    </div>
  );
}

export default App;
```

### SASS e SCSS
SASS e SCSS são pré-processadores de CSS que permitem escrever estilos mais avançados, como variáveis, funções e mixins. Eles também podem ajudar a tornar o código mais organizado e fácil de ler.

Para usar SASS ou SCSS em um aplicativo React com TypeScript, é necessário configurar um pré-processador de CSS. Uma opção popular é o node-sass, que pode ser instalado via npm.

Em resumo, a escolha da técnica de estilização em um aplicativo React com TypeScript depende das necessidades do projeto e das preferências do desenvolvedor. CSS-in-JS pode ser uma boa opção para projetos menores ou para aqueles que precisam de estilos mais dinâmicos, enquanto SASS e SCSS podem ser mais adequados para projetos maiores ou para aqueles que precisam de estilos mais complexos.
