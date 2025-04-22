---
id: "m4hggtpx9ulyr"
title: "#5 Autenticador"
keywords: desafios, desafios programação, portfolio, portfolio de programador, programação, ideias de projeto, autenticação segura, desafio de programação, autenticação IDP, autenticação com JWT, implementação de OAuth 2.0, autenticação backend, autenticação com segurança, sistema de login, provedor de identidade, desenvolvimento backend
categories: Fullstack
description: Desafio de programação para criar um autenticador como Provedor de Identidade (IDP), explorando registro, login, segurança com JWT e fluxo OAuth 2.0.
level: MEDIUM
link: 
coverImage: "/assets/challenges/autenticador/banner.png"
ogImage:
    url: "/assets/challenges/autenticador/banner.png"
date: "2024-12-09T19:58:43.317Z"
tags: ["JWT", "Authentication"]
---


# #5 Desafio de Programação: Autenticador como Provedor de Identidade (IDP)

## Descrição
Este desafio propõe o desenvolvimento de um autenticador simples que atua como um Provedor de Identidade (IDP). O sistema deve permitir que usuários se registrem, façam login e autentiquem-se em serviços externos, redirecionando-os após a autenticação. É ideal para aprender os fundamentos de autenticação, segurança, e protocolos como OAuth 2.0, além de explorar integrações futuras.

---

## Objetivo
Criar um sistema de autenticação que:
1. Permita registro, login e recuperação de senha.
2. Gere tokens JWT para autenticação e acesso a áreas protegidas.
3. Redirecione usuários autenticados para a aplicação cliente que requisitou o login.
4. Implemente um fluxo básico de OAuth 2.0 para serviços externos.

---

## Especificações de Arquitetura

### Frontend
- **Tecnologias:** HTML, CSS e JavaScript (ou frameworks modernos como React, opcional).
- **Páginas principais:**
  1. Registro
  2. Login
  3. Perfil do Usuário (opcional)

### Backend
- **Endpoints:**
  - `/api/auth/register`: Registro de usuários.
  - `/api/auth/login`: Login e geração de JWT.
  - `/api/auth/verify-email`: Verificação de email.
  - `/api/auth/reset-password`: Solicitação de recuperação de senha.
  - `/api/auth/new-password`: Redefinição de senha.
  - `/api/auth/oauth`: Início do fluxo OAuth 2.0.
  - `/api/auth/callback`: Callback para redirecionar usuários autenticados.

### Banco de Dados
- **Tecnologia:** MySQL ou PostgreSQL.
- **Tabelas:**
  1. **Users**:
     - `id` (UUID, Primary Key)
     - `name` (String)
     - `email` (String, único)
     - `password` (Hash)
     - `is_verified` (Boolean)
  2. **Tokens** (opcional):
     - `user_id` (Foreign Key)
     - `token` (JWT)
     - `expires_at` (Timestamp)

### Segurança
- Hash de senhas com `bcrypt`.
- Tokens JWT com expiração curta e suporte a refresh tokens.
- Proteção contra ataques de força bruta com limites de requisições.

---

## Endpoints

### Autenticação
1. **Registrar Usuário**
   - **POST** `/api/auth/register`
   - Body:
     ```json
     {
       "name": "João Silva",
       "email": "joao@example.com",
       "password": "senhaSegura123"
     }
     ```
   - Response:
     ```json
     {
       "message": "Usuário registrado. Verifique seu email para ativar a conta."
     }
     ```

2. **Login**
   - **POST** `/api/auth/login`
   - Body:
     ```json
     {
       "email": "joao@example.com",
       "password": "senhaSegura123"
     }
     ```
   - Response:
     ```json
     {
       "token": "jwt-token",
       "redirect_url": "https://appcliente.com/dashboard"
     }
     ```

3. **Verificar Email**
   - **GET** `/api/auth/verify-email`
   - Query Params:
     - `token=<verification_token>`
   - Response:
     ```json
     {
       "message": "Email verificado com sucesso."
     }
     ```

4. **Recuperar Senha**
   - **POST** `/api/auth/reset-password`
   - Body:
     ```json
     {
       "email": "joao@example.com"
     }
     ```
   - Response:
     ```json
     {
       "message": "Email de recuperação enviado."
     }
     ```

5. **Redefinir Senha**
   - **POST** `/api/auth/new-password`
   - Body:
     ```json
     {
       "token": "reset-token",
       "new_password": "novaSenha123"
     }
     ```
   - Response:
     ```json
     {
       "message": "Senha redefinida com sucesso."
     }
     ```

### OAuth 2.0
1. **Início do Fluxo OAuth**
   - **GET** `/api/auth/oauth`
   - Query Params:
     - `client_id`
     - `redirect_uri`
   - Response:
     Redireciona o usuário para a página de login.

2. **Callback**
   - **GET** `/api/auth/callback`
   - Query Params:
     - `code`
     - `state`
   - Response:
     ```json
     {
       "access_token": "jwt-token",
       "redirect_url": "https://appcliente.com/dashboard"
     }
     ```

---

## Fluxo de Uso

1. **Registro de Usuário:**
   - Usuário preenche um formulário.
   - Recebe um email com um link de ativação.
   - Após ativar, pode realizar login.

2. **Login:**
   - Usuário envia email e senha.
   - Backend retorna JWT e URL de redirecionamento.

3. **OAuth para Aplicações Externas:**
   - Aplicação cliente redireciona o usuário para o IDP.
   - Após autenticação, o usuário é redirecionado de volta para a aplicação com um token.

4. **Recuperação de Senha:**
   - Usuário solicita redefinição informando o email.
   - Recebe link para criar uma nova senha.

---

## O que Será Aprendido

1. **Fundamentos de Autenticação e Segurança:**
   - Hash de senhas com `bcrypt`.
   - Uso de JWTs para autenticação.

2. **Protocolos:**
   - Implementação básica do OAuth 2.0.

3. **Backend Avançado:**
   - Criação de APIs RESTful seguras.
   - Gerenciamento de tokens e sessões.

4. **Integrações:**
   - Envio de emails com provedores externos (SendGrid ou Mailgun).

---

## Publicação

1. **Configuração de Ambiente:**
   - Banco de dados relacional na nuvem (ex.: AWS RDS, Heroku Postgres).
   - Backend em uma plataforma como Heroku, Vercel ou AWS Lambda.

2. **Frontend:**
   - Hospedar as páginas estáticas em serviços como Netlify ou Vercel.

3. **Domínio Customizado (Opcional):**
   - Configurar um domínio próprio para o IDP.

---

## Possibilidades de Expansão

1. **Autenticação Multifator (MFA):**
   - Adicionar autenticação via SMS ou aplicativos como Google Authenticator.

2. **Administração:**
   - Painel para gerenciar usuários e tokens.

3. **Suporte Avançado ao OAuth 2.0:**
   - Permitir que outros sistemas utilizem o IDP para autenticação.

Bom desafio! 🚀
