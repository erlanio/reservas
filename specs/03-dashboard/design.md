# Design — Dashboard

## Visão geral da solução

O dashboard será a tela inicial apresentada aos usuários autenticados e com cadastro aprovado.

Nesta versão, o dashboard possuirá apenas um menu lateral esquerdo com as opções **Início**, **Usuários** e **Sair**.

## Estrutura da interface

A tela deverá possuir:

- Menu lateral esquerdo;
- Área principal de conteúdo;
- Botão para expandir ou recolher o menu;
- Identificação do usuário autenticado;
- Opção para encerrar a sessão.

## Itens do menu

### Início

- Deve possuir um ícone relacionado à página inicial.
- Deve direcionar para a tela inicial do dashboard.
- Deve estar disponível para usuários normais e master.

### Usuários

- Deve possuir um ícone relacionado ao gerenciamento de pessoas.
- Deve direcionar para o módulo de usuários.
- Deve estar disponível somente para usuários master.

### Sair

- Deve possuir um ícone relacionado ao encerramento da sessão.
- Deve encerrar a sessão e direcionar para a tela de login.
- Deve estar disponível para todos os usuários autenticados.

## Fluxo principal

1. O usuário realiza o login.
2. O sistema valida as credenciais.
3. O sistema verifica se o cadastro está ativo.
4. O sistema cria a sessão.
5. O sistema direciona o usuário para o dashboard.
6. O sistema apresenta o menu lateral.
7. O sistema exibe os itens permitidos para o nível do usuário.
8. O usuário seleciona uma opção do menu.

## Fluxo de recolhimento do menu

1. O usuário seleciona o botão para recolher o menu.
2. O sistema oculta os nomes dos itens.
3. O sistema mantém apenas os ícones visíveis.
4. A área principal utiliza o espaço liberado.

## Fluxo de expansão do menu

1. O usuário seleciona o botão para expandir o menu.
2. O sistema apresenta novamente os ícones e nomes.
3. A área principal ajusta-se ao tamanho do menu.

## Fluxo de logout

1. O usuário seleciona a opção **Sair**.
2. O sistema encerra a sessão.
3. O sistema remove os dados locais de autenticação.
4. O sistema direciona o usuário para a tela de login.

## Controle de acesso

- Somente usuários autenticados e ativos podem acessar o dashboard.
- Usuários sem sessão válida devem ser direcionados para o login.
- Usuários pendentes devem ser direcionados para a tela de aprovação pendente.
- Usuários rejeitados ou inativos não podem acessar o dashboard.
- O item **Usuários** deve ser exibido somente para usuários master.
- As permissões devem ser verificadas no frontend e no backend.

## Comportamento do menu

- O menu deve iniciar expandido em telas maiores.
- O menu expandido deve apresentar ícones e nomes.
- O menu recolhido deve apresentar somente os ícones.
- O item referente à página atual deve possuir destaque visual.
- Os ícones devem possuir descrição para acessibilidade.
- O estado do menu pode ser mantido durante a sessão.

## Decisões técnicas

- **Banco de dados:** MySQL;
- **Frontend:** HTML, CSS e JavaScript;
- **Backend:** Node.js;
- **Comunicação:** API REST;
- **Formato de dados:** JSON;
- **Controle de acesso:** sessão autenticada;
- **Abordagem da interface:** Mobile First.

## Responsividade

- A tela deve adaptar-se a celulares, tablets e computadores.
- No mobile, o menu deve permanecer oculto inicialmente.
- Um botão deve permitir abrir e fechar o menu no mobile.
- Em telas pequenas, o menu deve ser apresentado sobre o conteúdo.
- O menu deve ser fechado após a seleção de um item no mobile.
- Em tablets e computadores, o menu poderá permanecer expandido ou recolhido.
- Os itens devem possuir tamanho adequado para interação por toque.
- Nenhum conteúdo deve ultrapassar os limites da tela.