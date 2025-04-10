---
id: "m3wyngtbhu27e"
title: " #3 Fila de Espera"
keywords: desafios, desafios programação, portfolio, portfolio de programador, programação, ideias de projeto
categories: Backend
description: Sistema para gerenciar filas de espera e consultar posições nela.
level: MEDIUM
link: 
coverImage: "/assets/challenges/fila-de-espera/banner.png"
ogImage:
    url: "/assets/challenges/fila-de-espera/banner.png"
date: "2024-11-25T11:44:36.575Z"
tags: ["RabbitMQ", "Queues"]
---


# #3 Desafio de Programação: Sistema de Fila de Espera

## Objetivo
Desenvolver um **Sistema de Fila de Espera** completo, desde o backend até a interface (opcional), que organiza clientes em filas de atendimento. O sistema deve gerenciar múltiplas filas, priorizar atendimentos, enviar notificações e fornecer painéis para administração e consulta dos clientes.

---

## Especificação do Desafio
Você deverá construir um sistema funcional com as seguintes capacidades:

### Mínimo Viável
1. Registro de clientes em filas com categorias e prioridades.
2. Listagem de clientes na fila com ordenação por prioridade.
3. Chamar clientes em ordem e registrar o histórico.
4. Consulta do cliente à sua posição na fila.

### Extras para Diferencial
1. Notificações por SMS ou e-mail.
2. Painel administrativo com métricas (tempo médio de espera, volume de atendimentos).
3. Configuração de regras de fila e prioridades.

---

## O que será aprendido
- **Backend:**
  - Desenvolvimento de APIs RESTful.
  - Organização de filas e priorização.
  - Persistência de dados com bancos de dados relacionais ou não-relacionais.
- **Frontend (opcional):**
  - Criação de interfaces simples para painéis de clientes e administradores.
  - Consumo de APIs.
- **DevOps:**
  - Autenticação e autorização com JWT.
  - Configuração de um sistema para notificações externas (ex.: Twilio).
- **Conceitos Gerais:**
  - Manipulação de filas.
  - Estruturação e otimização de queries no banco de dados.
  - Design de sistemas escaláveis e de alto desempenho.

---

## Arquitetura

### 1. Diagrama de Arquitetura
```
[Frontend]
    ↓ (API RESTful)
[Backend]
    ↓
[Database]
```

### 2. Camadas
1. **Frontend** (opcional):
   - Painel do cliente para consultar posição na fila.
   - Painel administrativo para gerenciar filas e visualizar métricas.
2. **Backend**:
   - API para registro, listagem, chamada e notificações.
   - Lógica de prioridade e reordenação.
3. **Database**:
   - Relacional: PostgreSQL/MySQL.
   - Estruturas básicas:
     - **Clientes**: ID, nome, prioridade, tipo, status.
     - **Filas**: ID, categoria, clientes em espera.
     - **Histórico**: Data, hora, cliente chamado.

---

## Endpoints

### 1. Endpoints de Cliente
1. **Registrar cliente na fila**
   - **POST** `/api/queue`
   - Body:
     ```json
     {
       "name": "João Silva",
       "category": "Consulta",
       "priority": "Normal",
       "contact": "email@example.com"
     }
     ```
   - Response:
     ```json
     {
       "id": "12345",
       "position": 5
     }
     ```

2. **Consultar posição na fila**
   - **GET** `/api/queue/{id}/position`
   - Response:
     ```json
     {
       "position": 5,
       "estimated_time": "15 minutes"
     }
     ```

3. **Cancelar inscrição na fila**
   - **DELETE** `/api/queue/{id}`

---

### 2. Endpoints Administrativos
1. **Listar todos os clientes na fila**
   - **GET** `/api/queue`
   - Response:
     ```json
     [
       {
         "id": "12345",
         "name": "João Silva",
         "position": 1,
         "priority": "Normal"
       }
     ]
     ```

2. **Chamar próximo cliente**
   - **POST** `/api/queue/next`
   - Response:
     ```json
     {
       "called": {
         "id": "12345",
         "name": "João Silva"
       },
       "position": 1
     }
     ```

3. **Visualizar métricas**
   - **GET** `/api/admin/metrics`
   - Response:
     ```json
     {
       "average_wait_time": "10 minutes",
       "total_attended": 25,
       "categories": {
         "Consulta": 15,
         "Exame": 10
       }
     }
     ```

---

## Estrutura de Dados

### Tabelas Relacionais
1. **Clientes**
   - `id`: ID único.
   - `name`: Nome do cliente.
   - `category`: Tipo de fila.
   - `priority`: Prioridade do cliente.
   - `status`: Em espera, atendido, ou desistente.
2. **Filas**
   - `id`: ID único.
   - `category`: Nome da categoria.
   - `clients`: Lista de IDs de clientes associados.
3. **Histórico**
   - `id`: ID único.
   - `client_id`: ID do cliente atendido.
   - `called_at`: Data e hora da chamada.

---

## Diferenciais (Extras)
- **Notificações Externas**:
  - Integre com serviços como Twilio ou SendGrid para enviar alertas.
- **UX/UI**:
  - Crie uma interface visual intuitiva para gerenciamento.
- **Escalabilidade**:
  - Adicione balanceamento de carga para filas com grande volume de clientes.
- **Automação**:
  - Crie scripts para geração de dados de teste e simulação de filas em tempo real.

---


## Como Disponibilizar no Portfólio

Para adicionar esse projeto ao seu portfólio de maneira atrativa, considere os seguintes pontos:

1. **Publicar no GitHub com um bom README.md**: Suba o código no GitHub com uma descrição completa do projeto, incluindo uma breve introdução, estrutura do banco de dados, principais endpoints e instruções para instalação modo de uso, regras de negócio, explicação das decisões técnicas e etc.

3. **Documentação da API**: Use o Swagger ou Postman para documentar a API, incluindo exemplos de requisições e respostas. Isso facilita a compreensão das funcionalidades e mostra seu cuidado com documentação.

4. **Demonstração com Docker**: Disponibilize uma configuração Docker para facilitar a execução da API. Isso torna o projeto acessível para quem deseja testá-lo rapidamente.

5. **Apresentação Visual**: Crie um README.md organizado e visualmente atrativo, com imagens e diagramas simples (como diagrama ER) para demonstrar o funcionamento e a arquitetura do sistema.

6. **Demo em Produção**: Se possível, hospede o projeto em uma plataforma gratuita como Vercel ou Render, para que recrutadores ou interessados possam testar a API em tempo real.

7. **Explicação Técnica no Portfólio**: Adicione uma seção explicando os desafios enfrentados e soluções implementadas. Destacar problemas específicos resolvidos mostra seu conhecimento técnico.

---


Boa sorte e bom desafio! 🚀
