# DETALHAMENTO — Correções do Service Desk com apoio de IA

## 1. Objetivo

Este documento registra o processo de análise e correção de problemas no projeto **Service Desk Acadêmico**, uma aplicação web estática desenvolvida com HTML, CSS e JavaScript.

O objetivo foi identificar comportamentos divergentes do esperado, utilizar uma inteligência artificial como apoio à investigação e às correções e organizar as alterações por meio do Git e do GitHub.

A aplicação possui funcionalidades para abertura de chamados, atendimento pelo analista e consulta ao histórico. Os dados são armazenados localmente no navegador por meio de `localStorage`.

## 2. Bugs identificados

A versão inicial do projeto documentava quatro problemas intencionais. A análise do código dessa versão confirma os seguintes pontos:

| Bug | Comportamento identificado | Comportamento esperado |
| --- | --- | --- |
| Busca de chamados incompleta | A busca considera o ID e o título, mas não o nome do solicitante, apesar de o campo indicar essas três possibilidades. | Localizar chamados por ID, título ou nome do solicitante. |
| Alterações não persistidas | As alterações aparecem na interface, mas não são gravadas no `localStorage`. Ao recarregar a página, podem ser perdidas. | Manter as alterações após recarregar a página. |
| Limpeza da base local | O botão “Limpar base local” remove os dados e depois restaura os chamados de exemplo. | Limpar efetivamente os dados locais e tratar corretamente a lista vazia. |
| Histórico geral limitado | A tabela apresenta somente o estado atual dos chamados, não os eventos registrados durante o atendimento. | Apresentar os eventos relevantes para permitir acompanhar as alterações. |

Esses problemas foram identificados no código original, principalmente em `service-desk/app.js` e `service-desk/index.html`.

## 3. Utilização da inteligência artificial

A IA foi utilizada como ferramenta de apoio à leitura do código, identificação de problemas, planejamento das correções e revisão das soluções.

Para obter respostas mais precisas, os prompts foram estruturados com os seguintes elementos:

1. **Papel:** orientar a IA a atuar como engenheira de software experiente e revisora de código.
2. **Contexto:** explicar que o projeto é uma aplicação Service Desk desenvolvida em HTML, CSS e JavaScript, com persistência em `localStorage`.
3. **Problema:** descrever um comportamento específico por vez, indicando o resultado atual e o esperado.
4. **Escopo:** solicitar a análise dos arquivos e funções diretamente relacionados ao problema.
5. **Restrições:** preservar as funcionalidades existentes e evitar alterações desnecessárias.
6. **Resultado esperado:** solicitar a explicação da causa, a proposta de correção e formas de validar o resultado.

### Exemplos representativos de prompts

Os exemplos abaixo representam a estrutura utilizada para orientar o trabalho. Não são apresentados como transcrição literal de todo o histórico de conversas.

**Prompt de análise inicial:**

> Atue como engenheiro de software sênior. Analise os arquivos do projeto Service Desk e identifique os bugs funcionais. Para cada problema, explique o comportamento atual, a causa provável, o comportamento esperado e quais arquivos e funções devem ser analisados. Não altere partes que não estejam relacionadas aos problemas.

**Prompt de correção:**

> Analise o problema de [descrever o bug] no projeto. Verifique o fluxo atual no código e proponha uma correção mínima, preservando as demais funcionalidades. Explique a alteração e indique um teste manual que permita confirmar o resultado.

**Prompt de revisão:**

> Revise a solução proposta para [descrever o bug]. Verifique se ela resolve o problema sem criar regressões, considerando também estados vazios, atualização da interface e persistência dos dados quando aplicável. Aponte qualquer cenário que ainda precise ser testado.

**Prompt de versionamento:**

> Organize as alterações em commits atômicos na branch de trabalho. Cada commit deve tratar de uma correção lógica, incluir somente os arquivos e trechos relacionados e utilizar uma mensagem objetiva no padrão Conventional Commits, começando por `fix:`.

A revisão humana foi importante para conferir as sugestões da IA e verificar se as alterações correspondiam ao funcionamento esperado do sistema.

## 4. Fluxo de versionamento

O Git foi utilizado para controlar as versões do código, enquanto o GitHub foi utilizado para hospedar o repositório e organizar a integração das alterações.

O fluxo de trabalho adotado como referência foi:

1. Manter a versão estável na branch `main`.
2. Realizar as correções em uma branch de trabalho chamada `staging`.
3. Separar as alterações por problema, evitando agrupar correções independentes no mesmo commit.
4. Revisar os arquivos preparados antes de cada commit.
5. Registrar cada correção com uma mensagem clara no padrão Conventional Commits.
6. Enviar a branch de trabalho ao GitHub.
7. Abrir um Pull Request com destino à `main`.
8. Revisar as alterações e integrar as correções após a validação.

### Pull Requests identificados no repositório

Na consulta ao histórico do GitHub, foram encontrados os seguintes Pull Requests relacionados ao trabalho:

| Pull Request | Título |
| --- | --- |
| #1 | `fix: limpar base local corretamente` |
| #2 | `Corrigir limpeza da base local e tratamento de tickets vazios` |
| #3 | `fix: limpar base local corretamente` |
| #4 | `fix: limpar base local no historico` |
| #5 | `fix: corrige gerenciamento de chamados` |
| #6 | `Update README.md` |

Esses registros demonstram a utilização de Pull Requests para organizar propostas de correção e atualização da documentação.

A existência de um Pull Request, isoladamente, não comprova que ele foi integrado à branch principal.

### Observação sobre as branches

Na verificação realizada para esta documentação, a branch remota `main` foi localizada, mas a busca pela branch `staging` não retornou uma branch com esse nome.

Por esse motivo, não é correto afirmar que a branch `staging` está atualmente publicada no repositório remoto. A confirmação dos commits e da integração final deve ser feita diretamente no histórico do GitHub.

## 5. Validação das correções

As correções devem ser verificadas diretamente no navegador, considerando os seguintes cenários:

- Pesquisar um chamado pelo ID, pelo título e pelo nome do solicitante.
- Alterar o status, a prioridade e a descrição da correção; recarregar a página e conferir a persistência.
- Acionar a limpeza da base local e verificar se os dados foram realmente removidos.
- Conferir se a interface funciona corretamente quando não existem chamados cadastrados.
- Consultar o histórico geral e verificar se os eventos relevantes aparecem corretamente.
- Navegar entre as telas e conferir se as funcionalidades continuam operando normalmente.

Este relatório não declara que todos esses testes foram executados com sucesso. Os resultados devem ser registrados conforme a validação prática realizada.

## 6. Conclusão

A utilização da inteligência artificial contribuiu para estruturar a investigação dos bugs, propor correções direcionadas e organizar a documentação do processo.

A qualidade do resultado dependeu da clareza dos prompts, da análise do código existente e da validação humana das alterações.

A separação das correções em commits pequenos e a revisão por Pull Request tornam o histórico mais compreensível, facilitam a identificação das mudanças e ajudam a reduzir o risco de misturar alterações independentes.

---

**Projeto:** Service Desk Acadêmico  
**Tecnologias:** HTML, CSS, JavaScript e `localStorage`  
**Repositório:** `beatrizSNTech/ia-dev-chatgpt`
