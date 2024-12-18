---
id: "m4rlt086mswvb"
title: "#6 Amigo Secreto"
keywords: desafios, desafios programação, portfolio, portfolio de programador, programação, ideias de projeto, Amigo Secreto
categories: Frontend
description: Desenvolva um sistema de sorteio de Amigo Secreto usando IndexDB para armazenar participantes e resultados.
level: MEDIUM
link: 
coverImage: "/assets/challenges/amigo-secreto/banner.png"
ogImage:
    url: "/assets/challenges/amigo-secreto/banner.png"
date: "2024-12-16T22:25:51.462Z"
---


# #6 Desafio de Programação: Amigo Secreto

## Descrição
Este desafio propõe a recriação de um sistema para sorteio de Amigo Secreto utilizando IndexDB para armazenamento local. O objetivo é criar uma aplicação simples, funcional e offline-friendly, que permita organizar e realizar sorteios de forma intuitiva. É ideal para aprender sobre tecnologias modernas de front-end e persistência de dados no navegador.

Você pode conferir um exemplo do projeto no post original: [Sorteio de Amigo Secreto](https://racoelho.com.br/posts/sorteio-de-amigo-secreto).

Ou uma demo funcionando nesse link: [Amigo Secreto](https://secret-santa.racoelho.com.br/).

---

## Objetivo
1. Criar uma aplicação web para sorteio de Amigo Secreto.
2. Implementar o armazenamento de dados localmente com **IndexDB**.
3. Publicar a aplicação para uso real.

---

## O que será Aprendido
1. **Persistência de Dados no Front-end:**
   - Como usar o **IndexDB** para salvar informações localmente.
2. **Manipulação de Arrays e Objetos:**
   - Técnicas para criar e embaralhar listas para o sorteio.
3. **Desenvolvimento Web:**
   - Uso de HTML, CSS e JavaScript para criar interfaces interativas.
4. **Publicação de Projetos:**
   - Como hospedar uma aplicação web usando GitHub Pages ou outro serviço.

---

## Especificações do Desafio

### Funcionalidades Obrigatórias
1. **Cadastro de Participantes**
   - Adicionar participantes com nome e email.
   - Listar participantes na tela.

2. **Sorteio do Amigo Secreto**
   - Realizar o sorteio embaralhando a lista de participantes.
   - Garantir que nenhum participante seja seu próprio amigo secreto.
   - Mostrar o resultado de forma segura (ex.: exibir apenas o amigo secreto de cada participante mediante interação).

3. **Armazenamento Local**
   - Salvar os participantes no **IndexDB**.
   - Manter os dados persistentes mesmo ao recarregar a página.

4. **Interface Amigável**
   - Design simples e funcional para cadastro, sorteio e visualização dos resultados.


---
### Telas
Como o projeto é front-end apenas, as operações são feitas localmente, mas seguem uma estrutura lógica:

- Adicionar Participante: Salva no IndexDB.
- Listar Participantes: Recupera do IndexDB.
- Realizar Sorteio: Gera o resultado no front-end e salva no IndexDB.
- Visualizar Resultados: Recupera os dados do sorteio e exibe para o usuário.

---

### Funcionalidades Opcionais (Diferenciais)
1. **Envio de Resultados**
   - Implementar envio de emails para notificar os participantes com seus amigos secretos (usando serviços como EmailJS ou APIs de email).
2. **Temas Personalizáveis**
   - Adicionar a possibilidade de mudar a aparência da aplicação com temas diferentes.
3. **Histórico de Sorteios**
   - Salvar múltiplos sorteios no **IndexDB** e permitir consulta posterior.

---

## Sugestões de Stack

### Frontend
- **HTML5, CSS3 e JavaScript:**
  - Criação da interface e funcionalidades básicas.
- **Frameworks Opcionais:** 
  - **React.js** ou **Vue.js** para componentes reativos.
  - **Tailwind CSS** ou **Bootstrap** para estilização rápida.

### Armazenamento
- **IndexDB:** 
  - API nativa do navegador para armazenamento local de dados.
- **Alternativa:** LocalStorage (menos recomendado para volumes maiores de dados).

### Publicação
- **GitHub Pages:** Hospedar a aplicação de forma gratuita.
- **Netlify** ou **Vercel:** Opções modernas para deploy.

---

## Especificações de Arquitetura

### Frontend
1. **Páginas Principais:**
   - Cadastro de Participantes.
   - Página de Sorteio.
   - Tela de Resultados.
2. **Interatividade:**
   - Manipulação do DOM para adicionar e exibir participantes.
   - Botão para sortear e exibir resultados.


## Fluxo de Uso
1. **Cadastro de Participantes**
   - Usuário adiciona os nomes e emails de cada participante.
   - Os dados são salvos localmente no IndexDB.
2. **Sorteio**
   - Ao clicar no botão "Sortear", o sistema embaralha os participantes e salva os resultados.
3. **Visualização**
   - Cada participante pode acessar seu resultado individualmente.
4. **(Opcional) Notificação**
   - Resultados são enviados por email automaticamente.

---

## Publicação
1. **Preparação**
   - Configure o repositório no GitHub.
   - Use ferramentas como Webpack ou Vite (opcional) para otimizar o projeto.
2. **Deploy**
   - **GitHub Pages:** Configure o repositório para deploy automático.
   - **Netlify/Vercel:** Faça o upload da aplicação com suporte a builds automáticas.
3. **Domínio Personalizado**
   - Opcionalmente, configure um domínio customizado para a aplicação.

---

## Nível do Desafio
- **Intermediário:** Requer conhecimentos básicos de JavaScript, manipulação de dados e APIs do navegador.
- **Avançado (com diferenciais):** Inclui envio de emails, histórico de sorteios e exportação de dados.

---


Boa sorte com o desafio! 🚀
