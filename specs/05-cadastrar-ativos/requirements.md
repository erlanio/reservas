# Requirements — Gerenciar Ativos

## Objetivo

Permitir o cadastro, a visualização, a edição, a exclusão e a recuperação de ativos e seus respectivos tipos.

## Contexto

Os ativos representam recursos que podem ser reservados, como:

- Laboratórios;
- Projetores;
- Caixas de som;
- Computadores;
- Salas;
- Outros recursos cadastrados.

Cada ativo deve pertencer obrigatoriamente a um tipo.

> **Exemplo:** o ativo `LAB1` pertence ao tipo `Laboratório`.

Apenas usuários autenticados, ativos e com nível `master` poderão acessar o módulo.

## Dados do ativo

O cadastro de um ativo deve possuir:

- Identificador;
- Descrição opcional;
- Tipo do ativo;
- Situação.

### Exemplo

- **Identificador:** `LAB1`;
- **Descrição:** Laboratório localizado no bloco A;
- **Tipo:** Laboratório;
- **Situação:** Ativo.

## Dados do tipo de ativo

O cadastro de um tipo de ativo deve possuir:

- Descrição.

### Exemplo

- Laboratório;
- Projetor;
- Caixa de som.

## Requisitos funcionais

### RF01 — Controlar o acesso

O sistema deve permitir o acesso ao módulo somente para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível de acesso `master`.

### RF02 — Exibir o menu de ativos

O dashboard deve possuir o item **Ativos** no menu lateral.

O item deve possuir submenus para:

- Todos os ativos;
- Tipos de ativos;
- Lixeira;
- Tipos cadastrados dinamicamente.

### RF03 — Filtrar pelo submenu de tipo

Ao selecionar um tipo no submenu, o sistema deve apresentar somente os ativos vinculados a ele.

> **Exemplo:** ao selecionar **Laboratórios**, o sistema deve apresentar `LAB1`, `LAB2` e os demais laboratórios cadastrados.

### RF04 — Listar ativos

O sistema deve apresentar os ativos em uma tabela com:

- Identificador;
- Descrição;
- Tipo;
- Situação;
- Opções.

### RF05 — Paginar ativos

Quando existirem mais de dez ativos, o sistema deve criar uma paginação com no máximo dez registros por página.

### RF06 — Ordenar ativos

O sistema deve permitir a ordenação por:

- Identificador;
- Tipo;
- Situação.

### RF07 — Cadastrar ativo

O usuário master deve poder cadastrar um ativo informando:

- Identificador;
- Descrição opcional;
- Tipo;
- Situação.

### RF08 — Garantir identificador único

O sistema não deve permitir dois ativos com o mesmo identificador.

A comparação deve ignorar diferenças entre letras maiúsculas e minúsculas.

> `LAB1`, `lab1` e `Lab1` devem ser considerados o mesmo identificador.

### RF09 — Editar ativo

O usuário master deve poder editar os dados de um ativo.

### RF10 — Confirmar edição

Antes de salvar a edição, o sistema deve apresentar uma mensagem de confirmação.

### RF11 — Excluir ativo

O usuário master deve poder excluir um ativo.

A exclusão deve ser lógica, mantendo o registro na lixeira por 30 dias.

### RF12 — Confirmar exclusão

Antes de enviar um ativo para a lixeira, o sistema deve apresentar uma mensagem de confirmação.

### RF13 — Listar ativos excluídos

A lixeira deve apresentar:

- Identificador;
- Descrição;
- Tipo;
- Data da exclusão;
- Data prevista para exclusão definitiva;
- Opção para recuperar.

### RF14 — Recuperar ativo

O usuário master deve poder recuperar um ativo durante o período de 30 dias.

### RF15 — Validar identificador na recuperação

Antes da recuperação, o sistema deve verificar se existe outro ativo com o mesmo identificador.

Se o identificador estiver em uso, o sistema não deve recuperar o ativo.

### RF16 — Excluir ativo definitivamente

Após 30 dias na lixeira, o ativo deve ser excluído definitivamente.

### RF17 — Gerenciar tipos de ativos

O usuário master deve poder:

- Cadastrar tipos;
- Visualizar tipos;
- Editar tipos;
- Excluir tipos.

### RF18 — Acessar tipos pelo formulário

Ao lado do campo **Tipo**, no formulário de ativo, deve existir um botão **+**.

Ao selecionar esse botão, o sistema deve abrir o gerenciamento dos tipos de ativos sem perder os dados já preenchidos no formulário.

### RF19 — Cadastrar tipo

O sistema deve permitir o cadastro de um tipo informando apenas sua descrição.

### RF20 — Garantir descrição única

O sistema não deve permitir dois tipos com a mesma descrição.

A comparação deve ignorar diferenças entre letras maiúsculas, minúsculas e espaços excedentes.

> `Laboratório`, `laboratório` e ` Laboratório ` devem ser considerados o mesmo tipo.

### RF21 — Editar tipo

O usuário master deve poder alterar a descrição de um tipo.

### RF22 — Excluir tipo

O usuário master deve poder excluir um tipo que não esteja relacionado a ativos.

Se existirem ativos relacionados, o sistema deve impedir a exclusão e informar que eles precisam ser excluídos ou transferidos para outro tipo.

### RF23 — Atualizar os tipos no formulário

Após cadastrar ou editar um tipo, o sistema deve atualizar automaticamente o campo **Tipo** do formulário de ativo.

### RF24 — Limitar a quantidade de interações

As ações de cadastrar, editar ou excluir um ativo devem ser concluídas com no máximo cinco cliques, desconsiderando a digitação dos dados.

## Fluxo de cadastro de ativo

1. O usuário master acessa o módulo **Ativos**.
2. O usuário seleciona **Cadastrar ativo**.
3. O sistema apresenta o formulário.
4. O usuário informa o identificador, a descrição, o tipo e a situação.
5. O sistema valida os dados.
6. O sistema verifica se o identificador está disponível.
7. O usuário confirma o cadastro.
8. O sistema salva o ativo.
9. O sistema atualiza a tabela.

## Fluxo de cadastro de tipo pelo formulário

1. O usuário está preenchendo o formulário de ativo.
2. O usuário seleciona o botão **+** ao lado do campo **Tipo**.
3. O sistema abre o gerenciamento de tipos.
4. O usuário informa a descrição do novo tipo.
5. O sistema verifica se a descrição está disponível.
6. O sistema salva o tipo.
7. O sistema fecha o gerenciamento de tipos.
8. O sistema atualiza o campo **Tipo**.
9. O novo tipo fica selecionado no formulário.
10. Os dados já preenchidos no ativo são mantidos.

## Fluxo de edição de ativo

1. O usuário seleciona a opção **Editar**.
2. O sistema apresenta o formulário preenchido.
3. O usuário altera os dados.
4. O sistema valida as alterações.
5. O sistema apresenta uma mensagem de confirmação.
6. O usuário confirma a edição.
7. O sistema salva as alterações.
8. O sistema atualiza a tabela.

## Fluxo de exclusão de ativo

1. O usuário seleciona a opção **Excluir**.
2. O sistema apresenta uma mensagem de confirmação.
3. O usuário confirma a exclusão.
4. O sistema registra a data da exclusão.
5. O sistema envia o ativo para a lixeira.
6. O sistema informa que o ativo permanecerá na lixeira por 30 dias.
7. O sistema atualiza a tabela.

## Fluxo de recuperação de ativo

1. O usuário acessa a lixeira.
2. O sistema apresenta os ativos excluídos.
3. O usuário seleciona a opção **Recuperar**.
4. O sistema verifica se o prazo de recuperação está válido.
5. O sistema verifica se o identificador está disponível.
6. O sistema solicita confirmação.
7. O usuário confirma a recuperação.
8. O sistema restaura o ativo.
9. O sistema atualiza a tabela e a lixeira.

## Fluxos alternativos

### Identificador duplicado

1. O usuário informa um identificador já cadastrado.
2. O sistema não salva o ativo.
3. O sistema informa que o identificador já está em uso.

### Descrição de tipo duplicada

1. O usuário informa uma descrição de tipo já cadastrada.
2. O sistema não salva o tipo.
3. O sistema informa que o tipo já existe.

### Tipo relacionado a ativos

1. O usuário tenta excluir um tipo.
2. O sistema identifica ativos vinculados ao tipo.
3. O sistema não realiza a exclusão.
4. O sistema informa quantos ativos estão vinculados.
5. O sistema orienta o usuário a transferir ou excluir os ativos.

### Identificador indisponível na recuperação

1. O usuário tenta recuperar um ativo.
2. O sistema identifica outro ativo com o mesmo identificador.
3. O sistema não realiza a recuperação.
4. O sistema informa que o identificador está em uso.

### Prazo de recuperação expirado

1. O usuário tenta recuperar um ativo após 30 dias.
2. O sistema informa que o prazo expirou.
3. O sistema não permite a recuperação.

## Regras de negócio

- Apenas usuários autenticados, ativos e master podem gerenciar ativos e tipos.
- Todo ativo deve possuir um tipo.
- A descrição do ativo é opcional.
- O identificador do ativo é obrigatório e único.
- A descrição do tipo é obrigatória e única.
- Identificadores e tipos devem ser comparados sem diferenciar letras maiúsculas e minúsculas.
- Ativos excluídos não devem aparecer na listagem principal.
- Ativos excluídos devem permanecer na lixeira por 30 dias.
- A recuperação depende da disponibilidade do identificador.
- Após 30 dias, o ativo deve ser excluído definitivamente.
- Um tipo relacionado a ativos não pode ser excluído.
- A edição e a exclusão de ativos devem exigir confirmação.
- A exclusão de tipos deve exigir confirmação.
- As permissões devem ser verificadas no backend.
- As operações principais devem exigir no máximo cinco cliques.

## Requisitos de interface

- O módulo deve manter as cores e a tipografia da tela de usuários.
- A tabela deve seguir o mesmo padrão visual do gerenciamento de usuários.
- O menu lateral deve possuir o item **Ativos** e seus submenus.
- O formulário deve possuir um botão **+** ao lado do campo **Tipo**.
- O gerenciamento de tipos pode ser aberto em uma janela modal ou painel lateral.
- Os dados preenchidos no formulário não podem ser perdidos ao gerenciar tipos.
- As ações devem possuir ícones e descrições.
- As mensagens de confirmação devem informar claramente a ação.
- A interface deve utilizar a abordagem Mobile First.

## Responsividade

- A tela deve adaptar-se a celulares, tablets e computadores.
- A tabela deve ser responsiva.
- Em telas pequenas, a tabela poderá utilizar rolagem horizontal.
- As ações podem ser agrupadas em um menu no mobile.
- Os formulários devem utilizar uma coluna em telas pequenas.
- Os botões devem ser adequados para interação por toque.
- A paginação deve adaptar-se à largura disponível.
- O menu e os submenus devem funcionar em dispositivos móveis.

## Critérios de aceite

- [X] Apenas usuários autenticados, ativos e master acessam o módulo.
- [X] O sistema permite cadastrar, visualizar, editar e excluir ativos.
- [X] Todo ativo possui um tipo.
- [X] O sistema impede identificadores duplicados.
- [X] O sistema permite gerenciar os tipos de ativos.
- [X] O sistema impede descrições de tipos duplicadas.
- [X] O botão **+** abre o gerenciamento de tipos pelo formulário.
- [X] Os dados do formulário são mantidos ao gerenciar tipos.
- [X] Um tipo relacionado a ativos não pode ser excluído.
- [X] A tabela pode ser filtrada pelo tipo de ativo.
- [X] A tabela mantém as cores e a tipografia do módulo de usuários.
- [X] A edição exige confirmação.
- [X] A exclusão exige confirmação.
- [X] Ativos excluídos permanecem na lixeira por 30 dias.
- [X] O sistema permite recuperar um ativo dentro do prazo.
- [X] O sistema impede a recuperação quando o identificador está em uso.
- [X] Ativos são excluídos definitivamente após 30 dias.
- [X] Cadastrar, editar ou excluir um ativo exige no máximo cinco cliques.
- [X] A interface funciona em mobile, tablet e desktop.

## Fora do escopo

- Reserva de ativos;
- Controle de disponibilidade por horário;
- Manutenção preventiva de ativos;
- Histórico completo de alterações;
- Importação de ativos por arquivo;
- Anexos e imagens dos ativos.