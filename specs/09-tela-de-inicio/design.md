# Design - Gerenciar reservas

## Visão geral da solução
O módulo de reservas permitirá cadastrar, visualizar, editar e excluir reservas de ativos.

A tela inicial do dashboard priorizará a visualização das reservas do dia e da disponibilidade dos ativos. Também será possível realizar uma reserva rápida diretamente pelo dashboard.

## Dados utilizados

A implementação deve seguir os requisitos definidos em:

`09-tela-de-inicio/requirements.md`

## Dados da reserva

- Usuário responsável;
- Tipo de ativo;
- Ativo selecionado;
- Data;
- Horário inicial;
- Horário final;

Cada reserva deverá utilizar, no mínimo, os seguintes dados:


Após o login, o dashboard deverá apresentar as reservas do dia.

## Dashboard

Após o login, o dashboard deve apresentar as reservas do dia.

O usuário deve poder:

- Selecionar uma data;
- Selecionar um tipo de ativo;
- Selecionar um ativo específico;
- Visualizar todos os horários do ativo;
- Identificar horários livres, reservados;
- Visualizar o responsável pela reserva;
- Consultar os detalhes da reserva;
- Fazer uma reserva rápida em um horário livre.


## Fluxo de visualização

1. O usuário realiza o login.
2. O sistema apresenta o dashboard com as reservas do dia.
3. O usuário seleciona um tipo de ativo.
4. O sistema apresenta os ativos desse tipo.
5. O usuário seleciona um ativo.
6. O sistema apresenta todos os horários do ativo.
7. O usuário visualiza os horários livres e reservados.
8. O usuário pode consultar os detalhes de uma reserva.

## Fluxo de reserva rápida

1. O usuário seleciona um horário livre no dashboard.
2. O sistema abre um formulário simplificado.
3. O sistema preenche a data, o ativo, o usuário e o horário.
4. O usuário informa a finalidade e os demais dados obrigatórios.
5. O sistema verifica a disponibilidade do horário.
6. O sistema registra a reserva.
7. O sistema atualiza a agenda automaticamente.

## Fluxo de gerenciamento

Os usuários dos tipos **master** e **normal** poderão:

- Cadastrar reservas;
- Visualizar reservas;
- Editar reservas;
- Excluir reservas.

As ações devem respeitar as permissões definidas para cada perfil.

## Validações

- O horário final deve ser posterior ao horário inicial.
- Um ativo não pode possuir duas reservas no mesmo período.
- Ativos inativos, bloqueados ou em manutenção não podem ser reservados.
- Horários passados não podem aceitar novas reservas.
- O sistema deve verificar a disponibilidade antes de salvar.
- Os campos obrigatórios devem ser validados no frontend e no backend.
- A exclusão deve solicitar confirmação.

## Decisões técnicas

- **Banco de dados:** MySQL;
- **Frontend:** HTML, CSS e JavaScript;
- **Backend:** Node.js;
- **Comunicação:** API REST com JSON;
- **Abordagem:** Mobile First.

## Responsividade

- A interface deve adaptar-se a mobile, tablet e desktop.
- O menu lateral deve ser recolhível no mobile.
- As tabelas devem ser responsivas.
- As tabelas podem utilizar rolagem horizontal em telas pequenas.
- Os filtros devem ser reorganizados verticalmente no mobile.
- Botões e campos devem ser adequados para interação por toque.
- A linha do tempo deve adaptar-se à largura da tela.

## Atualização dinâmica

Após cadastrar, editar ou excluir uma reserva, o sistema deve atualizar automaticamente:

- A lista de reservas;
- A linha do tempo do ativo;
- Os horários disponíveis;
- Os indicadores do dashboard.

A atualização deve ocorrer sem recarregar toda a página.