---
title: "Introdução ao Desenvolvimento Web"
excerpt: "Se você está querendo entrar no mundo do desenvolvimento web, esse guia é o ponto de partida. Aqui, descomplico o HTML, CSS e JavaScript para você começar a criar seus próprios sites. Ideal para quem tá começando e quer entender o básico."
coverImage: "/assets/blog/introducao-ao-desenvolvimento-web/banner.png"
date: "2024-02-19T15:18:17.250Z"
keywords: programação, dev, desenvolvimento, web developer, como criar um site
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg?updatedAt=1701730648991"
ogImage:
  url: "/assets/blog/introducao-ao-desenvolvimento-web/banner.png"
---

## Sumário
- [O que é o Desenvolvimento Web?](#o-que-é-o-desenvolvimento-web) - Visão geral do desenvolvimento de sites e aplicativos.
- [Estrutura básica de um site](#estrutura-básica-de-um-site) - Fundamentos do desenvolvimento FrontEnd: HTML, CSS, JavaScript.
- [Primeiro código](#primeiro-código) - Um guia passo a passo para criar sua primeira página.
- [Entendendo as linguagens](#entendendo-as-linguagens) - Detalhes sobre HTML, CSS e JavaScript.
- [Ampliando Horizontes: Frameworks no Desenvolvimento Web](#ampliando-horizontes-frameworks-no-desenvolvimento-web) - Introdução aos frameworks e sua importância.



## O que é o Desenvolvimento Web?

Se você é iniciante essa pergunta pode ter muitas respostas, mas em resumo, é a criação de Sites, Aplicativos e sistemas que operam através da internet.

O que pode incluir: Sites pessoais/institucionais, Blogs, Redes sociais, Aplicativos de Celular, Sistemas de Gestão empresarial e etc.

### Áreas de atuação

Dentro do desenvolvimento Web, existem algumas áreas e segmentos:

#### Frontend: 
É a parte do que o usuário interage. 
Envolve tudo que está diretamente ligado ao usuário: desde textos e imagens até sliders e botões. Utiliza tecnologias como HTML, CSS e JavaScript.

#### Backend: 
É a parte "por trás das cortinas", onde ocorre o processamento dos dados. 
O frontend manda solicitações para o backend, que devolve os dados e informações que ele precisa.
Essa parte inclui servidores, bancos de dados e aplicações server-side.

#### User Interface (UI): 
É a área que lida com a criação de interface e Layout de um app ou site.
E o foco é ter algo bem apresentável para o usuário.

#### User Experience (UX): 
Lida com a experiência geral do usuário ao interagir com o produto.
Essa área foca em analizar e aprimorar a experiência do usuário ao usar o produto.

#### Mobile: 
É focado especificamente em aplicativos para dispositivos móveis, como celular, tablet e etc.
E costuma ser dividida entre IOS e Android, já que cada um possui algo em particular.

## Estrutura básica de um site

Aqui, vamos focar em falar do desenvolvimento **FrontEnd**.

Resumidamente, um site é composto por:

- **HTML** (HyperText Markup Language): Uma estrutura de texto que indica pro navegador os componentes que precisam ser exibidos.
- **CSS** (Cascading Style Sheets): Uma linguagem de estilos. É com ela que definimos cores de botões, tamanhos de imagens e etc.
- **JavaScript**: A linguagem de programação mais popular da Web que serve para dar função aos componentes do site e "dar vida" a eles.


## Primeiro código

Se o melhor jeito de aprender é praticar, vamos começar?
Vou te dar algumas linhas de código aqui pra você poder criar sua primeira página.

Não se preocupe muito em entender tudo de primeira, mas se você for como eu, sei que esse código vai te dar curiosidade para entender melhor.

Primeiro, vamos escolher o seu **Editor de Texto**?
Na verdade, você pode usar qualquer um. Mesmo o **Bloco de Notas** do Windows, mas eu recomendo o [VS Code](https://code.visualstudio.com/) que é um editor feito para desenvolvedores.
É só clicar no [link](https://code.visualstudio.com/) para baixar.


Depois, crie um arquivo chamado `index.html` onde você quiser e coloque o código abaixo:
```html
<!DOCTYPE html>
<html>
  <!-- Cabeçalho do Site -->
  <head>
    <!-- Onde o titulo fica -->
    <title>Titulo do site</title>
    
    <!-- Estilização em CSS -->
    <style>
      body { text-align: center; }
      #myButton { background-color: #4CAF50; color: white; padding: 15px 32px; }
    </style>

  </head>
  <!-- Corpo do Site -->
  <body>
    <h2>Exemplo de Site Básico</h2>

    <!-- Input -->
    <input type="text" id="myInput" placeholder="Digite o seu nome">

    <!-- Botão -->
    <button id="myButton" onclick="buttonClicked()">Clique em mim</button>
  </body>
  
  <!-- JavaScript -->
  <script>
    function buttonClicked() {
      var inputValue = document.getElementById("myInput").value;
      alert("Olá, " + inputValue);
    }
  </script>
</html>
```

Então, é só ir na pasta onde esse arquivo está e clicar duas vezes para abrir no seu navegador.

E pronto, esse é o seu primeiro site!
![Seu primeiro site](/assets/blog/introducao-ao-desenvolvimento-web/seu-primeiro-site.png)

Que se você preencher seu nom e clicar no botão...
![Alert no Primeiro site](/assets/blog/introducao-ao-desenvolvimento-web/alert-no-primeiro-site.png)

## Entendendo as linguagens

### HTML

Você deve ter percebido no código acima que o HTML tem algumas tags como `<html>`, `<body>` e etc., né?

Elas são as marcações que dizem ao navegador o que mostrar e algumas outras coisas.

As principais tags são:

- `<html>`: A raiz do documento HTML, tudo deve estar dentro desta tag.
- `<head>`: Contém metadados e links para scripts e folhas de estilo.
- `<title>`: Define o título da página, que aparece na aba do navegador.
- `<body>`: Contém o conteúdo principal da página visível ao usuário.
- `<h1>` até `<h6>`: Tags de cabeçalho, representam diferentes níveis de títulos e subtítulos.
- `<p>`: Define um parágrafo de texto.
- `<a>`: Define um hyperlink, usado para linkar a outras páginas ou recursos.
- `<img>`: Utilizada para embutir imagens na página.
- `<ul>`, `<ol>`, `<li>`: Representam listas não ordenadas (com marcadores) e ordenadas (numéricas), com `<li>` para - cada item da lista.
- `<div>`: Um contêiner genérico para conteúdo de fluxo, sem significado semântico.
- `<span>`: Similar ao `<div>`, mas para conteúdo inline, sem quebra de linha.
- `<form>`: Define um formulário para entrada do usuário.
- `<input>`: Define um campo de entrada de dados dentro de um formulário.
- `<button>`: Representa um botão clicável.
- `<br>`: Representa uma quebra de linha.

Essas tags geralmente abrem e fecham, com exceção de tags como `input`, `img` e `br`.
Ex.:

```html
<tag>Conteudo</tag>
```

E se você abriu uma tag dentro de outra, você só pode fechar a primeira depois que a segunda for fehcada.

Ex.:

```html
<!-- Certo -->
<body>
  <h1>Titulo</h1>
</body>

<!-- Errado -->
<body>
  <h1>Titulo
</body>
</h1>
```


Para os casos de não haver tag de fechamento, a boa prática é escrevê-los assim:

```html
<br />

<input />

<img />
```

---

E essas tags também possuem atributos. Alguns atributos são iguais em praticamente todas as tags, como:

- `id`: Para identificação e estilização. Obs.: Não pode ser Repetido
- `class`: Para identificação e estilização que pode ser repetido.

<br />

Mas algumas tags tem atributos específicos como:
- `<html>`: 
  - lang: Especifica o idioma do conteúdo do documento.
- `<a>`: 
  - `href`: Especifica o URL do link.
  - `target`: Define como o link será aberto (como em uma nova aba com _blank).
- `<img>`:  (Obs.: Não possui uma tag de fechamento)
  - `src`: URL da imagem.
  - `alt`: Texto alternativo para a imagem.
- `<form>`: Define um formulário HTML para entrada do usuário.
  - `action`: Especifica para onde enviar os dados do formulário.
  - `method`: Define o método HTTP para envio (GET ou POST).
- `<input>`:
  - `type`: Tipo de input (texto, senha, email, etc.).
  - `name`: Nome do campo para processamento no servidor ou scripts.
- `<button>`:
  - `type`: Define o tipo do botão (submit, reset, button).
  - `onclick`: Evento JavaScript que é acionado quando o botão é clicado.

### CSS - Cascading Style Sheets

CSS, ou Cascading Style Sheets, é a linguagem que usamos para estilizar e organizar o layout de páginas web. 

Ela define como os elementos HTML são exibidos na tela, te deixando definir cores, fontes, espaçamentos e etc.



#### Sintaxe básica do CSS

A sintaxe do CSS é simples: Seleção e Declaração. 
Um seletor aponta para o elemento HTML que você quer estilizar, e as declarações (dentro de chaves {}) definem como fazer isso. 

Por exemplo:

```css
p {
  color: red;
  font-size: 16px;
}
```

Este código faz com que todos os parágrafos (`<p>`) na página tenham a cor vermelha e tamanho de fonte de 16 pixels.


#### Como estilizar elementos HTML com CSS:

Há três maneiras principais de incluir CSS em uma página web:

1 - Inline: diretamente no atributo style de um elemento HTML.

```html
<p style="color: blue;">Texto azul.</p>
```

2 - Interno: dentro de uma tag `<style>` no `<head>` do documento.

```html
<style>
  p { color: green; }
</style>
```

3 - Externo: linkando um arquivo CSS externo com a tag `<link>`.

```html
<link rel="stylesheet" href="[caminho-para-o-arquivo]/styles.css">
```

O método externo é o mais recomendado para projetos maiores, já que separa o CSS do HTML, deixando a manutenção e reutilização mais fácil.



### JavaScript

JavaScript é uma linguagem de programação dinâmica que é usada para tornar as páginas web interativas. 

Ela serve para criar funções nas páginas web, como: 
- Mostrar ou esconder informações
- Interagir com formulários
- Modificar o conteúdo da página dinamicamente
- Entre outras coisas...

#### Sintaxe básica do JavaScript:

JavaScript é composto por declarações e expressões que incluem variáveis, funções, operadores, e instruções de controle de fluxo. 
Por exemplo:


```javascript
var mensagem = "Olá, Racoelho!";
function mostrarMensagem() {
  alert(mensagem);
}

mostrarMensagem();
```

#### Como interagir com elementos HTML usando JavaScript:

JavaScript pode manipular o **DOM ** (Document Object Model) para interagir e manipular os elementos HTML. 

Isso pode ser feito usando métodos como getElementById, querySelector, e etc., para selecionar elementos, e então modificar suas propriedades, estilos ou conteúdo. 

Exemplo:

```javascript
document.getElementById("demo").innerHTML = "Texto alterado!";
```

Esse código busca um elemento com o **id** "demo" e muda o valor interno para "Texto alterado!".


## Ampliando Horizontes: Frameworks no Desenvolvimento Web

Sei que você não vai ficar satisfeito só com isso, né? Agora que você pegou o jeito do básico em desenvolvimento web com HTML, CSS e JavaScript, é hora de levar as coisas para o próximo nível. 
E é aí que entram os frameworks.

Tendo esses fundamentos em mente, eu recomendo fortemente você pesquisar BASTANTE e usar esse site aqui:  [W3Schools](https://www.w3schools.com/). 
Eles têm tutoriais incríveis que cobrem desde o básico até conceitos mais avançados, incluindo frameworks populares como [React](https://www.w3schools.com/react/default.asp), [Angular](https://www.w3schools.com/angular/default.asp) e [jQuery](https://www.w3schools.com/jquery/default.asp). 

Essas ferramentas não só vão acelerar seu desenvolvimento, mas também vão te ajudar a adotar as melhores práticas da indústria desde cedo.

Frameworks podem parecer intimidadores no começo, mas eles são essenciais para desenvolver aplicações web modernas, escaláveis e eficientes. 

Então, bem vindo ao mundo de Desenvolvimento Web e feliz codificação!
