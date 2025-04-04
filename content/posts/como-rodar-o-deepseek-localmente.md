---
title: "Como rodar o DeepSeek Localmente"
excerpt: "Guia completo para instalar, rodar e integrar o DeepSeek na sua máquina usando o Ollama."
coverImage: "/assets/blog/como-rodar-o-deepseek-localmente/banner.png"
date: "2025-01-31T18:50:09.713Z"
keywords: programação, dev, desenvolvimento, DeepSeek, IA, Ollama, API
author:
  name: "racoelho"
  picture: "https://github.com/rafa-coelho.png"
ogImage:
  url: "/assets/blog/como-rodar-o-deepseek-localmente/banner.png"
---

Além de ser de graça e tão bom quanto o GPT, o **DeepSeek** ainda é OpenSource e pode ser usado localmente.
Ou seja, você pode ter uma versão rodando na sua máquina!

E é isso que vou te ensinar a fazer.

## Bora lá:


Nós estamos usando ele através do **Ollama**, uma ferramenta que facilita a execução de LLMs sem complicações.

Então, você vai precisar instalar ele também.

## 1. Instalando o Ollama


### Linux e macOS

Para instalar no **Linux** ou **macOS**, basta rodar o seguinte comando no terminal:

```sh
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows

No Windows, você vai precisar baixar o instalador lá no site oficial:

- Acesse: [https://ollama.com](https://ollama.com)
- Baixe e instale o programa como qualquer outro software

Depois da instalação, verifique se o Ollama foi instalado corretamente rodando:

```sh
ollama --version
```

Se o comando retornar a versão instalada, significa que tudo está funcionando.

## 2. Baixando o modelo DeepSeek

Com o Ollama instalado, agora podemos baixar o modelo **DeepSeek**. O Ollama gerencia os modelos como imagens de contêiner, então basta puxá-lo com o comando:

```sh
ollama pull deepseek-r1
```

Se precisar de um modelo maior e mais potente, pode baixar a versão **7B**: que usa 7 bilhões de parâmetros.

```sh
ollama pull deepseek-r1:7b
```

## 3. Executando o DeepSeek localmente

Após baixar o modelo, podemos executá-lo diretamente no terminal para testar seu funcionamento. Para rodar a versão padrão:

```sh
ollama run deepseek-r1
```

Caso tenha baixado a versão maior, utilize:

```sh
ollama run deepseek-r1:7b
```

Isso abrirá uma interface onde você pode começar a interagir com o modelo.

## 4. Como utilizar a API do DeepSeek

O Ollama expõe uma API local que pode ser utilizada para enviar prompts e obter respostas programaticamente.

### 4.1. Iniciando o servidor da API

Para que a API fique disponível, basta iniciar o servidor:

```sh
ollama serve
```

Isso fará com que a API seja exposta na porta **11434** (padrão do Ollama).

### 4.2. Fazendo uma requisição para a API

A API do Ollama aceita requisições HTTP no endpoint `/api/generate`. Podemos testar com **cURL**:

```sh
curl http://localhost:11434/api/generate -d '{
  "model": "deepseek",
  "prompt": "Explique o conceito de programação assíncrona",
  "stream": false
}'
```

Ou em Python:

```python
import requests

url = "http://localhost:11434/api/generate"
data = {
    "model": "deepseek",
    "prompt": "O que é um banco de dados relacional?",
    "stream": False
}

response = requests.post(url, json=data)
print(response.json()["response"])
```

## 5. Ajustando o modelo para diferentes usos

A API do Ollama permite passar parâmetros adicionais:

- **Temperatura (`temperature`)**: Define a criatividade das respostas (valores menores tornam as respostas mais previsíveis, valores maiores aumentam a aleatoriedade).
- **Número máximo de tokens (`max_tokens`)**: Controla o tamanho da resposta gerada.
- **Uso de streaming (`stream`)**: Se ativado, a resposta será transmitida conforme gerada.

Exemplo de requisição com parâmetros ajustados:

```json
{
  "model": "deepseek",
  "prompt": "Como funciona o sistema de permissões no Linux?",
  "temperature": 0.7,
  "max_tokens": 150,
  "stream": false
}
```

Isso permite refinar a resposta do modelo de acordo com a necessidade da aplicação.

## 6. Recursos necessários para rodar o DeepSeek

Rodar modelos grandes localmente exige um hardware compatível. Aqui estão algumas recomendações:

- **DeepSeek padrão**: Pode rodar bem em CPUs modernas, mas desempenho melhora com GPU.
- **DeepSeek 7B**: Recomendado pelo menos **16GB de RAM** e uma GPU com suporte a CUDA (NVIDIA) ou Metal (Mac).
- **Armazenamento**: Modelos grandes ocupam bastante espaço em disco. Certifique-se de ter pelo menos **10GB livres**.

Se seu hardware não for suficiente, pode ser interessante rodar o modelo em uma máquina virtual ou servidor na nuvem com suporte a GPUs.

## Conclusão

O DeepSeek é uma alternativa robusta para rodar IA localmente sem depender de serviços pagos ou conexão com a internet. Com o **Ollama**, o processo de instalação e execução é bastante simplificado, permitindo interagir diretamente pelo terminal ou integrar a API em aplicações.

Se você trabalha com NLP, chatbots ou precisa de geração de texto automática, vale a pena testar o DeepSeek e explorar seu potencial.
