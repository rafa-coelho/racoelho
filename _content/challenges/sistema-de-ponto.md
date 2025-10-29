---
id: "m498hml3h32fo"
title: "#4 Sistema de Ponto"
keywords: desafios, desafios programação, portfolio, portfolio de programador, programação, ideias de projeto
categories: Fullstack, API
description: "Desenvolva um Sistema de Ponto completo com foco em backend, permitindo registro de horários, cálculo de horas trabalhadas e geração de relatórios para administradores."
level: MEDIUM
link: 
coverImage: "/assets/challenges/sistema-de-ponto/banner.png"
ogImage:
    url: "/assets/challenges/sistema-de-ponto/banner.png"
date: "2024-12-04T01:53:14.391Z"
tags: ["React", "NodeJS"]
---


# #4 Desafio de Programação: Sistema de Ponto

## Descrição
Desenvolva um **Sistema de Ponto** para empresas, onde funcionários podem registrar seus horários de entrada e saída, e administradores podem acompanhar e gerenciar esses registros. O foco principal é no backend, mas um frontend simples e opcional pode ser criado para demonstrar o funcionamento básico do sistema.

---

## Objetivo
Criar uma API backend para:
1. Gerenciar usuários (funcionários e administradores).
2. Registrar horários de entrada e saída.
3. Calcular horas trabalhadas.
4. Fornecer relatórios e métricas para administradores.

---

## Requisitos Técnicos
### MVP (Minimum Viable Product)
1. API RESTful com endpoints para registro, consulta e relatório de pontos.
2. Banco de dados estruturado para armazenar registros de ponto, usuários e seus papéis.
3. Cálculo de horas trabalhadas por dia, semana ou mês.
4. Controle de autenticação e autorização:
   - Usuários autenticados podem registrar seus pontos.
   - Administradores têm acesso aos relatórios e métricas.

### Extras para Diferencial
1. Integração com notificações (ex.: lembrete para bater ponto).
2. Painel web para gerenciamento.
3. Relatórios exportáveis (CSV ou PDF).
4. Configuração de horas extras e jornadas específicas.

---

## Fluxo de Uso

### Funcionários
1. Fazem login no sistema.
2. Registram horários de entrada e saída.
3. Consultam o histórico de pontos e horas trabalhadas.

### Administradores
1. Fazem login no sistema com privilégios elevados.
2. Visualizam e gerenciam os registros de todos os funcionários.
3. Geram relatórios com base em filtros (por funcionário, data, etc.).
4. Configuram a jornada padrão (ex.: 8h diárias, 44h semanais).

---

## Endpoints

### Autenticação
1. **Registrar usuário**
   - **POST** `/api/users/register`
   - Body:
     ```json
     {
       "name": "Fulano da Silva",
       "email": "joao@example.com",
       "password": "123456",
       "role": "employee"
     }
     ```
   - Response:
     ```json
     {
       "id": "12345",
       "message": "User created successfully"
     }
     ```

2. **Login**
   - **POST** `/api/auth/login`
   - Body:
     ```json
     {
       "email": "joao@example.com",
       "password": "123456"
     }
     ```
   - Response:
     ```json
     {
       "token": "jwt-token",
       "role": "employee"
     }
     ```

### Funcionários
1. **Registrar ponto**
   - **POST** `/api/punch-clock`
   - Headers: `Authorization: Bearer <jwt-token>`
   - Body:
     ```json
     {
       "type": "check-in" // or "check-out"
     }
     ```
   - Response:
     ```json
     {
       "message": "Ponto registrado com sucesso",
       "timestamp": "2024-11-21T08:00:00Z"
     }
     ```

2. **Consultar histórico de pontos**
   - **GET** `/api/punch-clock/history`
   - Headers: `Authorization: Bearer <jwt-token>`
   - Response:
     ```json
     [
       {
         "date": "2024-11-21",
         "check-in": "08:00",
         "check-out": "17:00",
         "hours_worked": 9
       }
     ]
     ```

### Administradores
1. **Listar todos os registros**
   - **GET** `/api/admin/punch-clock`
   - Headers: `Authorization: Bearer <jwt-token>`
   - Query Params:
     - `employeeId` (opcional)
     - `startDate` e `endDate` (opcional)
   - Response:
     ```json
     [
       {
         "employee": "Fulano da Silva",
         "date": "2024-11-21",
         "check-in": "08:00",
         "check-out": "17:00",
         "hours_worked": 9
       }
     ]
     ```

2. **Gerar relatório**
   - **GET** `/api/admin/reports`
   - Headers: `Authorization: Bearer <jwt-token>`
   - Query Params:
     - `startDate`
     - `endDate`
   - Response (CSV ou JSON):
     ```json
     {
       "total_hours": 44,
       "employees": [
         {
           "name": "Fulano da Silva",
           "hours_worked": 44
         },
         {
           "name": "Ciclana Machado",
           "hours_worked": 40
         }
       ]
     }
     ```

---

## Estrutura do Banco de Dados

### Tabelas

1. **Users**
   - `id` (UUID, Primary Key)
   - `name` (String)
   - `email` (String, único)
   - `password` (Hash)
   - `role` (Enum: `employee`, `admin`)

2. **PunchClock**
   - `id` (UUID, Primary Key)
   - `user_id` (Foreign Key para `Users`)
   - `type` (Enum: `check-in`, `check-out`)
   - `timestamp` (DateTime)

3. **Settings**
   - `id` (UUID, Primary Key)
   - `workday_hours` (Decimal, horas padrão por dia)
   - `overtime_rate` (Decimal, taxa de hora extra)

---

## Tecnologias Recomendadas

### Backend
- Sugestões de Linguagem: .NET Core, Java, Node.js (Express) ou Python (Django/Flask).
- Banco de Dados: PostgreSQL ou MySQL.
- Autenticação: JWT (JSON Web Tokens).

### Frontend (Opcional)
- Framework: React.js, Angular ou Vue.js.
- Design: Tailwind CSS ou Ant Design.

### Extras
- Notificações: Twilio ou SendGrid para lembretes.
- Relatórios: Biblioteca como `pdfkit` ou `xlsx`.

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
