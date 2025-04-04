---
title: "O que são Observers"
excerpt: "Entenda o padrão Observer e como ele pode ser usado para notificar múltiplos componentes ao mesmo tempo"
coverImage: "/assets/blog/o-que-sao-observers/banner.png"
date: "2024-11-05T12:58:09.912Z"
keywords: programação, dev, desenvolvimento, Design Patterns, Observer, Observable, Desenvolvimento de Jogos, Arquitetura de Software
author:
  name: "racoelho"
  picture: "https://github.com/rafa-coelho.png"
ogImage:
  url: "/assets/blog/o-que-sao-observers/banner.png"
---


O **Observer** é um Design Pattern de comportamento que te cria um mecanismo de "notificação" para diversos objetos sobre qualquer evento que aconteça no objeto observado.

Se você já usou Angular ou RxJS, já viu os `Observables` da lib do `ngrx` que são basicamente uma implementação de um Observer.

Com o Observer, você cria uma estrutura onde se pode adicionar **observadores** que vão ser notificados à cada atualização que nem no fluxo abaixo.

![Fluxo Observer](/assets/blog/o-que-sao-observers/observer-flow.png)


### Exemplo prático 
Vamos imaginar o seguinte cenário:

Em um jogo, o jogador pode receber dano, e, ao ocorrer esse evento, diferentes sistemas precisam ser notificados, como a barra de vida, um sistema de áudio para tocar sons de dor, e um sistema de log para registrar o evento.

#### Exemplo de Código
Imagine que estamos desenvolvendo esse sistema em **JavaScript**, onde o **Jogador** é o **Observable** e cada componente que precisa ser notificado (barra de vida, áudio, log de eventos) é um **Observador**.


1. Observable (Jogador)

```javascript
class Jogador {
  constructor() {
    this.observadores = [];
    this.vida = 100; // vida inicial do jogador
  }

  // Adicionar um observador
  adicionarObservador(observador) {
    this.observadores.push(observador);
  }

  // Remover um observador
  removerObservador(observador) {
    this.observadores = this.observadores.filter(obs => obs !== observador);
  }

  // Notificar todos os observadores
  notificar() {
    this.observadores.forEach(observador => observador.atualizar(this.vida));
  }

  // Reduzir a vida e notificar observadores se o jogador sofre dano
  receberDano(dano) {
    this.vida -= dano;
    console.log(`😨 Jogador recebeu ${dano} de dano. Vida atual: ${this.vida}`);
    this.notificar();
  }
}
```
2. Observadores

Cada observador representa uma reação específica ao evento de dano e implementa o método `atualizar`.

**Observador da Barra de Vida:**
```javascript
class BarraDeVida {
  atualizar(vida) {
    console.log(`📉 Atualizando barra de vida: ${vida} de vida restante.`);
  }
}
```

**Observador de Áudio:**
```javascript
class SistemaDeAudio {
  atualizar(vida) {
    console.log(`🔊 Tocando som de dano. Vida atual do jogador: ${vida}`);
  }
}
```

**Observador de Log de Eventos:**
```javascript
class LogDeEventos {
  atualizar(vida) {
    console.log(`📜 Registrando no log: jogador sofreu dano. Vida restante: ${vida}`);
  }
}
```
3. Uso do Sistema

Agora, vamos criar o **Jogador** e adicionar observadores para simular as notificações.

```javascript
// Instanciar o jogador
const jogador = new Jogador();

// Criar observadores
const barraDeVida = new BarraDeVida();
const sistemaDeAudio = new SistemaDeAudio();
const logDeEventos = new LogDeEventos();

// Adicionar observadores ao jogador
jogador.adicionarObservador(barraDeVida);
jogador.adicionarObservador(sistemaDeAudio);
jogador.adicionarObservador(logDeEventos);

// Simular o jogador recebendo dano
jogador.receberDano(20); // Reduz a vida e notifica observadores
jogador.receberDano(30); // Reduz ainda mais e notifica novamente
```

A saída será:

```
😨 Jogador recebeu 20 de dano. Vida atual: 80
📉 Atualizando barra de vida: 80 de vida restante.
🔊 Tocando som de dano. Vida atual do jogador: 80
📜 Registrando no log: jogador sofreu dano. Vida restante: 80

😨 Jogador recebeu 30 de dano. Vida atual: 50
📉 Atualizando barra de vida: 50 de vida restante.
🔊 Tocando som de dano. Vida atual do jogador: 50
📜 Registrando no log: jogador sofreu dano. Vida restante: 50
```

Neste exemplo, o padrão Observer permite que diferentes partes do sistema de jogo reajam automaticamente ao evento de dano, mantendo o código organizado e facilitando a adição de novos comportamentos.

### Conclusão

Para encerrar, o padrão Observer é uma ótima escolha quando você precisa de um sistema que se adapte e responda a eventos em tempo real, permitindo que diferentes componentes reajam a mudanças sem que o código do sujeito principal precise ser alterado.

Em cenários de jogos, aplicativos de monitoramento e até em redes sociais, o Observer ajuda a criar arquiteturas flexíveis e modulares, facilitando tanto a manutenção quanto a expansão do sistema.

Esse padrão é amplamente aplicável, seja em interfaces reativas, notificações de eventos ou outros tipos de resposta a mudanças. Ele permite adicionar e remover observadores com facilidade, garantindo que o sistema se mantenha desacoplado e escalável.
