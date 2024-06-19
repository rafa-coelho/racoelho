---
title: "Como funciona a internet (Parte 4): DNS e Roteamento: Os Nomes da Internet"
excerpt: "Lorem ipsum."
coverImage: "/assets/blog/como-funciona-a-internet-parte-3/banner.png"
date: "2024-06-08T04:06:17.532Z"
keywords: programação, dev, desenvolvimento, 
draft: true
author:
  name: "racoelho"
  picture: "https://github.com/rafa-coelho.png"
ogImage:
  url: "/assets/blog/como-funciona-a-internet-parte-3/banner.png"
---


Esse post é a continuação da série "Como funciona a internet" onde vamos começar falando do HTTP: A lingagem da WEB

- [Parte 1: O Modelo TCP/IP: A Fundação da Internet](https://racoelho.com.br/posts/como-funciona-a-internet-parte-1)
- [Parte 2: O Protocolo HTTP](https://racoelho.com.br/posts/como-funciona-a-internet-parte-2)
- [Parte 3: Segurança na Internet: Protegendo os Dados](https://racoelho.com.br/posts/como-funciona-a-internet-parte-3)
- Parte 4: DNS e Roteamento: Os Nomes da Internet




# Introdução
No primeiro e segundo posts da série "Como Funciona a Internet", exploramos o modelo TCP/IP e o protocolo HTTP, ambos essenciais para a comunicação na web. Agora, vamos mergulhar em outro componente crucial da internet: o Sistema de Nomes de Domínio (DNS) e o roteamento de pacotes. Esses elementos são responsáveis por traduzir nomes de domínio amigáveis em endereços IP e garantir que os dados sejam enviados corretamente através da rede global.

Compreender o DNS e o roteamento é fundamental para qualquer pessoa interessada em desenvolver aplicações web ou simplesmente entender melhor como a internet funciona. Neste post, vamos detalhar como esses sistemas operam e como eles tornam a navegação na web rápida e eficiente.

O que é DNS?
Definição do Sistema de Nomes de Domínio (DNS)
O Sistema de Nomes de Domínio (DNS) é como a "agenda telefônica" da internet. Ele traduz nomes de domínio fáceis de lembrar, como www.exemplo.com, em endereços IP, que são usados pelos computadores para se comunicar uns com os outros. Sem o DNS, teríamos que memorizar longas sequências de números para acessar sites na internet.

Necessidade de Tradução de Nomes de Domínio em Endereços IP
Os computadores e outros dispositivos na internet se comunicam usando endereços IP, que são sequências de números como 192.168.1.1. No entanto, para os seres humanos, lembrar e digitar esses números seria impraticável. O DNS resolve esse problema, permitindo que usemos nomes de domínio amigáveis, enquanto cuida da tradução para os endereços IP correspondentes.

Como o DNS Funciona?
Consulta DNS
Quando você digita um URL no seu navegador, ele faz uma consulta DNS para descobrir o endereço IP associado ao nome de domínio. Este processo envolve várias etapas e servidores diferentes para resolver o nome de domínio em um endereço IP utilizável.

Componentes do DNS
Servidor Recursivo:

O servidor recursivo recebe a consulta do navegador e a encaminha para outros servidores DNS para encontrar o endereço IP correspondente.
Servidor Raiz:

O servidor raiz é o primeiro ponto de contato para a consulta. Ele não conhece o endereço IP exato, mas sabe a quem encaminhar a consulta: os servidores de domínio de nível superior (TLD).
Servidor TLD (Domínio de Nível Superior):

Os servidores TLD gerenciam domínios de topo como .com, .org, e .net. Eles direcionam a consulta para o servidor autorizativo correto.
Servidor Autorizativo:

O servidor autorizativo contém as informações definitivas para o domínio, incluindo o endereço IP associado.
Fluxo de uma Consulta DNS
O Navegador Inicia a Consulta:

Quando você digita www.exemplo.com, o navegador envia uma consulta DNS ao servidor recursivo configurado (geralmente o servidor DNS do seu provedor de internet).
Servidor Recursivo Encaminha a Consulta:

O servidor recursivo verifica se já tem a resposta em seu cache. Se não, ele encaminha a consulta ao servidor raiz.
Servidor Raiz Direciona para o Servidor TLD:

O servidor raiz direciona a consulta para o servidor TLD apropriado, como o servidor .com.
Servidor TLD Direciona para o Servidor Autorizativo:

O servidor TLD direciona a consulta para o servidor autorizativo do domínio específico.
Servidor Autorizativo Retorna o Endereço IP:

O servidor autorizativo responde ao servidor recursivo com o endereço IP do domínio.
Resposta ao Navegador:

O servidor recursivo envia o endereço IP de volta ao navegador, que pode então fazer a solicitação HTTP ao servidor web.
Exemplo Prático de Consulta DNS
Para ilustrar, vamos considerar uma consulta DNS típica:

Você digita www.exemplo.com no navegador.
O navegador consulta o servidor DNS recursivo.
O servidor recursivo encaminha a consulta para o servidor raiz.
O servidor raiz redireciona a consulta para o servidor TLD .com.
O servidor TLD .com redireciona a consulta para o servidor autorizativo de exemplo.com.
O servidor autorizativo responde com o endereço IP.
O servidor recursivo retorna o endereço IP ao navegador.
O navegador usa o endereço IP para fazer uma solicitação HTTP ao servidor web.
Cache de DNS
O que é Cache de DNS?
O cache de DNS é um mecanismo que armazena temporariamente as respostas às consultas DNS. Isso ajuda a reduzir o tempo de resposta e o tráfego de rede, pois evita a necessidade de resolver novamente os nomes de domínio que já foram consultados recentemente.

Importância do Cache de DNS
O cache de DNS melhora a eficiência e a velocidade da navegação na web. Quando um endereço IP é armazenado no cache, as consultas subsequentes para o mesmo domínio podem ser respondidas rapidamente sem a necessidade de passar por todo o processo de resolução DNS.

Exemplos de Cache de DNS
Cache no Navegador:

O navegador armazena os resultados das consultas DNS para acelerar o carregamento de páginas já visitadas.
Cache no Sistema Operacional:

O sistema operacional mantém um cache de DNS para todas as aplicações que requerem resolução de nomes de domínio.
Cache no Servidor Recursivo:

Os servidores DNS recursivos mantêm um cache grande e abrangente, acelerando a resolução de nomes de domínio para muitos usuários.
Problemas Comuns e Soluções de DNS
Problema: DNS Propagation Delay
Explicação:
O DNS Propagation Delay é o tempo que leva para que as mudanças no DNS se propaguem por toda a internet. Isso pode resultar em períodos em que diferentes usuários obtêm respostas diferentes para a mesma consulta DNS.

Soluções:

Planeje as mudanças de DNS com antecedência.
Utilize serviços de DNS com atualizações rápidas e eficientes.
Monitore a propagação usando ferramentas especializadas.
Problema: DNS Spoofing e Segurança
Explicação:
O DNS Spoofing é um ataque onde informações DNS falsas são introduzidas no cache de um resolvedor de DNS, redirecionando os usuários para sites maliciosos sem o seu conhecimento.

Soluções:

DNSSEC (DNS Security Extensions): Um conjunto de extensões de segurança que adicionam assinaturas criptográficas às respostas DNS para garantir sua autenticidade.
Servidores DNS Seguros: Utilize servidores DNS confiáveis e com boas práticas de segurança.
Problema: DNS Failure
Explicação:
Falhas no DNS podem ocorrer devido a problemas de configuração, falhas de hardware, ou ataques DDoS (Distributed Denial of Service).

Soluções:

Configure redundância com múltiplos servidores DNS.
Implemente failover automático para servidores de backup.
Monitore continuamente a saúde dos seus servidores DNS.
