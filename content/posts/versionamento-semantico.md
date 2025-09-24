---
title: "Versionamento Semântico"
excerpt: "Lorem ipsum."
coverImage: "/assets/blog/versionamento-semantico/banner.png"
date: "2025-09-24T21:25:08.303Z"
keywords: programação, dev, desenvolvimento
author:
  name: "racoelho"
  picture: "https://github.com/rafa-coelho.png"
ogImage:
  url: "/assets/blog/versionamento-semantico/banner.png"
---

## TL; DR;

Uma *versão semântica* é estruturada por MAJOR.MINOR.PATCH, considerando:

1. **MAJOR**: Versão que quebra a compatibilidade com a anterior
2. **MINOR**: Versão que adiciona funcionalidades e quebra não a compatibilidade com a anterior.
3. **PATCH**: Versão com pequenos ajustes ou correção de bugs.

Obs.: Outras labels podem ser adicionadas no final da versão para marcar uma "pre-release".


## O que é o Versionamento Semântico

Sabe aquele número de versão tipo `1.0.1`? 
Então, eles servem pra você ter um controle de qual build está no ar; e é muito util pra poder acompanhar bugs, builds e etc.

Mas tem uma coisa que pouca gente se pergunta: **Como escolher esse número?**

Pra isso, existe uma convenção chamada **"Versionamento Semântico"** que define uma "regra" para a hora de definir esse número.

Ela divide o número de versão em 3 partes: MAJOR.MINOR.PATCH que seria traduzido em MAIOR.MENOR.CORREÇÃO.

A ideia é que ao olhar o número na nova versão você já entenda qual foi o tipo de alteracão.

## Regras de Versionamento

O **Versionamento Semântico** tem umas regras até be simples. A ideia é que, só de olhar o número da versão, você consiga entender **o tamanho e o impacto da mudança**. 

Funciona assim:

---

### 📌 Estrutura

O formato é sempre:
`MAJOR.MINOR.PATCH`
(ou seja: **X.Y.Z**)

* `X` → **MAJOR**
* `Y` → **MINOR**
* `Z` → **PATCH**

---

### 🚀 Como funciona na prática

1. **MAJOR (X)**
   Aumenta quando a atualização tem mudanças que podem ser **incompatíveis** com a versão anterior.
   👉 Exemplo: quando você altera o comportamento de uma API que já existia ou altera algo que faz o código que dependia da versão antiga parar de funcionar.

   > Sempre que o **MAJOR** sobe, o **MINOR** e o **PATCH** voltam para 0.
   > Exemplo: `2.4.5` → `3.0.0`.

2. **MINOR (Y)**
   Aumenta quando você adiciona **novas funcionalidades**, mas sem quebrar a compatibilidade com o que já existia.
   👉 Também sobe se alguma funcionalidade for marcada como **deprecated** (obsoleta).

   > Sempre que o **MINOR** sobe, o **PATCH** volta para 0.
   > Exemplo: `2.4.5` → `2.5.0`.

3. **PATCH (Z)**
   Aumenta quando você sobe **correções de bugs ou ajustes** que não afetam o funcionamento ou compatibilidade das versões anteriores.
   👉 Nada de recurso novo, só consertos.


---

### 🔬 Casos especiais

* **Versões 0.x.y**
  São versões de **desenvolvimento inicial**. Tudo pode mudar a qualquer momento.
  Não confie em estabilidade.

* **Pré-releases**
  São versões ainda **instáveis** ou em teste, marcadas com hífen depois do PATCH.
  👉 Exemplos: `1.0.0-alpha`, `1.0.0-beta.1`.

  > Sempre têm **menor prioridade** que a versão final (`1.0.0-alpha < 1.0.0`).

* **Metadados de build**
  São informações extras anexadas com `+` no final da versão.
  👉 Exemplos: `1.0.0+exp.sha.5114f85` ou `1.0.0-beta+001`.

  > Não influenciam na ordem de prioridade da versão.

---

### 📊 Ordem de prioridade
Quando o sistema precisa decidir “quem é mais novo”, a comparação é feita nesta ordem:
`MAJOR > MINOR > PATCH > pré-release`

Exemplo:

```
1.0.0 < 2.0.0 < 2.1.0 < 2.1.1
1.0.0-alpha < 1.0.0
```

---

Assim, cada número carrgea uma mensagem clara: se você quebrou compatibilidade, se só adicionou algo novo ou se apenas corrigiu um bug.

## Conclusão

Pra fechar, usar isso pode te ajudar a acompanhar seus builds, fazer tracking de bugs nos ambientes e até coordenar o time de desenvolvimento.

Esse conteúdo foi extraido 


