# Requirements — Desativar ativos

## Objetivo

Permitir que usuários com perfil **master** desativem temporária ou permanentemente um ativo quando ele estiver indisponível para reserva, seja por defeito, manutenção, reforma ou outro impedimento.

## Requisitos funcionais

- Apenas usuários master poderão desativar ou reativar ativos.
- O usuário deverá informar o motivo da desativação.
- Os motivos disponíveis deverão incluir:
  - Defeito;
  - Manutenção;
  - Reforma;
  - Outro.
- Ao selecionar “Outro”, o preenchimento de uma descrição será obrigatório.
- O sistema deverá registrar a data, a hora e o usuário responsável pela desativação.
- Um ativo desativado não poderá ser selecionado em novas reservas.
- O sistema deverá identificar reservas futuras vinculadas ao ativo antes de confirmar a desativação.
- Caso existam reservas futuras, o usuário master deverá ser alertado.
- Caso o usuário confirme a desativação, as reservas futuras vinculadas ao ativo deverão ser canceladas.
- O ativo deverá permanecer no sistema com o status **Desativado**, preservando seu histórico.
- O usuário master poderá reativar o ativo quando ele voltar a ficar disponível.
- A desativação e a reativação deverão ser registradas no histórico do ativo.

## Regras de negócio

- A desativação não deverá excluir o ativo nem seus registros anteriores.
- Reservas já concluídas deverão permanecer inalteradas.
- O sistema não deverá permitir novas reservas durante o período de desativação.
- O motivo da desativação será obrigatório.
- A reativação deverá tornar o ativo novamente disponível para novas reservas.
- Ao reativar um ativo, as reservas futuras que foram canceladas pela desativação desse ativo deverão retornar.
- Usuários comuns poderão visualizar que o ativo está indisponível, mas não poderão alterar seu status.

## Critérios de aceitação

### Desativar ativo sem reservas futuras

**Dado que** o usuário master esteja autenticado  
**E** o ativo esteja ativo e sem reservas futuras  
**Quando** informar o motivo e confirmar a desativação  
**Então** o sistema deverá alterar o status para **Desativado**  
**E** impedir novas reservas para esse ativo.

### Desativar ativo com reservas futuras

**Dado que** o ativo possua reservas futuras  
**Quando** o usuário master solicitar sua desativação  
**Então** o sistema deverá exibir um alerta informando a existência dessas reservas  
**E** solicitar uma confirmação antes de concluir a operação  
**E** cancelar as reservas futuras ao confirmar a desativação.

### Tentativa realizada por usuário comum

**Dado que** um usuário comum esteja autenticado  
**Quando** acessar os dados de um ativo  
**Então** a opção de desativação não deverá estar disponível.

### Reativar ativo

**Dado que** o ativo esteja desativado  
**Quando** o usuário master confirmar sua reativação  
**Então** o sistema deverá alterar o status para **Ativo**  
**E** disponibilizá-lo novamente para novas reservas  
**E** restaurar as reservas futuras canceladas pela desativação desse ativo.
