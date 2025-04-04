---
id: "m3mwv9x4ief21"
title: "#2 Sistema de Notificações"
keywords: desafios, desafios programação, portfolio, portfolio de programador, programação, ideias de projeto
categories: Backend, Microsserviços
description: 
level: MEDIUM
link: 
coverImage: "/assets/challenges/sistema-de-notificacoes/banner.png"
ogImage:
    url: "/assets/challenges/sistema-de-notificacoes/banner.png"
date: "2024-11-18T10:56:59.896Z"
---

# #2 Desafio de Programação: Sistema de Notificação 🚀

## 📚 Visão Geral
Desenvolva um Sistema de Notificação eficiente e escalável que gerencie o envio de mensagens para usuários através de múltiplos canais (e-mail, SMS, push notifications). 

O sistema deve utilizar filas de mensagens (RabbitMQ ou Kafka) para processamento assíncrono, suportando a priorização de notificações para garantir que as mensagens mais críticas sejam enviadas primeiro.


## 🎓 Aprendizados Esperados

- **Sistemas de Filas:**
  - Compreensão de conceitos de enfileiramento e processamento assíncrono.
  - Configuração e utilização de RabbitMQ ou Kafka.
- **Priorização de Mensagens:**
  - Implementação prática de priorização em sistemas de mensagens.
  - Gerenciamento de múltiplas filas ou tópicos com diferentes prioridades.
- **Integração com Serviços Externos:**
  - Experiência em trabalhar com APIs de terceiros para envio de notificações.
- **Escalabilidade e Resiliência:**
  - Design de sistemas capazes de lidar com altos volumes de dados e garantir alta disponibilidade.
- **Monitoramento e Manutenção:**
  - Implementação de ferramentas de monitoramento e logging para garantir a saúde do sistema.


## 🏗️ Arquitetura do Sistema
### 📦 Componentes Principais

![Desenho da Arquitetura](/assets/challenges/sistema-de-notificacoes/arch-design.png)


## 🎯 Requisitos Funcionais

1. Envio de Notificações
   - **Canais Suportados:**
     - E-mail
     - SMS
     - Push Notifications
   - **Tipos de Notificações:**
     - Alertas (Alta Prioridade)
     - Confirmações (Média Prioridade)
     - Promoções/Newsletters (Baixa Prioridade)
   - **Personalização:**
     - Utilização de templates com placeholders para dados dinâmicos.
2. Gerenciamento de Mensagens
   - **Enfileiramento:**
     - Mensagens devem ser enfileiradas para processamento assíncrono.
   - **Prioridade:**
     - Níveis de prioridade (Alta, Média, Baixa).
     - Processamento das mensagens de acordo com a prioridade. 
3. API de Integração
   - **Endpoints RESTful:**
     - `POST /notifications` – Criação de notificações.
     - `GET /notifications/{id}` – Consulta de status de uma notificação.
   - **Parâmetros da Requisição:**
     - `channel` (e-mail, SMS, push)
     - `recipient` (endereço de e-mail, número de telefone, device token)
     - `message` (conteúdo ou referência ao template)
     - `priority` (alta, média, baixa)
     - `data` (dados adicionais para templates)
   - **Autenticação:**
     - Tokens de API ou JWT.
4. Autenticação e Segurança
   - **Controle de Acesso:**
     - Apenas clientes autenticados podem utilizar a API.
   - **Validação de Dados:**
     - Verificação de campos obrigatórios e formatos (e-mail, telefone).
   - **Criptografia:**
     - Comunicação via HTTPS.
     - Criptografia de dados sensíveis em repouso.
5. Reenvio Automático e Dead Letter Queue
   - **Reintentos Automáticos:**
     - Número configurável de tentativas em caso de falha.
     - Intervalo ajustável entre tentativas.
   - **Dead Letter Queue:**
     - Armazenamento de mensagens que falharam após todas as tentativas.
6. Registro e Monitoramento
   - **Logs de Atividade:**
     - Registro de todas as notificações enviadas, status e erros.
   - **Monitoramento Básico:**
     - Logs acessíveis para análise e troubleshooting.

## 🔧 Detalhes Técnicos
1. API Gateway
   - **Responsabilidades:**
     - Receber e autenticar requisições dos clientes.
     - Validar os dados recebidos.
     - Enviar mensagens para o sistema de filas com a prioridade adequada.
   - **Endpoints Principais:**
     - `POST /notifications`
     - `GET /notifications/{id}`
2. Sistema de Filas (RabbitMQ/Kafka)
   - **RabbitMQ:**
     - **Exchanges e Filas:**
       - Configuração de exchanges diretas ou de tópicos para roteamento.
       - Filas configuradas com suporte a prioridade (x-max-priority).
     - **Priorização:**
       - Mensagens enviadas com atributo priority (1-10).
   - **Kafka:**
     - Tópicos:
       - Tópicos separados para cada nível de prioridade (e.g., `high`, `medium`, `low`).
     - Consumo:
       - Workers configurados para consumir tópicos em ordem de prioridade.
3. Workers Consumidores
   - **Funções:**
     - Consumir mensagens das filas.
     - Enviar notificações através dos canais apropriados.
     - Gerenciar reintentos e mover mensagens para Dead Letter Queue em caso de falha.
   - **Escalabilidade:**
     - Implementar múltiplas instâncias de workers para lidar com alta demanda.
4. Serviços de Notificação Externos
   - **E-mail:** Integrar com SendGrid, Mailgun ou Amazon SES via APIs.
   - **SMS:** Utilizar Twilio ou Nexmo para envio de mensagens de texto.
   - **Push Notifications:** Integrar com Firebase Cloud Messaging ou Apple Push Notification Service.
5. Banco de Dados
   - **Finalidades:**
     - Armazenar logs de notificações enviadas.
     - Registrar o status, tentativas e erros das notificações.
     - Armazenar templates de mensagens e configurações.
6. Registro e Monitoramento
   - **Logs de Atividade:**
     - Implementar logging interno para registrar todas as operações.
     -  Utilizar bibliotecas como Winston (Node.js) ou Logging (Python) para gerenciamento de logs.
   - **Monitoramento Básico:**
     - Monitorar logs para identificar falhas e comportamentos anômalos.

## 📈 Fluxos de Trabalho
1. **Envio de Notificação**
    1. **Cliente** envia uma requisição `POST /notifications` com os detalhes da notificação.
    2. **API Gateway** autentica e valida a requisição.
    3. **Mensagem** é enfileirada no sistema de filas com a prioridade especificada.
    4. **Workers** consomem a mensagem e enviam a notificação através do canal adequado.
    5. **Status** da notificação é atualizado no banco de dados.
    6. **Logs** são registrados para monitoramento e auditoria.
2. **Reenvio Automático**
    1. **Falha** no envio da notificação.
    2. **Worker** reenvia a mensagem conforme a política de reintento.
    3. **Após exceder tentativas**, a mensagem é movida para a Dead Letter Queue.
    4. **Administradores** podem revisar e reprocessar mensagens na Dead Letter Queue.
3. **Consulta de Status**
    1. **Cliente** realiza uma requisição `GET /notifications/{id}`.
    2. **API Gateway** busca o status da notificação no banco de dados.
    3. **Resposta** com o status atual (enviado, pendente, falhado).

## 📋 Regras de Negócio

- **Prioridade de Mensagens:**
  - **Alta:** Alertas críticos (e.g., falhas de segurança) – devem ser processados imediatamente.
  - **Média:** Confirmações e atualizações de status – processadas após alta prioridade.
  - **Baixa:** Promoções e newsletters – processadas quando não há mensagens de alta ou média prioridade.
- **Tentativas:**
  - **Configuração:**
    - Máximo de 3 tentativas.
    - Intervalo de 5 minutos entre tentativas.
  - **Dead Letter Queue:**
    - Mensagens que falham após todas as tentativas são armazenadas para análise.
  - **Autenticação e Segurança:**
    - Uso de HTTPS para todas as comunicações.
    - Autenticação via JWT ou chaves de API.
    - Limitação de taxa (Rate Limiting) para prevenir abusos.
- **Validação de Dados:**
  - Formatos corretos para e-mail, número de telefone e tokens de push.
  - Campos obrigatórios devem ser preenchidos.

## 🌟 Funcionalidades Adicionais (Expansão Futuramente)
- **Autenticação Multifator (MFA):**
  - Adicionar um segundo fator de autenticação para clientes que acessam a API.
- **Interface de Administração:**
  - Dashboard para gerenciar notificações, visualizar logs e monitorar desempenho.
- **Análise de Dados:**
  - Relatórios sobre taxas de entrega, abertura de e-mails, cliques em links, etc.
- **Suporte a Novos Canais:**
  - Adicionar suporte a WhatsApp, Telegram ou notificações in-app.
- **Escalabilidade Avançada:**
  - Implementar Kubernetes para orquestração de containers e escalabilidade automática.

### 🏁 Como Participar do Desafio

- **Planejamento:**
  - Revise os requisitos e entenda o fluxo do sistema.
  - Escolha as tecnologias que você está mais confortável ou deseja aprender.
- **Implementação:**
  - Configure o ambiente de desenvolvimento.
  - Desenvolva a API e integre com o sistema de filas escolhido.
  - Implemente os workers para processar e enviar notificações.
- **Testes:**
  - Teste cada canal de notificação.
  - Verifique a priorização e o reenvio automático de mensagens.
  - Assegure-se de que a segurança e a autenticação estão funcionando corretamente.
- **Documentação:**
  - Documente o código e crie um README detalhado.
  - Inclua instruções de configuração e execução do sistema.
- **Compartilhe:**
  - Publique seu projeto no GitHub.
  - Compartilhe no Instagram ou outras redes sociais utilizando a hashtag do desafio.

## 🏆 Pronto para o Desafio?

Boa sorte e mãos à obra! 🚀
