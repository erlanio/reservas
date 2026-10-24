# Requirements — Notificações de usuários

## Objetivo

Permitir que os usuários sejam notificados quando seu cadastro for validado e quando uma reserva for realizada, aprovada, alterada ou cancelada.

## Requisitos funcionais

- O sistema deverá enviar uma notificação ao usuário quando seu cadastro for aprovado por um usuário master.
- O sistema deverá enviar uma notificação ao usuário quando seu cadastro for rejeitado.
- Em caso de rejeição, a notificação deverá apresentar o motivo informado pelo usuário master.
- O sistema deverá notificar o usuário quando uma nova reserva for realizada em seu nome.
- O sistema deverá notificar o usuário quando uma reserva for aprovada.
- O sistema deverá notificar o usuário quando uma reserva for alterada.
- O sistema deverá notificar o usuário quando uma reserva for cancelada.
- A notificação de cancelamento deverá identificar quem realizou o cancelamento.
- O sistema deverá apresentar uma área de notificações no cabeçalho ou menu principal.
- O sistema deverá exibir a quantidade de notificações não lidas.
- O usuário deverá conseguir visualizar a lista de notificações.
- O usuário deverá conseguir marcar uma notificação como lida.
- O usuário deverá conseguir marcar todas as notificações como lidas.
- Cada notificação deverá apresentar:
  - Título;
  - Mensagem;
  - Tipo da notificação;
  - Data e hora;
  - Situação de leitura;
  - Link para o registro relacionado, quando aplicável.
- As notificações deverão ser ordenadas da mais recente para a mais antiga.
- O sistema deverá atualizar a quantidade de notificações não lidas após a leitura.

## Tipos de notificação

O sistema deverá permitir os seguintes tipos:

- `cadastro_aprovado`;
- `cadastro_rejeitado`;
- `reserva_realizada`;
- `reserva_aprovada`;
- `reserva_alterada`;
- `reserva_cancelada`.

## Regras de negócio

- Cada notificação deverá pertencer a um único usuário destinatário.
- O usuário somente poderá visualizar suas próprias notificações.
- Usuários master não poderão acessar notificações pessoais de outros usuários.
- A aprovação ou rejeição de um cadastro deverá gerar apenas uma notificação.
- A criação de uma reserva deverá gerar uma notificação para o usuário responsável pela reserva.
- A aprovação de uma reserva deverá gerar uma notificação para o usuário que a solicitou.
- A alteração de uma reserva deverá gerar uma notificação quando modificar informações relevantes.
- O cancelamento de uma reserva deverá gerar uma notificação para o usuário que a solicitou.
- A notificação deverá identificar a reserva relacionada, quando aplicável.
- As notificações não deverão ser excluídas automaticamente após a leitura.
- A falha no envio da notificação não deverá impedir a conclusão da operação principal.
- O sistema deverá evitar notificações duplicadas para o mesmo evento.
- A data e a hora deverão ser registradas automaticamente pelo sistema.

## Conteúdo das notificações

### Cadastro aprovado

A notificação deverá informar que o cadastro do usuário foi validado e que seu acesso ao sistema está liberado.

### Cadastro rejeitado

A notificação deverá informar que o cadastro não foi aprovado e apresentar o motivo da rejeição.

### Reserva realizada

A notificação deverá informar:

- Identificação da reserva;
- Ativo reservado;
- Data e horário;
- Situação atual da reserva.

### Reserva aprovada

A notificação deverá informar que a reserva foi aprovada e apresentar seus dados principais.

### Reserva alterada

A notificação deverá informar:

- Identificação da reserva;
- Informações alteradas;
- Data e horário atualizados, quando aplicável;
- Usuário responsável pela alteração.

### Reserva cancelada

A notificação deverá informar:

- Identificação da reserva;
- Ativo relacionado;
- Data e horário originalmente reservados;
- Responsável pelo cancelamento;
- Motivo do cancelamento, quando informado.

## Critérios de aceitação

### Notificar cadastro aprovado

**Dado que** um usuário esteja aguardando validação  
**Quando** um usuário master aprovar seu cadastro  
**Então** o sistema deverá criar uma notificação de cadastro aprovado  
**E** disponibilizá-la para o usuário.

### Notificar cadastro rejeitado

**Dado que** um usuário esteja aguardando validação  
**Quando** um usuário master rejeitar seu cadastro  
**Então** o sistema deverá criar uma notificação de cadastro rejeitado  
**E** apresentar o motivo da rejeição.

### Notificar reserva realizada

**Dado que** uma nova reserva tenha sido cadastrada  
**Quando** a operação for concluída com sucesso  
**Então** o sistema deverá criar uma notificação para o usuário responsável  
**E** apresentar os dados principais da reserva.

### Notificar reserva aprovada

**Dado que** uma reserva esteja aguardando aprovação  
**Quando** um usuário master aprovar a reserva  
**Então** o usuário solicitante deverá receber uma notificação  
**E** a notificação deverá identificar a reserva aprovada.

### Notificar reserva alterada

**Dado que** exista uma reserva cadastrada  
**Quando** suas informações relevantes forem alteradas  
**Então** o sistema deverá notificar o usuário responsável pela reserva  
**E** informar quais dados foram modificados.

### Notificar reserva cancelada

**Dado que** exista uma reserva cadastrada  
**Quando** ela for cancelada  
**Então** o sistema deverá notificar o usuário responsável  
**E** informar os dados da reserva e o responsável pelo cancelamento.

### Visualizar notificações

**Dado que** o usuário esteja autenticado  
**Quando** acessar a área de notificações  
**Então** o sistema deverá apresentar somente suas notificações  
**E** ordená-las da mais recente para a mais antiga.

### Marcar notificação como lida

**Dado que** o usuário possua uma notificação não lida  
**Quando** abrir ou marcar a notificação como lida  
**Então** o sistema deverá atualizar sua situação  
**E** reduzir a quantidade de notificações não lidas.

### Impedir acesso indevido

**Dado que** um usuário esteja autenticado  
**Quando** tentar acessar uma notificação pertencente a outro usuário  
**Então** o sistema deverá negar o acesso.