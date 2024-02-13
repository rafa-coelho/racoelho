---
title: "Sorteio de Amigo Secreto: Sem API, Só Hash"
excerpt: "Lorem ipsum."
coverImage: "/assets/blog/sorteio-de-amigo-secreto/banner.png"
date: "2024-02-13T04:08:36.585Z"
keywords: programação, dev, desenvolvimento, IndexedDB, base64, Next, React
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg?updatedAt=1701730648991"
ogImage:
  url: "/assets/blog/sorteio-de-amigo-secreto/banner.png"
---

No final do ano de 2023 eu topei participar de um Amigo Secreto da minha familia que, como cada um mora distante do outro, foi sorteado online.
A organizadora nos enviou links onde vimos os nomes de quem tiramos.

E algo me chamou muita atenção...

O site pareceu uma aplicação tão simples: Uma plaraforma onde você informa uma lista de nomes que terão pares sorteados e links individuais para exibição dos nomes.

E eis o que me chamou a atenção: **a elegância de uma solução simples.**

Então, decidi recriar a mesma aplicação...


## A ideia

Sempre que penso na construção de uma aplicação, uma das primeiras coisas que penso é: como vou estruturar e armazenar os dados?

E a resposta para a geração desses links é: não vou!

O sorteado não precisa de muito mais do que o nome da pessoa que ele sorteou, certo? Então, é só o que vamos mandar para ele!


E quanto ao dono do sorteio?

Bem... ele talvez precise ver novamente alguma informação daquele Amigo Secreto. Então, podemos persistir de uma forma que só ele veja, assim, não precisando de nenhuma centralização de dados.

## O projeto

A aplicação teria 4 telas
- Inicial: onde o usuário veria a lista de seus sorteios já criados.
- Formulário de Criação do Amigo Secreto.
- Tela de visualização: Onde o usuário veria cada nome atrelado a um botão de "Enviar Link".
- Tela de revelação: onde o sorteado veria o nome da pessoa que sorteou.

Escolhi usar **NextJS** e usar o **IndexedDB** para persistência local.

### 1 - Formulário de Criação

Sim, vamos começar com ele.

Pensei um pouco sobre como seria para adicionar multiplos nomes e fiquei dividido entre um input baseado em *Tags* usando algum separador:
![Input Em Tags](/assets/blog/sorteio-de-amigo-secreto/input-em-tags.png)

E entre multiplos inputs seguidos por um botão de "adicionar outro" como abaixo:
![Multiplos Inputs](/assets/blog/sorteio-de-amigo-secreto/multiplos-inputs.png)

E no fim acabei optando pela segunda opção.

