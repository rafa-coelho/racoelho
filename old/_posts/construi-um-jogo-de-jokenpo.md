---
title: "Construi um jogo de jokenpo"
excerpt: "Como eu criei um Jokenpo com WebSockets e JavaScript vanilla!"
coverImage: "/assets/blog/construi-um-jogo-de-jokenpo/paper-rock-and-scissors.webp"
date: "2024-02-08T02:43:41.748Z"
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg"
ogImage:
  url: "/assets/blog/construi-um-jogo-de-jokenpo/paper-rock-and-scissors.webp"
---


Esses dias, postei naquela rede que as pessoas inventam cargos e termos um teste que eu fiz com WebSockets: Um jogo de Jokenpô.

Projeto bobo? Sim, mas se é de pequenas doses de dopamina que os viciados em Tiktok se movem, por que eu também não posso?

A ideia era só brincar com WS mesmo, mas eu cheguei a me empolgar tanto que quando percebi, estava fazendo protótipos para um app mobile que eu tenho CERTEZA que eu nunca iria fazer.

Então, decidi largar de mão e só fiz uma UI simples com html que só tem 3 botões e um quadro para ver o placar e a opção selecionada pelo oponente.

A parte que mais gostei de fazer nele foi o Criador de Partidas:
Quando você se conecta, ele te coloca numa fila aguardando outro jogador para poder montar uma "sala" onde vai começar uma partida de Melhor de Três.

Queria dar uma evoluída nele eventualmente, mas tô sentindo que não vou 😅 (pelo menos, não tão cedo).

Bem, sintam-se livres a dar uma olhada e contribuir, se quiserem:

[Repositório](https://github.com/rafa-coelho/jokenpo)

Eu hospedei ele no render também (pode demorar pra startar o pod deles):
##### Lembre-se de abrir 2 navegadores!!
[Demo](https://jokenpo.racoelho.com.br/)


Segue uns prints dele:
![searchingRoom](https://raw.githubusercontent.com/rafa-coelho/jokenpo/main/assets/screenshots/searchingRoom.png)

![Playing](https://raw.githubusercontent.com/rafa-coelho/jokenpo/main/assets/screenshots/playing.png)

![Match Result](https://raw.githubusercontent.com/rafa-coelho/jokenpo/main/assets/screenshots/matchResult.png)
