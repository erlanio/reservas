# Tasks — Notificação de Usuários Pendentes
# Tasks — Notificar Novos Usuários

## Backend

- [x] Criar rota para consultar a quantidade de usuários pendentes.
- [x] Permitir acesso à rota somente para usuários autenticados, ativos e master.
- [x] Contabilizar apenas usuários com situação `pendente`.
- [x] Desconsiderar usuários ativos ou excluídos.
- [x] Desconsiderar usuários presentes na lixeira.
- [x] Tratar erros sem expor credenciais ou informações técnicas.

## Notificação no dashboard

- [x] Consultar os usuários pendentes ao carregar o dashboard.
- [x] Exibir uma notificação quando existir pelo menos um usuário pendente.
- [x] Apresentar a quantidade de usuários aguardando aprovação.
- [x] Criar mensagem no singular para um usuário pendente.
- [x] Criar mensagem no plural para mais de um usuário pendente.
- [x] Ocultar a notificação quando não existirem usuários pendentes.
- [x] Permitir que o master feche visualmente a notificação.
- [x] Garantir que fechar a notificação não altere os usuários pendentes.

## Indicador no menu

- [x] Adicionar um indicador numérico ao item **Usuários**.
- [x] Exibir a quantidade de cadastros pendentes.
- [x] Ocultar o indicador quando a quantidade for zero.
- [x] Atualizar o indicador sem recarregar a página.
- [x] Adicionar uma descrição acessível ao indicador.

## Navegação

- [x] Permitir que o master selecione a notificação.
- [x] Direcionar o master para a tela de usuários.
- [x] Aplicar automaticamente o filtro `pendente`.
- [x] Permitir que o indicador do menu execute a mesma navegação.
- [x] Manter o acesso restrito aos usuários master.

## Atualização dinâmica

- [x] Atualizar a quantidade ao abrir o dashboard.
- [x] Atualizar a quantidade ao retornar para o dashboard.
- [x] Atualizar após o cadastro de um novo usuário ao retornar/focar o dashboard.
- [x] Atualizar após a aprovação de um usuário.
- [x] Atualizar após a exclusão de um usuário pendente.
- [x] Remover a notificação quando não houver mais usuários pendentes.
- [x] Evitar o recarregamento completo da página.

## Controle de acesso

- [x] Exibir a notificação somente para usuários master.
- [x] Não consultar usuários pendentes para usuários normais.
- [x] Não apresentar o indicador para usuários normais.
- [x] Validar as permissões no frontend.
- [x] Validar as permissões no backend.

## Responsividade

- [x] Aplicar a abordagem Mobile First.
- [x] Adaptar a notificação para celulares.
- [x] Adaptar a notificação para tablets e computadores.
- [x] Garantir que a notificação não cubra conteúdos importantes.
- [x] Garantir que a notificação seja adequada para interação por toque.
- [x] Adaptar o indicador ao menu expandido e recolhido.

## Acessibilidade

- [x] Adicionar texto descritivo à notificação.
- [x] Permitir a seleção da notificação pelo teclado.
- [x] Manter o foco visível.
- [x] Utilizar contraste adequado.
- [x] Não utilizar apenas cores para informar a existência de pendências.

## Testes

- [x] Testar o dashboard sem usuários pendentes.
- [x] Testar o dashboard com um usuário pendente.
- [x] Testar o dashboard com vários usuários pendentes.
- [x] Testar a mensagem no singular.
- [x] Testar a mensagem no plural.
- [x] Testar a atualização após um novo cadastro ao retornar/focar o dashboard.
- [x] Testar a atualização após aprovação.
- [x] Testar a atualização após exclusão.
- [x] Testar a navegação para a lista de usuários pendentes.
- [x] Testar o indicador no menu expandido.
- [x] Testar o indicador no menu recolhido.
- [x] Testar a visualização por usuário master.
- [x] Testar a ausência da notificação para usuário normal.
- [x] Testar falhas na consulta.
- [x] Testar a interface em mobile, tablet e desktop por revisão responsiva de CSS.

## Critérios para conclusão

- [x] Somente usuários master visualizam a notificação.
- [x] A quantidade de usuários pendentes está correta.
- [x] A notificação aparece quando existem usuários pendentes.
- [x] A notificação desaparece quando não existem usuários pendentes.
- [x] O item **Usuários** apresenta o indicador numérico.
- [x] A notificação direciona para a lista filtrada de usuários pendentes.
- [x] A quantidade é atualizada automaticamente.
- [x] Falhas na consulta não impedem o uso do dashboard.
- [x] A interface funciona em mobile, tablet e desktop.

## Dependências

Esta especificação depende de:

- `02-login`;
- `03-dashboard`;
- `04-gerenciar-usuarios`.
