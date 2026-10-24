# Tasks — Dashboard

## Estrutura do dashboard

- [x] Criar a tela de dashboard.
- [x] Criar o menu lateral esquerdo.
- [X] Criar a área principal de conteúdo.
- [X] Exibir o nome do usuário autenticado.
- [X] Exibir o nível de acesso do usuário.
- [X] Destacar o item correspondente à página atual.

## Menu lateral

- [X] Adicionar o item **Início** com ícone.
- [X] Adicionar o item **Usuários** com ícone.
- [X] Adicionar o item **Sair** com ícone.
- [X] Exibir o item **Usuários** somente para usuários master.
- [X] Criar o botão para recolher o menu.
- [X] Manter apenas os ícones quando o menu estiver recolhido.
- [X] Criar o botão para expandir o menu.
- [X] Exibir uma descrição ao posicionar o cursor sobre os ícones.
- [X] Ajustar a área principal quando o menu for expandido ou recolhido.

## Controle de acesso

- [x] Criar as funcionalidades de login.
- [X] Proteger a rota do dashboard.
- [X] Permitir o acesso somente para usuários autenticados e ativos.
- [X] Redirecionar usuários não autenticados para o login.
- [X] Redirecionar usuários pendentes para a tela de aprovação pendente.
- [X] Impedir o acesso de usuários rejeitados ou inativos.
- [X] Validar as permissões no backend.
- [X] Impedir usuários normais de acessar o módulo de usuários.

## Logout

- [x] Permitir que usuários realizem logout.
- [X] Adicionar a opção **Sair** ao menu lateral.
- [X] Encerrar a sessão no backend.
- [X] Remover os dados locais relacionados à autenticação.
- [X] Redirecionar o usuário para o login.
- [X] Impedir o retorno ao dashboard sem nova autenticação.

## Responsividade

- [X] Aplicar a abordagem Mobile First.
- [X] Manter o menu oculto inicialmente no mobile.
- [X] Criar um botão para abrir o menu no mobile.
- [X] Exibir o menu sobre o conteúdo em telas pequenas.
- [X] Fechar o menu após a seleção de um item no mobile.
- [X] Permitir o menu expandido ou recolhido em tablets e computadores.
- [X] Garantir que os itens tenham tamanho adequado para interação por toque.
- [X] Ajustar o dashboard para mobile, tablet e desktop.

## Acessibilidade

- [X] Adicionar descrições aos ícones.
- [X] Permitir a navegação pelo teclado.
- [X] Manter o foco visível nos elementos interativos.
- [X] Utilizar contraste adequado.
- [X] Identificar corretamente o botão de abertura do menu.

## Testes

- [X] Testar o acesso de usuário autenticado e ativo.
- [X] Testar o acesso sem autenticação.
- [X] Testar o acesso de usuário pendente.
- [X] Testar o acesso de usuário rejeitado.
- [X] Testar a visibilidade do item **Usuários** para usuários master.
- [X] Testar a ocultação do item **Usuários** para usuários normais.
- [X] Testar o recolhimento e a expansão do menu.
- [X] Testar a navegação pelos itens do menu.
- [X] Testar o logout.
- [X] Testar o acesso ao dashboard após o logout.
- [X] Testar a expiração da sessão.
- [X] Testar o dashboard em mobile, tablet e desktop.

## Critérios para conclusão

- [X] Somente usuários autenticados e ativos acessam o dashboard.
- [X] O menu lateral apresenta ícones e nomes.
- [X] O menu pode ser expandido ou recolhido.
- [X] O item **Usuários** aparece somente para usuários master.
- [X] O usuário consegue encerrar sua sessão.
- [X] O dashboard não pode ser acessado após o logout.
- [X] A interface é objetiva, clean, moderna e responsiva.

## Dependências

As seguintes especificações dependem da conclusão desta:

- `03-cadastro-tipos`;
- `04-cadastro-ativos`.