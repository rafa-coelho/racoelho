---
id: "m3d3yohl0yb4e"
title: "Desafio: Sistema de Reservas de Restaurante"
categories: Backend, Desafios de backend, portfolio, portfolio de backend, programação, portfolio programação, ideias de projetos backend
description: 
link: 
coverImage: "/assets/challenges/sistema-de-reservas-de-restaurante/banner.png"
ogImage:
  url: "/assets/challenges/sistema-de-reservas-de-restaurante/banner.png"
date: "2024-11-11T14:17:54.297Z"
---


# Desafio: Sistema de Reservas de Restaurante

Neste desafio, você vai construir uma API para gerenciar reservas de mesas em um restaurante. O objetivo é desenvolver funcionalidades comuns em sistemas reais de reserva, incluindo autenticação, validação e controle de disponibilidade. Esse projeto será uma ótima adição ao seu portfólio de backend!

## Requisitos do Projeto

### Objetivo Principal
Desenvolver uma API RESTful para:
- Registrar reservas de mesas.
- Controlar o status das reservas e das mesas.
- Bloquear reservas quando a mesa estiver ocupada.

### Stack Recomendado
- **Backend**: Node.js (Express), .NET Core ou Java (Spring).
- **Banco de Dados**: MySQL ou PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)

---

## Funcionalidades

1. **Autenticação de Usuário**
   - **Registro**: O usuário deve ser capaz de se registrar com um nome, e-mail e senha.
   - **Login**: Usuários autenticados recebem um token JWT para acesso às funcionalidades de reservas.
   - **Restrição de Acesso**: Apenas usuários logados podem criar e visualizar reservas.

2. **Gestão de Mesas**
   - **Listagem**: Listar todas as mesas disponíveis no restaurante.
   - **Criar Mesa**: Administradores podem adicionar novas mesas ao sistema com um nome e capacidade de pessoas.
   - **Status da Mesa**: Cada mesa pode estar `disponível`, `reservada` ou `inativa`.

3. **Sistema de Reservas**
   - **Criar Reserva**: Usuários autenticados podem criar reservas para mesas específicas.
   - **Verificar Disponibilidade**: A API deve verificar se a mesa está disponível no horário solicitado antes de confirmar a reserva.
   - **Cancelar Reserva**: Usuários podem cancelar suas reservas, o que libera a mesa para novas reservas.

4. **Controle de Status**
   - **Status das Mesas**: Mesas ficam `reservadas` automaticamente ao serem associadas a uma reserva.
   - **Status das Reservas**: Reservas têm status `ativo` quando confirmadas e `cancelado` quando canceladas.

---

## Estrutura do Banco de Dados

- **Usuários**
    - `id`: Identificador único.
    - `nome`: Nome do usuário.
    - `email`: E-mail do usuário (único).
    - `senha`: Senha do usuário, armazenada com hash.
    - `role`: Papel do usuário (ex.: `cliente` ou `administrador`).

- **Mesas**
    - `id`: Identificador único.
    - `nome`: Nome ou número da mesa.
    - `capacidade`: Quantidade máxima de pessoas que a mesa comporta.
    - `status`: Status atual da mesa (`disponível`, `reservada`, `inativa`).

- **Reservas**
    - `id`: Identificador único.
    - `usuario_id`: ID do usuário que fez a reserva.
    - `mesa_id`: ID da mesa reservada.
    - `data_reserva`: Data e horário da reserva.
    - `status`: Status da reserva (`ativo`, `cancelado`).

---

## Endpoints da API

### Autenticação
- `POST /usuarios/registrar` — Cadastro de novos usuários.
- `POST /usuarios/login` — Login de usuários e geração de token JWT.

### Mesas
- `GET /mesas` — Lista todas as mesas e seus status.
- `POST /mesas` — Adiciona uma nova mesa (apenas administradores).
- `PATCH /mesas/:id` — Atualiza informações de uma mesa.
- `DELETE /mesas/:id` — Remove uma mesa (apenas administradores).

### Reservas
- `POST /reservas` — Cria uma nova reserva, validando disponibilidade e a capacidade da mesa.
- `GET /reservas` — Lista todas as reservas do usuário autenticado.
- `PATCH /reservas/:id/cancelar` — Cancela uma reserva ativa.

---

## Regras de Negócio

1. **Verificação de Disponibilidade**
   - Antes de criar uma reserva, verifique se a mesa está disponível no horário desejado.

2. **Validação de Capacidade**
   - O sistema deve validar a capacidade da mesa para atender o número de pessoas indicado na reserva.

3. **Cancelamento de Reserva**
   - Quando uma reserva é cancelada, o sistema deve atualizar o status da mesa para `disponível`.

4. **Permissões de Usuário**
   - Apenas administradores podem adicionar, atualizar ou remover mesas.
   - Apenas o usuário que criou uma reserva pode cancelá-la.

---

## Validação de Dados

- **Datas e Horários**: A reserva só pode ser feita para horários futuros dentro do horário de funcionamento do restaurante.
- **Campos Obrigatórios**: Valide a presença de todos os campos obrigatórios em cada endpoint.
- **Formatos**: E-mails e datas devem estar em formatos corretos.

---

## O Que Você Pode Aprender Com Isso

Esse projeto cobre habilidades importantes para o desenvolvimento backend e simula situações reais de um sistema de reservas. Ao implementá-lo, você poderá aprender:

1. **CRUD Completo**: Como construir e organizar uma API com operações básicas (criação, leitura, atualização e exclusão) para recursos, como usuários, mesas e reservas.
2. **Autenticação e Autorização**: Uso de JWT para proteger rotas e controlar permissões de usuários.
3. **Validação de Dados**: Como validar entradas para garantir a integridade das informações, como horário, capacidade e status.
4. **Controle de Disponibilidade**: Gerenciamento de reservas e status para impedir duplicidade de reservas no mesmo horário e mesa.
5. **Modelagem de Banco de Dados**: Estruturar um banco relacional para representar relacionamentos e garantir consistência entre as entidades.
6. **Boas Práticas de API REST**: Aprender padrões e organização de rotas e respostas HTTP para melhorar a qualidade do código e documentação.

---

## Como Disponibilizar no Portfólio

Para adicionar esse projeto ao seu portfólio de maneira atrativa, considere os seguintes pontos:

1. **Publicar no GitHub com um bom README.md**: Suba o código no GitHub com uma descrição completa do projeto, incluindo uma breve introdução, estrutura do banco de dados, principais endpoints e instruções para instalação modo de uso, regras de negócio, explicação das decisões técnicas e etc.

3. **Documentação da API**: Use o Swagger ou Postman para documentar a API, incluindo exemplos de requisições e respostas. Isso facilita a compreensão das funcionalidades e mostra seu cuidado com documentação.

4. **Demonstração com Docker**: Disponibilize uma configuração Docker para facilitar a execução da API. Isso torna o projeto acessível para quem deseja testá-lo rapidamente.

5. **Apresentação Visual**: Crie um README.md organizado e visualmente atrativo, com imagens e diagramas simples (como diagrama ER) para demonstrar o funcionamento e a arquitetura do sistema.

6. **Demo em Produção**: Se possível, hospede o projeto em uma plataforma gratuita como Heroku ou Render, para que recrutadores ou interessados possam testar a API em tempo real.

7. **Explicação Técnica no Portfólio**: Adicione uma seção explicando os desafios enfrentados e soluções implementadas. Destacar problemas específicos resolvidos mostra seu conhecimento técnico.

---

Esse desafio prático permite que você aprenda e aplique habilidades essenciais para backend enquanto cria algo útil para seu portfólio. Boa sorte e mãos à obra!
