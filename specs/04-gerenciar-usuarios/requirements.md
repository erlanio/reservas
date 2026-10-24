# Requirements — Gerenciamento de Usuários

## Objetivo

Permitir que usuários master visualizem, aprovem, editem, excluam e recuperem usuários cadastrados.

## Contexto

Este módulo será acessado por meio do item **Usuários** no menu lateral do dashboard.

Apenas usuários autenticados, ativos e com nível `master` poderão visualizar o item e acessar suas funcionalidades.

## Requisitos funcionais

### RF01 — Controlar o acesso

O sistema deve permitir o acesso ao módulo somente para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível de acesso `master`.

### RF02 — Listar usuários

O sistema deve apresentar uma tabela com os usuários cadastrados que não estejam na lixeira.

A tabela deve apresentar somente:

- Nome;
- E-mail;
- Situação;
- Opções.

### RF03 — Ordenar usuários

O usuário master deve poder ordenar a listagem por nome em ordem crescente ou decrescente.

### RF04 — Paginar usuários

Quando existirem mais de dez usuários, o sistema deve criar uma paginação com no máximo dez registros por página.

### RF05 — Visualizar detalhes

O usuário master deve poder selecionar um usuário para visualizar todos os seus dados.

### RF06 — Editar usuário

O usuário master deve poder editar:

- Nome;
- E-mail;
- Data de nascimento;
- Nível de acesso;
- Situação;
- Senha.

A senha atual nunca deve ser exibida. Quando necessário, o master deverá definir uma nova senha.

### RF07 — Confirmar edição

Antes de salvar uma alteração, o sistema deve apresentar uma mensagem de confirmação.

### RF08 — Aprovar usuário

O sistema deve apresentar a opção **Aprovar** para usuários com situação `pendente`.

Após a aprovação, a situação do usuário deve ser alterada para `ativo`.

### RF09 — Rejeitar usuário

O usuário master deve poder rejeitar um cadastro pendente.

Após a rejeição, a situação deve ser alterada para `rejeitado`.

### RF10 — Excluir usuário

O usuário master deve poder excluir um usuário.

A exclusão deve ser lógica, mantendo o registro na lixeira por 30 dias.

### RF11 — Confirmar exclusão

Antes de enviar um usuário para a lixeira, o sistema deve apresentar uma mensagem de confirmação.

### RF12 — Acessar a lixeira

A tela de usuários deve possuir a opção **Lixeira**, acessível somente para usuários master.

### RF13 — Listar usuários excluídos

A lixeira deve apresentar:

- Nome;
- E-mail;
- Data da exclusão;
- Data prevista para exclusão definitiva;
- Opção para recuperar.

### RF14 — Recuperar usuário

O usuário master deve poder recuperar um usuário da lixeira durante o período de 30 dias.

### RF15 — Validar o e-mail na recuperação

Antes da recuperação, o sistema deve verificar se existe outra conta ativa ou pendente com o mesmo e-mail.

Se o e-mail estiver em uso, o sistema não deve recuperar o usuário e deve apresentar uma mensagem de erro.

### RF16 — Excluir definitivamente

Após 30 dias na lixeira, o usuário deve ser excluído definitivamente.

## Fluxo principal

1. O usuário master acessa o dashboard.
2. O usuário seleciona o item **Usuários**.
3. O sistema verifica a autenticação, a situação e o nível de acesso.
4. O sistema apresenta a tabela de usuários.
5. O usuário master ordena, navega pelas páginas ou seleciona uma ação.
6. O sistema executa a ação escolhida após as validações necessárias.
7. O sistema atualiza a tabela.

## Fluxo de edição

1. O master seleciona a opção **Editar**.
2. O sistema apresenta os dados do usuário.
3. O master altera os campos desejados.
4. O sistema valida os dados.
5. O sistema apresenta uma mensagem de confirmação.
6. O master confirma a edição.
7. O sistema salva as alterações.
8. O sistema atualiza a tabela.

## Fluxo de aprovação

1. O master localiza um usuário pendente.
2. O master seleciona a opção **Aprovar**.
3. O sistema solicita confirmação.
4. O master confirma.
5. O sistema altera a situação para `ativo`.
6. O sistema atualiza a tabela.

## Fluxo de exclusão

1. O master seleciona a opção **Excluir**.
2. O sistema apresenta uma mensagem de confirmação.
3. O master confirma a exclusão.
4. O sistema registra a data da exclusão.
5. O sistema move o usuário para a lixeira.
6. O sistema informa que o registro permanecerá disponível por 30 dias.
7. O sistema atualiza a tabela.

## Fluxo de recuperação

1. O master acessa a lixeira.
2. O sistema apresenta os usuários excluídos.
3. O master seleciona a opção **Recuperar**.
4. O sistema verifica se o prazo de 30 dias ainda está válido.
5. O sistema verifica se o e-mail está disponível.
6. O sistema solicita confirmação.
7. O master confirma a recuperação.
8. O sistema remove o usuário da lixeira.
9. O sistema restaura o cadastro.
10. O sistema atualiza as listagens.

## Fluxos alternativos

### Usuário sem permissão

1. Um usuário normal tenta acessar o módulo.
2. O sistema impede o acesso.
3. O sistema apresenta uma mensagem de acesso não autorizado.
4. O sistema direciona o usuário para o início do dashboard.

### E-mail duplicado durante a edição

1. O master altera o e-mail do usuário.
2. O sistema identifica que o novo e-mail já está cadastrado.
3. O sistema não salva a alteração.
4. O sistema informa que o e-mail já está em uso.

### E-mail indisponível durante a recuperação

1. O master tenta recuperar um usuário.
2. O sistema identifica outra conta com o mesmo e-mail.
3. O sistema não realiza a recuperação.
4. O sistema informa que o e-mail está vinculado a outra conta.

### Prazo de recuperação expirado

1. O master tenta recuperar um usuário após 30 dias.
2. O sistema informa que o prazo de recuperação expirou.
3. O sistema não permite a recuperação.

## Regras de negócio

- Apenas usuários autenticados, ativos e master podem acessar o módulo.
- Usuários normais não devem visualizar o item **Usuários**.
- A listagem deve apresentar no máximo dez usuários por página.
- Usuários na lixeira não devem aparecer na listagem principal.
- O e-mail deve ser único entre os usuários que não foram excluídos.
- A senha atual nunca deve ser apresentada na edição.
- Uma nova senha deve ser protegida com `bcrypt` antes do armazenamento.
- Alterações de dados devem exigir confirmação.
- Exclusões devem exigir confirmação.
- A exclusão deve ser lógica durante os primeiros 30 dias.
- A recuperação somente pode ocorrer durante o prazo de 30 dias.
- A recuperação depende da disponibilidade do e-mail.
- Após 30 dias, o registro deve ser removido definitivamente.
- Um master não deve excluir a própria conta.
- O sistema deve impedir a exclusão ou remoção do último usuário master ativo.
- Todas as permissões devem ser validadas no backend.

## Requisitos de interface

- A tela deve possuir uma tabela responsiva.
- A tabela deve apresentar nome, e-mail, situação e opções.
- As opções devem incluir editar, excluir e aprovar, quando aplicável.
- As ações podem ser agrupadas em um menu em telas pequenas.
- A tela deve possuir acesso visível à lixeira.
- A ordenação por nome deve ser facilmente identificada.
- A paginação deve informar a página atual.
- As mensagens de confirmação devem informar claramente a ação realizada.
- A interface deve utilizar a abordagem Mobile First.
- A tela deve adaptar-se a celulares, tablets e computadores.

## Critérios de aceite

- [X] Apenas usuários autenticados, ativos e master acessam o módulo.
- [X] Usuários normais não visualizam o item **Usuários**.
- [X] A tabela apresenta nome, e-mail, situação e opções.
- [X] A tabela possui no máximo dez usuários por página.
- [X] A lista pode ser ordenada pelo nome.
- [X] O master consegue visualizar os detalhes de um usuário.
- [X] O master consegue editar os dados de um usuário.
- [X] A senha atual não é apresentada durante a edição.
- [X] Uma nova senha é armazenada utilizando `bcrypt`.
- [X] O sistema solicita confirmação antes da edição.
- [X] O master consegue aprovar um usuário pendente.
- [X] O master consegue rejeitar um usuário pendente.
- [X] O sistema solicita confirmação antes da exclusão.
- [X] Usuários excluídos são enviados para a lixeira.
- [X] Usuários excluídos permanecem na lixeira por 30 dias.
- [X] O master consegue recuperar um usuário dentro do prazo.
- [X] O sistema impede a recuperação quando o e-mail estiver em uso.
- [X] Após 30 dias, o usuário é excluído definitivamente.
- [X] O sistema impede que um master exclua a própria conta.
- [X] O sistema impede a exclusão do último master ativo.
- [X] A tabela funciona em mobile, tablet e desktop.

## Fora do escopo

- Cadastro manual de usuários pelo master;
- Importação de usuários por arquivo;
- Envio de notificações por e-mail;
- Histórico completo de alterações;
- Recuperação após a exclusão definitiva.