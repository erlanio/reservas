# Requirements — Dashboard

## Objetivo

Desenvolver o dashboard inicial para usuários autenticados e com cadastro aprovado.

## Contexto

Após realizar o login, o usuário ativo deverá ser direcionado para o dashboard.

O dashboard deverá possuir um menu lateral esquerdo, com opção para expandir ou recolher. Quando estiver recolhido, apenas os ícones dos itens deverão permanecer visíveis.

Nesta versão, o menu deverá possuir os itens:

- Início;
- Usuários;
- Sair.

O conteúdo da página inicial será complementado em especificações posteriores.

## Requisitos funcionais

### RF01 — Acessar o dashboard

O sistema deve permitir o acesso ao dashboard somente para usuários autenticados e com situação `ativo`.

### RF02 — Proteger o dashboard

O sistema deve impedir o acesso ao dashboard quando:

- Não existir uma sessão válida;
- A sessão estiver expirada;
- O usuário estiver pendente;
- O usuário estiver rejeitado;
- O usuário estiver inativo.

### RF03 — Redirecionar acesso não autorizado

Quando um usuário não autenticado tentar acessar o dashboard, o sistema deve direcioná-lo para a tela de login.

### RF04 — Exibir o menu lateral

O dashboard deve apresentar um menu no lado esquerdo da tela.

### RF05 — Exibir ícones e nomes

Cada item do menu deve possuir um ícone e um nome.

### RF06 — Recolher o menu

O usuário deve poder recolher o menu lateral.

Quando recolhido, o menu deve:

- Ocultar os nomes dos itens;
- Manter os ícones visíveis;
- Preservar o acesso às funcionalidades;
- Apresentar uma descrição ao posicionar o cursor sobre um ícone.

### RF07 — Expandir o menu

O usuário deve poder expandir novamente o menu para visualizar os ícones e os nomes dos itens.

### RF08 — Acessar o início

O item **Início** deve direcionar o usuário para a página inicial do dashboard.

### RF09 — Acessar usuários

O item **Usuários** deve direcionar para o módulo de gerenciamento de usuários.

Esse item deve ser apresentado somente para usuários master.

### RF10 — Identificar o usuário

O dashboard deve apresentar o nome e o nível de acesso do usuário autenticado.

### RF11 — Realizar logout

O usuário deve poder encerrar sua sessão por meio da opção **Sair** disponível no dashboard ou no menu lateral.

### RF12 — Finalizar a sessão

Ao realizar logout, o sistema deve:

1. Encerrar a sessão;
2. Remover os dados locais relacionados à autenticação;
3. Direcionar o usuário para a tela de login;
4. Impedir o retorno às páginas protegidas sem uma nova autenticação.

## Fluxo principal

1. O usuário realiza o login.
2. O sistema valida as credenciais.
3. O sistema verifica se o usuário está ativo.
4. O sistema cria a sessão.
5. O sistema direciona o usuário para o dashboard.
6. O dashboard apresenta o menu lateral expandido.
7. O sistema exibe os itens permitidos para o nível do usuário.
8. O usuário navega pelas opções disponíveis.

## Fluxos alternativos

### Usuário não autenticado

1. O usuário tenta acessar o dashboard sem uma sessão válida.
2. O sistema impede o acesso.
3. O sistema direciona o usuário para a tela de login.

### Usuário pendente

1. O usuário tenta acessar o dashboard.
2. O sistema identifica que o cadastro está pendente.
3. O sistema impede o acesso.
4. O sistema direciona o usuário para a tela de aprovação pendente.

### Usuário rejeitado ou inativo

1. O usuário tenta acessar o dashboard.
2. O sistema identifica que o cadastro não está ativo.
3. O sistema impede o acesso.
4. O sistema encerra a sessão, quando necessário.
5. O sistema apresenta uma mensagem adequada.

### Recolher o menu

1. O usuário seleciona o botão para recolher o menu.
2. O sistema oculta os nomes dos itens.
3. O sistema mantém somente os ícones visíveis.
4. A área de conteúdo utiliza o espaço liberado.

### Expandir o menu

1. O usuário seleciona o botão para expandir o menu.
2. O sistema apresenta novamente os ícones e nomes.
3. A área de conteúdo ajusta-se ao tamanho do menu.

### Logout

1. O usuário seleciona a opção **Sair**.
2. O sistema encerra a sessão.
3. O sistema direciona o usuário para a tela de login.
4. O sistema impede o acesso ao dashboard sem uma nova autenticação.

## Regras de negócio

- Apenas usuários autenticados e ativos podem acessar o dashboard.
- O item **Usuários** deve estar disponível somente para usuários master.
- Usuários normais devem visualizar apenas os itens permitidos ao seu nível.
- A proteção das rotas deve ser realizada no backend.
- Ocultar opções na interface não substitui a validação de permissão no backend.
- O estado expandido ou recolhido do menu pode ser mantido durante a sessão.
- Após o logout, páginas protegidas não podem ser acessadas pelo histórico do navegador.
- O usuário deve ser direcionado para o login quando a sessão expirar.

## Requisitos de interface

- O dashboard deve possuir visual objetivo, clean e moderno.
- O menu deve estar localizado no lado esquerdo em telas maiores.
- Cada item deve apresentar ícone e nome quando o menu estiver expandido.
- O item correspondente à página atual deve possuir destaque visual.
- O botão para recolher ou expandir deve ser facilmente identificado.
- Os ícones devem possuir descrições acessíveis.
- O conteúdo principal deve ajustar-se automaticamente ao estado do menu.
- A opção de logout deve ser facilmente acessível.

## Responsividade

- A interface deve utilizar a abordagem Mobile First.
- O dashboard deve adaptar-se a celulares, tablets e computadores.
- No mobile, o menu deve permanecer oculto inicialmente.
- No mobile, o menu deve ser aberto sobre o conteúdo por meio de um botão.
- O menu deve ser fechado ao selecionar um item no mobile.
- Em tablets e computadores, o menu poderá permanecer expandido ou recolhido.
- Botões e itens devem possuir tamanho adequado para interação por toque.
- Nenhum conteúdo deve ultrapassar os limites da tela.

## Critérios de aceite

- [X] Apenas usuários autenticados e ativos conseguem acessar o dashboard.
- [X] Usuários não autenticados são direcionados para o login.
- [X] Usuários pendentes são direcionados para a tela de aprovação pendente.
- [X] O dashboard possui um menu lateral esquerdo.
- [X] O menu apresenta ícones e nomes.
- [X] O menu possui os itens **Início** e **Usuários**.
- [X] O item **Usuários** é apresentado somente para usuários master.
- [X] O usuário consegue recolher o menu.
- [X] Quando recolhido, somente os ícones permanecem visíveis.
- [X] O usuário consegue expandir novamente o menu.
- [X] O conteúdo principal adapta-se ao tamanho do menu.
- [X] O usuário consegue realizar logout.
- [X] Após o logout, o usuário é direcionado para o login.
- [X] Após o logout, o dashboard não pode ser acessado sem nova autenticação.
- [X] O dashboard é objetivo, clean, moderno e responsivo.
- [X] O menu funciona corretamente em mobile, tablet e desktop.

## Fora do escopo

- Conteúdo completo da página inicial;
- Reservas exibidas no dashboard;
- Relatórios e indicadores;
- Gerenciamento completo de usuários;
- Notificações;
- Personalização de temas.