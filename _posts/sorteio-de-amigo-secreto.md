---
title: "Sorteio de Amigo Secreto: Sem API, Só Hash"
excerpt: "Explorando a simplicidade na criação de projetos, este post mostra a construção de um app de Sorteio de Amigo Secreto com hash e IndexedDB."
coverImage: "/assets/blog/sorteio-de-amigo-secreto/banner.png"
date: "2024-02-15T10:15:00.585Z"
keywords: programação, dev, desenvolvimento, IndexedDB, base64, Next, React, Amigo Secreto
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg?updatedAt=1701730648991"
ogImage:
  url: "/assets/blog/sorteio-de-amigo-secreto/banner.png"
---

No final do ano de 2023 eu topei participar de um Amigo Secreto da minha familia que, como cada um mora distante do outro, foi sorteado online.
A organizadora nos enviou links onde vimos os nomes de quem tiramos.

E algo me chamou muita atenção...

O site pareceu uma aplicação tão simples: Uma plaraforma onde você informa uma lista de nomes que terão pares sorteados e links individuais para exibição dos nomes.

E eis o que me chamou a atenção: **a elegância de uma solução simples.**

Então, decidi recriar a mesma aplicação...


## A ideia

Sempre que penso na construção de uma aplicação, uma das primeiras coisas que penso é: como vou estruturar e armazenar os dados?

E a resposta para a geração desses links é: não vou!

O sorteado não precisa de muito mais do que o nome da pessoa que ele sorteou, certo? Então, é só o que vamos mandar para ele!


E quanto ao dono do sorteio?

Bem... ele talvez precise ver novamente alguma informação daquele Amigo Secreto. Então, podemos persistir de uma forma que só ele veja, assim, não precisando de nenhuma centralização de dados.

## O projeto

A aplicação teria 4 telas
- Inicial: onde o usuário veria a lista de seus sorteios já criados.
- Formulário de Criação do Amigo Secreto.
- Tela de visualização: Onde o usuário veria cada nome atrelado a um botão de "Enviar Link".
- Tela de revelação: onde o sorteado veria o nome da pessoa que sorteou.

Escolhi usar **NextJS** e usar o **IndexedDB** para persistência local.

### 1 - Formulário de Criação

Sim, vamos começar com ele.

Pensei um pouco sobre como seria para adicionar multiplos nomes e fiquei dividido entre um input baseado em *Tags* usando algum separador:
![Input Em Tags](/assets/blog/sorteio-de-amigo-secreto/input-em-tags.png)

E entre multiplos inputs seguidos por um botão de "adicionar outro" como abaixo:
![Multiplos Inputs](/assets/blog/sorteio-de-amigo-secreto/multiplos-inputs.png)

E no fim acabei optando pela segunda opção.

E agora, após o usuário apertar para enviar, a aplicação precisa gerar o sorteio e gerar os hashs para o link.

Então, precisamos de um método que que sorteie e outro que gere os hashs.
Esse foi o resultado:

```typescript
type Pair = {
  name: string;
  hash: string;
}

// Método chamado no onSubmit
const sortPairs = (names: string[]): Pair[] => {
  const _pairs: Pair[] = [];
  const _names = [...names];

  // Reordena aleatoriamente
  _names.sort(() => Math.random() - 0.5);

  
  for (let i = 0; i < _names.length; i++) {
      const name = _names[i].trim();
      
      // Monta o par com a próxima index
      const nextIndex = (i != _names.length - 1) ? i + 1 : 0;
      const pair = _names[nextIndex].trim();
      
      // Chama o método de encriptação
      const hash = encryptNamePair(name, pair);
      _pairs.push({
          name,
          hash
      });
  }

  return _pairs;
};
```

E o `encryptNamePair`, que recebe dois nomes, só precisa concatená-los e converter e **base64**.

O formato antes da conversão ficaria mais ou menos assim: "Nome1-Nome2", para que a gente saiba a quem pertence o link.

```typescript
const encryptNamePair = (n1: string, n2: string) => {
    const namesJoint = `${n1.replace(/ /g, '+').trim()}-${n2.replace(/ /g, '+').trim()}`;
    return btoa(unescape(encodeURIComponent(namesJoint)));
}
```

E quanto a persistência local, decidi usar o **IndexedDB** do próprio navegador.

Pra isso, criei uma classe `IndexedDBManager` para gerenciar as chamadas.
Não vou perder muito tempo explicando, porque é tudo muito padrão aqui.
Mas o código ficou assim:

```typescript
// IndexedDBManager.ts
export class IndexedDBManager {
  // Informações do banco local
  private dbName: string = "RcSecretSantaDB";
  private dbVersion: number = 1;
  private db: IDBDatabase | null = null;
  private readonly tableName: string = "secretSantas";

  constructor() { }

  // Método de conexão
  public async connect (): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error("Erro ao abrir o banco de dados."));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.tableName)) {
          db.createObjectStore(this.tableName, { keyPath: "id" });
        }
      };
    });
  }

  // Método de inserção
  public async addEditItem (item: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connect().then(() => {
        if (!this.db) {
          reject(new Error("Banco de dados não conectado."));
          return;
        }

        const transaction = this.db.transaction([this.tableName], "readwrite");
        const objectStore = transaction.objectStore(this.tableName);

        const request = objectStore.put(item);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error("Erro ao adicionar/editar item no banco de dados."));
        };
      })
    });
  }
}
```

Então, no método `onSumbit` do formulário eu só preciso chamar assim:

```typescript
const dbManager = new IndexedDBManager();
await dbManager.addEditItem({ id: uuidv4(), title, pairs });
```

E pronto. Nossos Amigos Secretos já podem ser salvos!

### 2 - Home - Listagem de Amigos Secretos

Ela só precisa de três coisas:
- Uma lista dos Amigos Secretos 
- Um botão para excluir um item
- Um link para visualizar um item em específico

Para buscar os dados do **IndexedDB** só é necessário o método abaixo:

```typescript
// IndexedDBManager.ts
public async getItems (): Promise<any[]> {
  return new Promise((resolve, reject) => {
    this.connect().then(() => {
      if (!this.db) {
        reject(new Error("Banco de dados não conectado."));
        return;
      }

      const transaction = this.db.transaction([this.tableName], "readonly");
      const objectStore = transaction.objectStore(this.tableName);

      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result || []);
      };

      request.onerror = () => {
        reject(new Error("Erro ao obter itens do banco de dados."));
      };
    });
  });
}
```

E para o caso de o usuário querer excluir:
```typescript
// IndexedDBManager.ts
public async deleteItem (id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    this.connect().then(() => {
      if (!this.db) {
        reject(new Error('Banco de dados não conectado.'));
        return;
      }

      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const objectStore = transaction.objectStore(this.tableName);

      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Erro ao excluir item do banco de dados.'));
      };
    });
  });
}
```


### 3 - Visualização de Amigo Secreto

Essa é a minha favorita.

Ela precisa capturar o dado do `IndexedDB` e apresentar os nomes dos participantes atrelados à um link.

A minha ideia foi criar um botão de compartilhamento onde haveria uma mensagem explicando basicamente o contexto da mensagem e fornecendo o link.

Vamos lá... Primeiramente, precisamos recuperar o item.
A tela recebe a ID gerada pela tela de criação e envia para o método `getItemById` que vai retornar o Objeto de `SecretSanta`.

```typescript
// IndexedDBManager.ts
public async getItemById <T>(id: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    this.connect().then(() => {
      if (!this.db) {
        reject(new Error('Banco de dados não conectado.'));
        return;
      }

      const transaction = this.db.transaction([this.tableName], 'readonly');
      const objectStore = transaction.objectStore(this.tableName);
      const request = objectStore.get(id);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result || null);
      };

      request.onerror = () => {
        reject(new Error('Erro ao obter item do banco de dados.'));
      };
    });
  });
}
```

Depois disso, adicionei a listagem dos nomes e criei um componente `SharedButton` que é bem simples:

```typescript
// ShareButton.tsx
interface IShareButtonProps {
  title: string;
  text: string;
  className?: string;
}

const ShareButton = ({ title, text, className }: IShareButtonProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text
      });
    } else {
      console.error('Web Share API não é suportada neste navegador.');
    }
  };

  return (
    <button className={className} onClick={handleShare}>{title}</button>
  );
};
```

E o adicionei no `[id].tsx` assim:

```typescript

const View = () => {
  const [data, setData] = useState<SecretSanta>();
  const hostLink = window.location.origin;
  // ...

  return (
    <>
      {
        data.pairs.map((pair) => (
          // ....
          <ShareButton
              title="Enviar"
              text={
                `Você foi adicionado ao Amigo Secreto: "${data.title}"!\nE aqui está o seu link:\n${hostLink}}/${pair.hash}`
              }
          />
        ))
      }
    </>
  );
};
```

O que fica mais ou menos assim:

![Mensagem Whatsapp](/assets/blog/sorteio-de-amigo-secreto/message-whatsapp.png)


### 4 - A tela de revelação

Ela é a mais simples de todas.
Como o link contem o hash, só precisamos recuperá-lo, desencriptar e então separar os nomes.

E fazemos isso com o método abaixo:

```typescript
const decryptNamePair = (encodedStr: string) => {
    const decodedString = decodeURIComponent(escape(atob(encodedStr)));
    if (!/(.*)-(.*)/.test(decodedString)) {
        return null;
    }

    return decodedString.replace(/\+/g, " ").split("-");
};

// [hash].tsx
const [name1, name2] = decryptNamePair(hash);
```

Após receber os nomes, tudo o que precisamos é exibi-los na tela de uma forma amigável.
E eu escolhi fazer assim:

![Resultado Amigo Secreto](/assets/blog/sorteio-de-amigo-secreto/resultado.png)


## Conclusão

Esse foi um projeto rápido que me deixou bem satisfeito por tamanha simplicidade.
Projetos assim, me provam que nem tudo precisa ser complexo ou mega elaborado.

> O melhor sistema é o que funciona! Não se esqueça disso!

Depois de completo, eu ainda gastei um tempinho refinando e adicionando tradução, mas acho que não tem muito mais o que mexer nele.

Fique à vontade para olhar usar ou ver o código fonte:

[Acesse - Amigo Secreto](https://secret-santa.racoelho.com.br)

[Código Fonte](https://github.com/rafa-coelho/amigo-secreto)
