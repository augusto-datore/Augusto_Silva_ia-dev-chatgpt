# Service Desk Acadêmico

Aplicativo web estático desenvolvido em HTML, CSS e JavaScript para demonstrar a abertura, o acompanhamento e a atualização de chamados de suporte.

## Como executar

O projeto utiliza HTML, CSS e JavaScript puro, sem frameworks ou dependências externas.

Para executar no Windows:

1. Dê dois cliques em `abrir-service-desk.bat`.
2. O navegador padrão abrirá o arquivo `index.html`.

Também é possível abrir diretamente o arquivo `index.html` em um navegador moderno.

## Funcionalidades

- Abertura de chamados com nome, e-mail, categoria, prioridade, título e descrição.
- Painel do analista para visualizar e selecionar chamados.
- Busca por número do chamado, título ou nome do solicitante.
- Alteração de status e prioridade.
- Registro da correção ou próxima ação.
- Histórico de alterações de cada chamado.
- Tela de histórico geral.
- Persistência dos dados no `localStorage` do navegador.
- Restauração dos dados de demonstração.

## Status disponíveis

- Aberto
- Em atendimento
- Aguardando usuário
- Resolvido

## Prioridades disponíveis

- Baixa
- Média
- Alta
- Crítica

## Persistência dos dados

Os chamados são armazenados no `localStorage` do navegador, utilizando a chave `serviceDeskTickets`.

Isso significa que os dados ficam salvos no navegador e no perfil de usuário em que o sistema foi aberto.

As informações não são enviadas para um servidor e não são compartilhadas automaticamente entre computadores ou navegadores.

A opção **Restaurar demonstração** solicita confirmação e substitui os dados locais pelos chamados de demonstração.

## Estrutura dos arquivos

- `index.html`: estrutura e conteúdo das telas.
- `styles.css`: aparência, layout e responsividade.
- `app.js`: interações, validações, histórico e persistência local.
- `README.md`: documentação do projeto.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- localStorage

## Observações

Este é um projeto acadêmico demonstrativo.

O `localStorage` não substitui um banco de dados de produção, autenticação de usuários ou controle de acesso.

Como não há backend, as informações ficam restritas ao navegador local.