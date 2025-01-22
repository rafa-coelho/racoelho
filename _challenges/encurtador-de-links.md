---
id: "m67ygtwtkvpf6"
title: "#8 Encurtador de Links"
keywords: desafios, desafios programação, portfolio, portfolio de programador, programação, ideias de projeto, encurtador de links, URL shortener, Docker, Traefik, redirecionamento de URLs, API RESTful, métricas de acessos, desenvolvimento web, arquitetura escalável, gerenciamento de links
categories: BACKEND
description: Desenvolva um sistema completo de encurtador de links com Docker, Traefik e métricas avançadas. Aprenda a gerenciar redirecionamentos e automatizar o deploy com Docker Compose
level: MEDIUM
link: 
coverImage: "/assets/challenges/encurtador-de-links/banner.png"
ogImage:
    url: "/assets/challenges/encurtador-de-links/banner.png"
date: "2025-01-22T13:44:19.565Z"
---


# #8 Desafio de Programação: Encurtador de Links

## **Descrição**
Desenvolva um sistema completo para encurtar links, utilizando **Docker**, **Traefik** como reverse proxy, e um sistema que **identifique URLs encurtadas automaticamente** com base no domínio e estrutura da URL. O desafio inclui funcionalidades de gerenciamento de links, redirecionamento dinâmico e registro de métricas.

---

## **Objetivo**
1. Criar um sistema que permita encurtar links e gerenciá-los.
2. Permitir que links encurtados sejam redirecionados com base apenas no **short_code** presente na URL.
3. Utilizar **Traefik** como reverse proxy para roteamento dinâmico.
4. Configurar todo o ambiente com **Docker Compose** para facilitar o deploy.

---

## **O que será Aprendido**
1. **Redirecionamento Inteligente:**
   - Processar URLs encurtadas diretamente pelo domínio e path.
2. **APIs Avançadas:**
   - Criar endpoints RESTful para gerenciamento de links.
3. **Docker e Containers:**
   - Orquestrar serviços e ambiente de produção com Docker Compose.
4. **Traefik como Reverse Proxy:**
   - Configurar roteamento dinâmico sem rotas adicionais.
5. **Métricas Avançadas:**
   - Registro de acessos (IP, agente de usuário e data/hora).

---

## **Arquitetura**

### **Diagrama de Arquitetura**
![Fluxo do Encurtador de Links](/assets/challenges/encurtador-de-links/fluxo-encurtador-links.png)

---

## **Especificações Técnicas**

### **Backend**
- **Banco de Dados:** PostgreSQL, MySQL, SQL.
- **Reverse Proxy:** Traefik.
- **Ambiente:** Docker e Docker Compose.
- **Métricas:** Contador de cliques, rastreamento de IPs e agente de usuário.

---

## **Endpoints e Payloads**

### 1. **Criar Link Curto**
- **POST** `/api/shorten`
- **Body:**
  ```json
  {
    "url": "https://exemplo.com/minha-url"
  }
  ```
- **Response:**
  ```json
  {
    "short_url": "https://short.local/abc123",
    "original_url": "https://exemplo.com/minha-url"
  }
  ```

---

### 2. **Redirecionamento**
- O sistema reconhece o formato `https://short.local/{short_code}` automaticamente.
- Ao acessar `https://short.local/abc123`, a requisição é roteada para a API, que:
  1. Busca o `short_code` no banco.
  2. Redireciona o cliente para a URL original com código **`302 Found`**.

---

### 3. **Listar Links Criados**
- **GET** `/api/links`
- **Response:**
  ```json
  [
    {
      "short_url": "https://short.local/abc123",
      "original_url": "https://exemplo.com",
      "clicks": 42
    },
    {
      "short_url": "https://short.local/xyz789",
      "original_url": "https://outra.com",
      "clicks": 15
    }
  ]
  ```

---

### 4. **Excluir Link Curto**
- **DELETE** `/api/links/{short_code}`
- **Response:**
  ```json
  {
    "message": "Link deleted successfully"
  }
  ```

---

## **Resultados Esperados**
1. **Encurtador Funcional:**
   - Gerar links curtos e redirecionar automaticamente sem necessidade de rotas explícitas.
2. **Integração com Traefik:**
   - Roteamento dinâmico baseado em `short_code`.
3. **Métricas Avançadas:**
   - Registro de IPs, agentes de usuário e datas de acesso.
4. **Ambiente Contenerizado:**
   - Docker Compose configurado para fácil deploy.

---

Boa sorte com o desafio! 🚀
