---
id: "m5muey6s9j5wv"
title: "#7 Controle de Assinaturas"
keywords: desafios, desafios programação, portfolio, portfolio de programador, programação, ideias de projeto, portfolio backend
categories: API, Backend
description: Desenvolva uma API para gerenciar assinaturas com mensageria, cobrindo planos, cobrança recorrente e atualizações automáticas com eventos assíncronos
level: MEDIUM
link: 
coverImage: "/assets/challenges/controle-de-assinaturas/banner.png"
ogImage:
    url: "/assets/challenges/controle-de-assinaturas/banner.png"
date: "2025-01-07T19:07:43.636Z"
---


# #6 Desafio de Programação: Controle de Assinaturas

## **Descrição**
Desenvolva uma API para gerenciar assinaturas em um sistema SaaS ou serviço de streaming. A API deve lidar com planos de assinaturas, cobrança recorrente, upgrades/downgrades e gerenciamento do ciclo de vida das assinaturas. O sistema será orientado a eventos, utilizando uma fila de mensagens para processar atualizações de cobrança e assinaturas.

---

## **Objetivo**
1. Criar uma API para gerenciar assinaturas e seus planos.
2. Implementar filas para processar eventos de cobrança e atualizações.
3. Atualizar assinaturas automaticamente com base nos eventos processados.
4. Fornecer métricas básicas sobre assinaturas e planos.

---

## **O que será Aprendido**
1. **Mensageria:**
   - Uso de filas (RabbitMQ ou Kafka) para processamento assíncrono de eventos.
2. **Gerenciamento de Assinaturas:**
   - Criação, atualização e cancelamento de assinaturas.
3. **Arquitetura Orientada a Eventos:**
   - Como estruturar um sistema desacoplado utilizando eventos.
4. **Modelagem de Dados:**
   - Estruturas para planos, assinaturas e eventos de pagamento.

---

## **Arquitetura**

### **Diagrama de Fluxo**

![Fluxo Sistema de Assinatura](/assets/challenges/controle-de-assinaturas/fluxo-sistema-assinatura.png)

---

## **Especificações Técnicas**
### **Backend**
- **Mensageria:** RabbitMQ, Kafka ou Redis Streams.
- **Banco de Dados:** PostgreSQL ou MongoDB.

### **Componentes Adicionais**
- **Worker de Processamento:**
  - Processa eventos da fila, como atualizações de cobrança.
- **Fila de Mensagens:**
  - Armazena eventos para processamento assíncrono.

---

## **Endpoints e Payloads**

### 1. **Gerenciamento de Assinaturas**
#### **Criar Assinatura**
- **POST** `/api/subscriptions`
- **Body:**
  ```json
  {
    "plan_id": "plan_12345",
    "customer_email": "cliente@email.com"
  }
  ```
- **Response:**
  ```json
  {
    "subscription_id": "sub_67890",
    "status": "pending",
    "next_billing_date": "2025-02-01"
  }
  ```

#### **Atualização Automática**
- Após a criação, a assinatura entra na fila como um evento do tipo `subscription_created`.

---

### 2. **Webhooks**
#### **Atualização de Cobrança**
- **POST** `/api/webhooks/payment`
- **Body:**
  ```json
  {
    "subscription_id": "sub_67890",
    "event": "payment_success",
    "amount": 29.99,
    "date": "2025-01-01"
  }
  ```
- **Processo:**
  1. A API coloca o evento na fila de mensagens.
  2. O worker processa o evento e atualiza a assinatura no banco.

---

### 3. **Relatórios**
#### **Obter Métricas de Assinaturas**
- **GET** `/api/reports/subscriptions`
- **Response:**
  ```json
  {
    "total_active": 120,
    "total_cancelled": 15,
    "plans": [
      {
        "plan_id": "plan_12345",
        "name": "Basic Plan",
        "active_subscriptions": 80
      },
      {
        "plan_id": "plan_54321",
        "name": "Premium Plan",
        "active_subscriptions": 40
      }
    ]
  }
  ```

---

## **Processos com Mensageria**

### **1. Processamento de Webhook**
1. O provedor de pagamentos envia um evento de pagamento para o webhook.
2. A API valida o evento e o coloca na fila de mensagens.
3. O worker consome o evento e atualiza o status da assinatura no banco.

### **2. Processamento de Assinatura**
1. Após a criação de uma assinatura, um evento `subscription_created` é colocado na fila.
2. O worker verifica a assinatura e simula o envio para o sistema de cobrança.

---

## **Modelo de Dados**

### **Tabelas**
1. **Plans**
   - `id`: UUID.
   - `name`: Nome do plano.
   - `price`: Preço do plano.
   - `billing_cycle`: Mensal ou anual.

2. **Subscriptions**
   - `id`: UUID.
   - `plan_id`: Relacionamento com a tabela de planos.
   - `customer_email`: Email do cliente.
   - `status`: Pendente, Ativa, Suspensa, Cancelada.
   - `next_billing_date`: Data do próximo pagamento.

3. **Events**
   - `id`: UUID.
   - `type`: subscription_created, payment_success, payment_failed.
   - `data`: Dados do evento (JSON).
   - `processed`: Boolean indicando se o evento já foi processado.

---

## **Resultados Esperados**
1. **API Funcional:** Capaz de gerenciar assinaturas e lidar com planos.
2. **Mensageria:** Processamento assíncrono de eventos utilizando filas.
3. **Automação:** Atualização automática de status com base em eventos.
4. **Relatórios:** Métricas básicas sobre assinaturas e planos.

---

## **Publicação**
1. Configure RabbitMQ, Kafka ou Redis em um ambiente local ou na nuvem.
2. Teste os endpoints com ferramentas como Postman ou Insomnia.
3. Realize o deploy em serviços como Heroku, AWS ou Google Cloud.

---

Boa sorte com o desafio! 🚀
