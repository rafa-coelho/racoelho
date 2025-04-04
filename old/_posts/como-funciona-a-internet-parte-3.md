---
title: "Como funciona a internet (Parte 3): Segurança na Internet: Protegendo os Dados"
excerpt: "Explore a segurança na comunicação web neste terceiro post da série 'Como funciona a internet'. Aprenda sobre as principais ameaças, como interceptação de dados e ataques Man-In-The-Middle, e descubra as medidas de segurança mais eficazes, incluindo HTTPS, certificados digitais e autenticação multifator, para proteger seus dados online."
coverImage: "/assets/blog/como-funciona-a-internet-parte-3/banner.png"
date: "2024-06-24T12:00:00.0Z"
keywords: programação, dev, desenvolvimento, Segurança na Internet, HTTPS, Certificados Digitais, Autenticação Multifator, Firewalls, IDS, Interceptação de Dados, Ataques Man-In-The-Middle, Malware, Proteção de Dados
draft: false
author:
  name: "racoelho"
  picture: "https://github.com/rafa-coelho.png"
ogImage:
  url: "/assets/blog/como-funciona-a-internet-parte-3/banner.png"
---

Esse post é a continuação da série "Como funciona a internet".

- [Parte 1: O Modelo TCP/IP: A Fundação da Internet](https://racoelho.com.br/posts/como-funciona-a-internet-parte-1)
- [Parte 2: O Protocolo HTTP](https://racoelho.com.br/posts/como-funciona-a-internet-parte-2)
- Parte 3: Segurança na Internet: Protegendo os Dados
- [Parte 4: DNS e Roteamento](https://racoelho.com.br/posts/como-funciona-a-internet-parte-4)


## Introdução

No [post anterior](https://racoelho.com.br/posts/como-funciona-a-internet-parte-2) eu falei sobre o protocolo HTTP, suas implementações e da evolução dele para deixar a comunicação da internet mais rápida e eficiente.

Mas no meio de tudo isso, também existem perigos que precisam ser observados. E é sobre isso que vamos falar nesse post.


## Segurança na Comunicação Web

Conhecendo a estrutura de redes e protocolos dentro da internet, existem alguns tipos de vulnerabilidades que precisaram ser cuidadas.
Alguns exemplos:

1. **Interceptação de dados (Eavesdropping)**
   - Quando um invasor intercepta a comunicação entre o usuário e o servidor, capturando dados sensíveis como senhas e informações pessoais.

2. **Ataques "Man-In-The-Middle"**
   - Um invasor se posiciona entre o usuário e o servidor, interceptando e possivelmente alterando a comunicação sem que as partes percebam.

3. **Phisinhg**
   - Técnicas enganosas para obter informações sensíveis, induzindo os usuários a fornecerem dados confidenciais em sites falsos que se passam por legítimos.

4. **Malware e Ransomware**
   - Softwares maliciosos que podem infectar sistemas e redes, roubando ou criptografando dados e exigindo resgate para a liberação das informações.



## Medidas de Segurança
Para mitigar essas ameaças, diversas medidas de segurança são implementadas. Aqui estão algumas das mais importantes:

1. **Criptografia HTTPS**

   - HTTPS (Hypertext Transfer Protocol Secure): HTTPS é a versão segura do HTTP. Ele usa SSL/TLS para criptografar a comunicação entre o navegador do usuário e o servidor. Isso garante que os dados transmitidos não possam ser lidos ou alterados por terceiros.
   
   - SSL/TLS (Secure Sockets Layer / Transport Layer Security): Protocolos de segurança que estabelecem uma conexão criptografada entre o cliente e o servidor. O TLS é a versão mais recente e segura. Durante o handshake inicial, o navegador e o servidor concordam com os parâmetros de segurança que usarão para a conexão, trocam chaves criptográficas e estabelecem uma sessão segura.
  
2. **Certificados Digitais**
   - Certificados SSL/TLS: Emitidos por Autoridades Certificadoras (CAs), os certificados digitais verificam a identidade do servidor. Quando você vê um cadeado ao lado do URL no navegador, significa que o site está usando HTTPS e possui um certificado válido.
   
   - Autoridades Certificadoras (CAs): Entidades confiáveis que emitem certificados digitais após verificar a identidade das partes envolvidas. Exemplos incluem Let's Encrypt, DigiCert e GlobalSign.

3. **Autenticação Multifator (MFA)**
   - O que é MFA?: A autenticação multifator adiciona uma camada extra de segurança, exigindo múltiplas formas de verificação (por exemplo, senha e código enviado por SMS).
  
   - Benefícios: Mesmo que uma senha seja comprometida, a segunda camada de verificação ajuda a prevenir o acesso não autorizado.

4. **Firewall e Sistemas de Detecção de Intrusões (IDS)**
   - Firewalls: Dispositivos ou softwares que monitoram e controlam o tráfego de rede, filtrando tráfego malicioso ou não autorizado. Eles atuam como uma barreira entre redes seguras e não seguras.
   
   - Sistemas de Detecção de Intrusões (IDS): Monitoram a rede para atividades suspeitas e alertam os administradores sobre possíveis invasões. IDS podem ser baseados em assinaturas ou em comportamento, analisando padrões de tráfego para detectar ameaças.

5. **Práticas de Segurança**
   - Senhas Fortes: Use senhas complexas e únicas para cada serviço, e altere-as regularmente.

   - Atualizações e Patches: Mantenha todos os sistemas e softwares atualizados para proteger contra vulnerabilidades conhecidas. Aplicar patches de segurança é crucial para corrigir falhas que poderiam ser exploradas por atacantes.

   - Backup Regular: Realize backups regulares de dados importantes para garantir a recuperação em caso de ataque ou falha do sistema.


##  Conclusão e Próximos Passos

A segurança na comunicação na web é uma responsabilidade compartilhada entre desenvolvedores, administradores de sistemas e usuários. Compreender e implementar as práticas e tecnologias descritas acima é crucial para proteger dados sensíveis e garantir uma navegação segura.

No próximo post da série "Como Funciona a Internet", vamos explorar o Sistema de Nomes de Domínio (DNS) e como ele traduz nomes de domínio em endereços IP, um componente essencial para a funcionalidade da internet. Fique ligado para aprender mais sobre a infraestrutura que mantém a internet funcionando de maneira suave e eficiente.
