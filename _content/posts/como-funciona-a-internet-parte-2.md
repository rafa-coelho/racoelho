---
title: "Como funciona a internet (Parte 2): O Protocolo HTTP"
excerpt: "Veja como o HTTP funciona e como os dados são transmitidos pela internet."
coverImage: "/assets/blog/como-funciona-a-internet-parte-2/banner.png"
date: "2024-05-20T12:01:00.220Z"
keywords: programação, dev, desenvolvimento, HTTP, HTTP/2, HTTP/3, protocolo HTTP, QUIC, segurança na internet, desempenho da web, comunicação na web
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg?updatedAt=1701730648991"
ogImage:
  url: "/assets/blog/como-funciona-a-internet-parte-2/banner.png"
tags: ["Internet"]
---

Esse post é a continuação da série "Como funciona a internet" onde vamos começar falando do HTTP: A lingagem da WEB

- [Parte 1: O Modelo TCP/IP: A Fundação da Internet](https://racoelho.com.br/posts/como-funciona-a-internet-parte-1)
- Parte 2: O Protocolo HTTP
- [Parte 3: Segurança na Internet: Protegendo os Dados](https://racoelho.com.br/posts/como-funciona-a-internet-parte-3)
- [Parte 4: DNS e Roteamento](https://racoelho.com.br/posts/como-funciona-a-internet-parte-4)


No [post anterior](https://racoelho.com.br/posts/como-funciona-a-internet-parte-1), falamos do TCP como o protocolo mais seguro e confiável para comunicações via sockets de rede.
E nesse post, falaremos do HTTP que é uma implementação do protocolo TCP.

## O que é o protocolo HTTP

O Protocolo **HTTP** (Hypertext Transfer Protocol) é uma implementação do protocolo TCP para ser usado numa estrutura Server-Client: tendo um servidor que proveria as informações que seriam solicitadas pelo cliente.

Além das propriedades, ele possui uma estrutura de regras de comunicação para que o servidor e o cliente saibam o que está acontecendo e então poder tomar decisões baseadas nisso.

Um exemplo clássico disso é o seu navegador agora:
![Exemplo HTTP](https://racoelho.com.br/assets/blog/como-funciona-a-internet-parte-2/http-example.png)

Ele enviou uma requisição para o servidor que possui esse site e em seguida recebeu uma resposta que continha o HTML dessa página para então renderizá-la.

## O Formato HTTP

Para ser mais simples: lembre-se que o HTTP é um **programa** que é executado para "ouvir" uma porta de rede através do protocolo **TCP**.

Entendido isso, vamos falar sobre o formato.

O que o HTTP espera receber é uma sequência de texto que precisa seguir o padrão abaixo:

![Exemplo HTTP](https://racoelho.com.br/assets/blog/como-funciona-a-internet-parte-2/http-request-raw.png)

- **Método**: O método HTTP serve pra explicar o tipo de ação que vai ser feito. 
- **Caminho**: O caminho é a expecificação de qual recurso você está buscando. Por exemplo, em https://racoelho.com.br/posts, o caminho é: `/posts` .
- **Versão HTTP**: A versão do protocolo HTTP sendo usada para a requisição ou resposta. Hoje em dia, estamos mais familiarizados com o `HTTP/2` com o `HTTPS`, mas nesse post estaremos usando o `HTTP/1.1`.
- **Cabeçalhos**: Os cabeçalhos passam informações adicionais sobre a requisição ou resposta. Eles seguem o formato "Nome: Valor". Alguns exemplos comuns de cabeçalhos incluem "Host", que especifica o domínio alvo da requisição, e "Content-Type", que especifica o tipo de mídia do corpo da mensagem.

E depois da requisição finalizada, o servidor vai reponder no formato abaixo:

![Exemplo HTTP](https://racoelho.com.br/assets/blog/como-funciona-a-internet-parte-2/http-response-raw.png)

Uma resposta HTTP é composta por três partes principais: a linha de status, os cabeçalhos e o corpo da mensagem.

- **Linha de Status**: Esta é a primeira linha de qualquer resposta HTTP e contém três partes: 
  - **A versão do protocolo HTTP**.
  - **Código Status de Resposta:** É um código que vau de 100 à 599 e serve pra informar o client o resultado da requisição.
  - **Mensagem do Status:** A descrição do Status de Resposta.
- **Cabeçalhos**: Os cabeçalhos fornecem informações adicionais sobre a resposta. É a mesma ideia da requisição: Eles seguem o formato "Nome: Valor" e cada cabeçalho é separado por uma nova linha. No exemplo, temos os seguintes cabeçalhos:
   - **Access-Control-Allow-Origin:** é um cabeçalho de CORS, ou Cross Origin Resource Sharing, e define quem pode acessar aquele recurso.
   - **Date:** indica a data e a hora em que a mensagem foi enviada.
   - **Connection:** Indica o status da conecção que foi iniciada.
   - **Content-Type:** Informa qual é o tipo de conteúdo que será retornado no corpo da resposta.
- **Corpo da Mensagem**: Esta é a última parte de uma resposta HTTP e contém os dados reais sendo enviados. No exemplo, o corpo da mensagem é um documento HTML.


## Métodos HTTP

HTTP utiliza diferentes métodos de solicitação para especificar a ação desejada. Aqui estão os métodos mais comuns:

- **GET:** Recupera dados do servidor. Usado para obter páginas web.
- **POST:** Envia dados ao servidor. Comumente usado em formulários.
- **PUT:** Atualiza recursos existentes no servidor.
- **DELETE:** Remove recursos no servidor.

## Códigos de Status

- Informativas  (100 – 199)
- Sucesso  (200 – 299)
- Redirecionamento (300 – 399)
- Erro de Requisição (400 – 499)
- Erro de Servidor (500 – 599)

Para ver uma lista completa, veja esse [artigo.](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status)

## HTTP/2 e HTTP/3
Com o avanço contínuo da web, os protocolos de comunicação também evoluíram para atender às crescentes demandas de desempenho e eficiência. E isso trouxe as melhorias introduzidas pelo HTTP/2 e as inovações do HTTP/3.

### HTTP/2
HTTP/2, lançado em 2015, foi projetado para melhorar significativamente o desempenho da web em comparação com seu predecessor, HTTP/1.1. Aqui estão algumas das principais melhorias introduzidas pelo HTTP/2:

- **Multiplexação:** No HTTP/1.1, cada requisição requer uma nova conexão TCP, o que pode causar lentidão devido à limitação do número de conexões simultâneas. Com HTTP/2, múltiplas requisições podem ser enviadas simultaneamente pela mesma conexão TCP, eliminando o bloqueio de cabeçalho de linha (head-of-line blocking) e melhorando a eficiência.

- **Compressão de Cabeçalhos:** HTTP/2 utiliza um algoritmo chamado **HPACK** para comprimir os cabeçalhos das requisições. Como muitos cabeçalhos HTTP se repetem em várias requisições, a compressão reduz significativamente o tamanho dos dados transmitidos, resultando em menor latência e uso de banda.

- **Prioritização de Requisições:** HTTP/2 permite que os clientes atribuam prioridades às requisições. Isso significa que recursos críticos, como arquivos CSS e JavaScript, podem ser carregados primeiro, melhorando a renderização inicial da página e a experiência do usuário.

- **Server Push:** Com o Server Push, um servidor HTTP/2 pode enviar recursos adicionais ao cliente antes mesmo que ele os solicite. Por exemplo, ao solicitar uma página HTML, o servidor pode enviar automaticamente os arquivos CSS e JavaScript necessários, reduzindo o tempo de carregamento da página.

Essas melhorias afetam positivamente a performance da web, permitindo tempos de carregamento mais rápidos e uma navegação mais suave para os usuários.

### HTTP/3
HTTP/3 é a próxima evolução do protocolo HTTP, introduzindo o uso do protocolo **QUIC** (Quick UDP Internet Connections). 
QUIC foi desenvolvido pelo Google e posteriormente adotado pelo **IETF** (Internet Engineering Task Force) como base para HTTP/3. 
Aqui estão algumas das vantagens de HTTP/3 sobre HTTP/2:

- **Baseado em QUIC:** Diferente de HTTP/2, que utiliza TCP, HTTP/3 é construído sobre o protocolo QUIC, que é baseado em UDP. QUIC foi projetado para fornecer conexões mais rápidas e reduzir a latência, especialmente em redes instáveis ou de alta latência.

- **Redução da Latência de Conexão:** QUIC elimina o processo de handshake de três vias do TCP e combina a negociação de **TLS** em uma única etapa, permitindo que as conexões sejam estabelecidas muito mais rapidamente. Isso é particularmente benéfico em dispositivos móveis e redes com altas latências.

- **Multiplexação Sem Bloqueio:** Como HTTP/2, HTTP/3 suporta multiplexação de múltiplas requisições em uma única conexão. No entanto, devido à natureza de UDP, HTTP/3 evita o bloqueio de cabeçalho de linha a nível de transporte, garantindo que a perda de pacotes em uma requisição não afete outras requisições na mesma conexão.

- **Resiliência a Mudanças de Rede:** QUIC foi projetado para ser resiliente a mudanças de rede, como a transição entre Wi-Fi e redes móveis. Isso é alcançado através da identificação de conexões por IDs de conexão em vez de endereços IP e portas, permitindo que as conexões permaneçam ativas durante a mudança de rede.

### O Uso Atual do HTTP
Hoje em dia, a maioria dos sites utiliza HTTP/2 porque ele traz muitas melhorias em relação ao antigo HTTP/1.1. Essas melhorias, como a capacidade de carregar várias requisições ao mesmo tempo e a compressão de dados, ajudam a tornar os sites mais rápidos. Navegadores e servidores modernos suportam HTTP/2, então muitos desenvolvedores adotaram essa versão sem precisar fazer grandes mudanças no código dos seus sites.

O HTTP/3 é uma novidade que está ganhando espaço rapidamente. Grandes empresas como Google e Facebook já começaram a usar HTTP/3 para tornar a entrega de conteúdo ainda mais rápida e estável. Com o suporte crescente de navegadores e servidores, é provável que HTTP/3 se torne o padrão nos próximos anos, melhorando a velocidade e a estabilidade da internet, especialmente em redes móveis e conexões mais lentas.


## Conclusão

Com a adoção crescente de HTTP/2 e HTTP/3, a internet está se tornando cada vez mais rápida e eficiente, melhorando a experiência dos usuários em todo o mundo. Essas novas versões do protocolo HTTP trazem avanços significativos em termos de performance e estabilidade, especialmente em redes móveis e conexões mais lentas. No entanto, junto com a velocidade e a eficiência, a segurança continua sendo uma preocupação crucial.

À medida que a internet evolui, garantir a segurança dos dados transmitidos se torna mais importante do que nunca. No próximo post da série "Como funciona a internet", vamos explorar "Segurança na Internet: Protegendo os Dados". Vamos mergulhar nas principais práticas e tecnologias usadas para manter suas informações seguras online, incluindo HTTPS, criptografia, autenticação e as melhores práticas para proteger sua privacidade. Descubra como essas medidas de segurança são implementadas e por que elas são essenciais para uma navegação segura na web. Fique ligado para aprender como proteger seus dados na era digital e garantir que suas interações online sejam sempre seguras e protegidas!
