---
title: "Magia dos Triggers: Automatizando Tarefas com C# (Baseado em GitHub Actions)"
excerpt: "Explore a automação de tarefas com C# neste guia prático. Descubra como usar triggers e scripts para automatizar backups e uploads de arquivos e deixar sua rotina mais eficiente."
coverImage: "/assets/blog/magia-dos-triggers-automatizando-tarefas-com-c-sharp/banner.png"
date: "2024-05-08T03:41:18.662Z"
keywords: programação, dev, desenvolvimento, GitHub Actions, automação com C#, triggers em desenvolvimento, automação de tarefas, scripts de automação, programação C#, desenvolvimento de software, eficiência em TI, integração contínua
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg?updatedAt=1701730648991"
ogImage:
  url: "/assets/blog/magia-dos-triggers-automatizando-tarefas-com-c-sharp/banner.png"
tags: ["C#", "SQL Server"]
---
## A Ideia

Um dia desses eu estava criando um processo de deploy com **Github Actions** e me lembrei de um sistema de ITSM que trabalhei que permitia a execução de arquivos de scripts baseado em **triggers** do sistema.

E seguindo essa lógica de alteração em sistemas de arquivo que o Github Actions tem, comecei a pensar em algumas possibilidades:

- Automatizar backups em horários específicos.
- Realizar upload automáticos de arquivos em determinada pasta
- Limpeza Automática de Disco
- Etc.

Então, abri meu Visual Studio e comecei a criação desse um mini projeto: O **JobExecutor** _(criativo, né?)_

A ideia, na verdade é bem simples: teria um arquivo onde nós armazenariamos as triggers ligadas ao script a ser executado.

Por enquanto, como é apenas uma prova de conceito, decidi usar somente dois tipos de trigger:
- **CronExpression:** Que é uma forma de você informar periodicidades e é definido por uma string que tem esse formato: `* * * * *`
- **FileWatcher:** Para que seja executado assim que algum arquivo ou pasta sejam alterados.


Para armazenar esses dados, escolhi o JSON e ficou nesse formato aqui:

```json
{
  "triggers": [
    {
      
      "type": "FileWatcher",
      "scriptFileName": "PATH\\TO\\FILE.ps1",
      "watchedPath": "PATH\\TO\\WATCHED\\FILES"
    },
    {
      "type": "CronExpression",
      "scriptFileName": "PATH\\TO\\FILE.ps1",
      "CronExpression": "0 2 * * *" // Vai rodar todos os dias às 2hrs da manhã
    }
  ]
}
```

Se você é atento, percebeu que nos dois `scriptFileName` eu estou colocando arquivos `ps1` que são arquivos de código Poweshell. 
Isso é porque pretendo enviar parâmetros para que o usuário possa ter mais detalhes sobre a ação e tomar decisões sobre elas e os scrips de Powershell são completos e simples de se usar.

## As estruturas de código

Para esse projeto estou usando **C#**, e como ele é fortemente tipado, encontrar estruturas diferentes dentro do mesmo array seria um problema para ele.
E como não podemos também esperar que o usuário coloque todos os parâmetros que ele não vai precisar, não podemos simplesmente converter de JSON pra objeto diretamente.

Então, criei quatro classes:


A primeira tem a inteção de ser a classe "pai", contendo o que todas terão:
```csharp 
public class Trigger
{
    public string ScriptFileName { get; set; }
    public string Type { get; set; }
}
```


A **CronJobTrigger** é uma implementação da **Trigger.cs** e vai adicionar somente o `CronExpression`:
```csharp 
public class CronJobTrigger : Trigger
{
    public string CronExpression { get; set; }
}
```

A **FileWatcherJobTrigger** será também uma implementação da **Trigger.cs**, e vai ter o caminho que vai ser vigiado.
```csharp 
public class FileWatcherJobTrigger : Trigger
{
    public string WatchedPath { get; set; }
}
```

E por fim, a que vai representar o **JSON** como um todo:
```csharp
public class TriggerConfig
{
    public Trigger[] Triggers { get; set; }
}
```

## Convertendo os diferente tipos de Trigger

Como o FileWatcher e o CronExpression tem parâmetros diferentes, não posso simplemente convertê-los diretamente, já que o conversor vai usar só o tipo `Trigger` e ignorar os outros campos.

Então precisei criar um conversor.

> Estamos usando o conversor do [Newtonsoft](https://www.newtonsoft.com/json)

```csharp
// TriggerConverter.cs
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace JobExecutor.Structs;

public class TriggerConverter : CustomCreationConverter<Trigger>
{
    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        var jsonObject = JObject.Load(reader);
        Trigger trigger;

        if (jsonObject["CronExpression"] != null)
        {
            trigger = new CronJobTrigger();
        }
        else if (jsonObject["WatchedPath"] != null)
        {
            trigger = new FileWatcherJobTrigger();
        }
        else
        {
            throw new JsonSerializationException("Unknown trigger type");
        }

        serializer.Populate(jsonObject.CreateReader(), trigger);
        return trigger;
    }
}
```

Aqui, quando o conversor for passar de item por item ele vai verificar se o campo `CronExpression` está preenchido, e caso sim, vai definir o registro como do tipo `CronJobTrigger`.

O mesmo se aplica para o `FileWatcherJobTrigger` e o campo `WatchedPath`.

Caso nenhum dos dois seja verdade, dispara uma Exception.


## O Programa

Pra começar, precisamos capturar o arquivo de triggers e ler o conteúdo dele:

```csharp
class Program
{
    private static List<Trigger> triggers;
    private static string configPath = "PATH\\TO\\triggers.json";

    static void Main(string[] args)
    {
        LoadTriggers();
        Console.ReadLine();
    }

    private static void LoadTriggers()
    {
        triggers = ReadTriggerConfig().Triggers.ToList();
    }

    private static TriggerConfig ReadTriggerConfig()
    {

        var settings = new JsonSerializerSettings
        {
            // Adicionamos o nosso conversor aqui
            Converters = new List<JsonConverter> { new TriggerConverter() }
        };

        // Aqui, lemos o arquivo com um stream
        using var stream = new StreamReader(configPath);
        var json = stream.ReadToEnd();
        
        return JsonConvert.DeserializeObject<TriggerConfig>(json, settings);
    }
}
```

Com as triggers armazenadas na propriedade `triggers`, podemos criar o método que vai processar as triggers e executá-las.


```csharp
private static void InitializeTriggers()
{
    foreach (var trigger in triggers)
    {
        switch (trigger.Type)
        {
            case "CronExpression":
                SetupCronJob(trigger as CronJobTrigger);
                break;
            case "FileWatcher":
                SetupFileWatcher(trigger as FileWatcherJobTrigger);
                break;
            default:
                throw new NotImplementedException($"Trigger type {trigger.Type} is not implemented.");
        }
    }
}
```

Depois disso, vamos implementar o `SetupCronJob`.

## Criando o Setup do CronExpression

A expressão Cron é umna string que funciona assim:

Com 5 caracteres:
```
* * * * *
- - - - -
| | | | |
| | | | +----- Dia da Semana(0 - 6)
| | | +------- Mês (1 - 12)
| | +--------- Dia do Mês (1 - 31)
| +----------- Hora (0 - 23)
+------------- Minuto (0 - 59)
```

Com 6 Catacteres
```
* * * * * *
- - - - - -
| | | | | |
| | | | | +--- Dia da Semana (0 - 6) 
| | | | +----- Mês (1 - 12)
| | | +------- Dia do Mês (1 - 31)
| | +--------- Hora (0 - 23)
| +----------- Minuto (0 - 59)
+------------- Segundo (0 - 59)
```

Com ele você pode dizer "qualquer valor" com um `*`, usar uma `,` pra definir vários valores ou até um range de valores com um `-`.
Exemplos:

```yml
- "0 12 * * *" # Todos os dias às 12:00
- "5 0 * 8 *" # Às 00:05, todos os dias de Agosto
- "15 14 1 * *" # Todo dia 1º às 14:15
- "*/5 * * * * *" # À cada 5 segundos
```

Sabendo disso, precisamos converter isso em um agendamento no nosso código.
Pra isso, vamos usar a lib [NCrontab](https://www.nuget.org/packages/ncrontab/), 

Vamos usar o método `Parse` do `CrontabSchedule` e em seguida armazenar a próxima execução.
Vai ficar assim:
```csharp
var schedule = CrontabSchedule.Parse(trigger.CronExpression, new CrontabSchedule.ParseOptions() { IncludingSeconds = true });
var nextRun = schedule.GetNextOccurrence(DateTime.Now);
```

E depois, vamos criar um [`System.Threading.Timer` ](https://learn.microsoft.com/en-us/dotnet/api/system.threading.timer?view=net-8.0) para agendar a execução do método que irá rodar o script e então reagendar o job novamente.

O método completo fica assim:

```csharp
private static void SetupCronJob(CronJobTrigger trigger)
{
    var schedule = CrontabSchedule.Parse(trigger.CronExpression, new CrontabSchedule.ParseOptions() { IncludingSeconds = true });
    var nextRun = schedule.GetNextOccurrence(DateTime.Now);
    var timer = new Timer(
        (e) => {
            // Executa o arquivo
            ExecuteScript(trigger);

            // Reagenda o job
            SetupCronJob(trigger);
        }, 
        null,
        (long)(nextRun - DateTime.Now).TotalMilliseconds,
        Timeout.Infinite);
 }
```

## Criando o Setup do FileWatcher

Para verificar as alterações no caminho indicado, nós vamos usar o [`FileSystemWatcher`](https://learn.microsoft.com/pt-br/dotnet/api/system.io.filesystemwatcher?view=net-8.0).

```csharp
var watcher = new FileSystemWatcher
{
    Path = trigger.WatchedPath, // Caminho do arquivo pego na trigger
    Filter = "*", // Monitoraremos todos os arquivos
    IncludeSubdirectories = true, // Incluiremos o monitoramento de subdiretórios
    EnableRaisingEvents = true, // Permitiremos a execução de eventos
};

// Define os eventos que devem ser notificados
watcher.NotifyFilter = NotifyFilters.LastWrite
        | NotifyFilters.FileName
        | NotifyFilters.DirectoryName
        | NotifyFilters.Attributes;

```
Agora, vamos criar o método que vai executar o script e adicioná-lo aos métodos `watcher.Changed`, `watcher.Created`, `watcher.Deleted` e `watcher.Renamed` do Watcher.

> O Evento de edição pode (e vai) disparar mais de um evento `Changed` então, vamos criar um cache para isso.

```csharp
private static Dictionary<string, DateTime> scriptExecutionCache = new Dictionary<string, DateTime>();


private static void SetupFileWatcher(FileWatcherJobTrigger trigger)
{
    var watcher = new FileSystemWatcher
    {
        Path = trigger.WatchedPath,
        Filter = "*",
        IncludeSubdirectories = true, // Incluiremos o monitoramento de subdiretórios
        EnableRaisingEvents = true, // Permitiremos a execução de eventos
    };

    watcher.NotifyFilter = NotifyFilters.LastWrite
            | NotifyFilters.FileName
            | NotifyFilters.DirectoryName
            | NotifyFilters.Attributes;

    void OnChange(object sender, FileSystemEventArgs e)
    {
        // Verifica se pode executar
        if (ScriptCanBeRunned(e.FullPath))
        {
            return;
        }

        // Executa o Script
        ExecuteScript(trigger);

        // Registra a ultima execução
        CacheScriptExecution(e.FullPath);
    }

    watcher.Changed += OnChange;
    watcher.Created += OnChange;
    watcher.Deleted += OnChange;
    watcher.Renamed += OnChange;
}


private static void CacheScriptExecution(string path)
{
    scriptExecutionCache[path] = DateTime.Now;
}

private static bool ScriptCanBeRunned(string path)
{
    if (!scriptExecutionCache.ContainsKey(path))
    {
        return false;
    }

    var lastExecution = scriptExecutionCache[path];

    // Caso tenha executado há mais de 1 segundo, retorna `true`
    return lastExecution.AddSeconds(1) > DateTime.Now;
}
```
## O método ExecuteScript

Ele, na verdade, é bem simples.

Só vai verificar a existência e extensão do arquivo e executálo usando o [`Process`](https://learn.microsoft.com/pt-br/dotnet/api/system.diagnostics.process?view=net-8.0).

```csharp
private static void ExecuteScript(Trigger trigger)
{
    if (!File.Exists(trigger.ScriptFileName))
    {
        Console.WriteLine($"File not found: {trigger.ScriptFileName}");
        return;
    }

    if (!trigger.ScriptFileName.EndsWith(".ps1"))
    {
        throw new NotImplementedException($"Script type {trigger.ScriptFileName} is not implemented.");
        
    }
    
    var startInfo = new ProcessStartInfo()
    {
        FileName = "powershell.exe",
        Arguments = $"-ExecutionPolicy Bypass -File \"{trigger.ScriptFileName}\""
    };

    Process.Start(startInfo);
}
```

Depois disso, você só precisará criar o seu script e criar uma trigger para ele.
> Caso não saiba fazer scripts com Powershell, leia esse artigo: [about_Scripts](https://learn.microsoft.com/pt-br/powershell/module/microsoft.powershell.core/about/about_scripts?view=powershell-7.4#how-to-write-a-script).


Nesse exemplo, vou criar uma trigger que vai rodar à cada 5 segundos e executar um script que mostra o horário atual.

**A trigger**
```json
{
  "Triggers": [
    {
      "ScriptFileName": "PATH\\TO\\script.ps1",
      "Type": "CronExpression",
      "CronExpression": "*/5 * * * * *"
    }
  ]
}
```

**O script:**
```ps1
Add-Type -AssemblyName System.Windows.Forms
$now = Get-Date
[System.Windows.Forms.MessageBox]::Show($now.ToString("HH:mm:ss"), "Current Time")
```

**Resultado:**
![Resultado Job Cron Trigger](/assets/blog/magia-dos-triggers-automatizando-tarefas-com-c-sharp/resultado-job-cron-trigger.png)

## Melhorias

Uma coisa interessante que pode ser feita é: passar parâmetros para o script.

Ex: Quando um arquivo for adicionado em uma pasta em específica, enviamos para o script o nome do evento e o nome do arquivo.


### Passando argumentos
Pra isso, vamos alterar o `ExecuteScript` pra receber esses parâmetros:
```csharp
// Recebe os parâmetros como uma lista de strings
private static void ExecuteScript(Trigger trigger, params string[] parameters)
{
    if (!File.Exists(trigger.ScriptFileName))
    {
        Console.WriteLine($"File not found: {trigger.ScriptFileName}");
        return;
    }

    if (!trigger.ScriptFileName.EndsWith(".ps1"))
    {
        throw new NotImplementedException($"Script type {trigger.ScriptFileName} is not implemented.");
    }

    var startInfo = new ProcessStartInfo()
    {
        FileName = "powershell.exe",
        // Adiciona os parametros no final dos argumentos
        Arguments = $"-ExecutionPolicy Bypass -File \"{trigger.ScriptFileName}\" {string.Join(' ', parameters)}",  
    };

    Process.Start(startInfo);
}
```

**OnChange:**
Nele, nós passamos os parâmetros nomeados nesse formado : `-{KEY} "{VALUE}"` cmo abaixo
```csharp
void OnChange(object sender, FileSystemEventArgs e)
{
    Console.WriteLine($"File {e.Name} {e.ChangeType}");
    if (ScriptCanBeRunned(e.FullPath))
    {
        return;
    }

    ExecuteScript(
        trigger, 
        $"-EventType \"{e.ChangeType}\"", 
        $"-Name \"{e.Name}\"", 
        $"-FullPath \"{e.FullPath}\"");

    CacheScriptExecution(e.FullPath);
}
```

E no script, nós receberemos assim:

```ps1
param (
    [string]$EventType,
    [string]$Name,
    [string]$FullPath
)

Add-Type -AssemblyName System.Windows.Forms

[System.Windows.Forms.MessageBox]::Show("EventType: $EventType`nName: $Name`nFullPath: $FullPath")
```


**Resultado:**

![Passando Parâmetros para o script](/assets/blog/magia-dos-triggers-automatizando-tarefas-com-c-sharp/passando-parametros-para-o-script.png)


## Conclusão

Ainda há muito que pode ser melhorado nesse projeto como:
- [x] Criar o arquivo `triggers.json` caso ele não exista.
- [x] Adicionar um `FileSystemWatcher` no arquivo `triggers.json` para atualizar as triggers.
- [ ] Capturar o estado da máquina para poder passar em argumentos para os scripts (Ex: "MemoryUsage" ou "BatteryCharge")
- [ ] Implementar Argumentos para os Jobs de CronExpression
- [ ] Implementar novos tipos de trigger como baseadas em **Eventos do Windows**, **Emails** e etc.
- [ ] Transformar em serviço
- [ ] Adicionar sistema de logs
- [ ] Criar interface para adicionar triggers e scripts


E se você se sentir à vontade, pode me ajudar com a implementação.
Ele já está lá no Github:

[Link do repositório](https://github.com/rafa-coelho/JobExecutor)
