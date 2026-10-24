# Requirements — Gerenciar Reservas

## Objetivo

Ajustar o módulo de reservas para organizar os ativos por tipo, facilitar a visualização e impedir reservas em datas ou tempos indisponíveis.

## Contexto

Usuários autenticados e ativos poderão realizar e visualizar reservas.

Na parte superior da tela, o usuário poderá alternar entre:

- **Fazer reserva**;
- **Visualizar reservas**.

## Requisitos funcionais

### RF01 — Controlar o acesso

O módulo deve estar disponível somente para usuários autenticados e com cadastro ativo.

### RF02 — Selecionar o modo da tela

O sistema deve apresentar, na parte superior, as opções:

- **Fazer reserva**;
- **Visualizar reservas**.

A opção selecionada deve possuir destaque visual.

### RF03 — Selecionar a data

O usuário deve selecionar a data da reserva.

O sistema deve definir a data atual como padrão.

### RF04 — Impedir datas anteriores

O sistema não deve permitir reservas em datas anteriores à data atual.

Essa validação deve ocorrer no frontend e no backend.

### RF05 — Organizar ativos por tipo

Na opção **Fazer reserva**, os tipos de ativos devem ser apresentados em abas.

Ao selecionar um tipo, o sistema deve apresentar apenas os ativos pertencentes a ele.

### RF06 — Selecionar ativos

O usuário deve selecionar um ou mais ativos do tipo escolhido.

Ativos inativos, excluídos ou em manutenção não devem ser apresentados como disponíveis.

### RF07 — Carregar tempos disponíveis

Após selecionar a data e os ativos, o sistema deve consultar os tempos disponíveis.

### RF08 — Ocultar tempos indisponíveis

Na opção **Fazer reserva**, o sistema deve apresentar somente os tempos disponíveis para todos os ativos selecionados.

Reservas com situação `ativa` ou `pendente` devem tornar o tempo indisponível.

Reservas canceladas ou rejeitadas não devem bloquear o tempo.

### RF09 — Selecionar múltiplos tempos

O usuário deve poder selecionar um ou mais tempos disponíveis.

### RF10 — Posicionar o botão Reservar

O botão **Reservar** deve ficar logo abaixo da seleção dos ativos e tempos.

O botão deve permanecer desabilitado enquanto os dados obrigatórios não forem preenchidos.

### RF11 — Verificar a disponibilidade

Antes de salvar, o sistema deve verificar novamente a disponibilidade de todas as combinações de ativo, data e tempo.

### RF12 — Impedir conflitos

O sistema não deve permitir duas reservas ativas ou pendentes para o mesmo ativo, data e tempo.

### RF13 — Criar reservas individuais

Quando forem selecionados múltiplos ativos e tempos, o sistema deve criar uma reserva individual para cada combinação.

### RF14 — Organizar a visualização por tipo

Na opção **Visualizar reservas**, os tipos de ativos devem ser apresentados em abas.

### RF15 — Selecionar o ativo na visualização

Após escolher um tipo, o usuário deve selecionar um ativo específico.

### RF16 — Exibir a agenda

Após selecionar a data e o ativo, o sistema deve apresentar todos os tempos e suas situações:

- Livre;
- Reservado;
- Pendente;
- Indisponível.

### RF17 — Exibir os detalhes

Ao selecionar um tempo reservado, o sistema deve apresentar:

- Responsável;
- Ativo;
- Data;
- Horário inicial;
- Horário final;
- Finalidade;
- Situação.

### RF18 — Atualizar a tela

O sistema deve atualizar os tempos e as reservas após cadastrar, editar ou cancelar uma reserva.

A atualização deve ocorrer sem recarregar toda a página.

## Fluxo para fazer uma reserva

1. O usuário acessa o módulo **Reservas**.
2. O usuário seleciona **Fazer reserva**.
3. O usuário seleciona uma data igual ou posterior à data atual.
4. O usuário seleciona uma aba de tipo de ativo.
5. O sistema apresenta os ativos do tipo selecionado.
6. O usuário seleciona um ou mais ativos.
7. O sistema apresenta somente os tempos disponíveis.
8. O usuário seleciona um ou mais tempos.
9. O usuário informa os dados obrigatórios.
10. O usuário seleciona **Reservar**.
11. O sistema verifica novamente a disponibilidade.
12. O sistema registra as reservas.
13. O sistema apresenta uma mensagem de confirmação.
14. O sistema atualiza os tempos disponíveis.

## Fluxo para visualizar reservas

1. O usuário seleciona **Visualizar reservas**.
2. O sistema apresenta a data atual.
3. O usuário seleciona uma data.
4. O usuário seleciona uma aba de tipo de ativo.
5. O sistema apresenta os ativos do tipo.
6. O usuário seleciona um ativo.
7. O sistema apresenta todos os tempos e suas situações.
8. O usuário seleciona uma reserva para visualizar seus detalhes.

## Fluxos alternativos

### Data anterior à atual

1. O usuário seleciona uma data anterior à atual.
2. O sistema impede a operação.
3. O sistema informa: **“Não é possível realizar reservas em datas anteriores à data atual.”**

### Tipo sem ativos

1. O usuário seleciona um tipo sem ativos disponíveis.
2. O sistema informa: **“Não existem ativos disponíveis para este tipo.”**

### Ativo sem tempos disponíveis

1. O usuário seleciona uma data e um ativo.
2. O sistema identifica que todos os tempos estão ocupados.
3. O sistema informa: **“Não existem tempos disponíveis para este ativo na data selecionada.”**
4. O botão **Reservar** permanece desabilitado.

### Horário ocupado durante a confirmação

1. O usuário seleciona um tempo disponível.
2. Outro usuário reserva o mesmo tempo antes da confirmação.
3. O sistema identifica o conflito.
4. O sistema não registra nenhuma reserva da solicitação.
5. O sistema informa que a disponibilidade foi alterada.
6. O sistema atualiza os tempos.

## Regras de negócio

- A data da reserva deve ser igual ou posterior à data atual.
- Todo ativo deve pertencer a um tipo.
- A seleção do tipo deve ocorrer antes da seleção dos ativos.
- A seleção dos ativos deve ocorrer antes da seleção dos tempos.
- Pelo menos um ativo e um tempo devem ser selecionados.
- Na criação da reserva, somente tempos disponíveis devem ser apresentados.
- Na visualização, todos os tempos devem ser apresentados com suas situações.
- Reservas ativas ou pendentes devem bloquear o tempo.
- Reservas canceladas ou rejeitadas não devem bloquear o tempo.
- A disponibilidade deve ser verificada novamente pelo backend.
- O cadastro de múltiplas combinações deve ocorrer em uma transação.
- Se uma combinação estiver indisponível, nenhuma reserva da solicitação deve ser salva.
- A data atual deve considerar o fuso horário configurado para o sistema.

## Requisitos de interface

- As opções **Fazer reserva** e **Visualizar reservas** devem ficar na parte superior.
- Os tipos de ativos devem ser apresentados em abas.
- A aba selecionada deve possuir destaque visual.
- Os ativos devem ser exibidos após a seleção do tipo.
- Os tempos devem ser exibidos após a seleção da data e dos ativos.
- O botão **Reservar** deve ficar abaixo dos ativos e tempos.
- A tela deve apresentar um indicador durante o carregamento.
- A interface deve utilizar a abordagem Mobile First.
- A tela deve adaptar-se a celulares, tablets e computadores.

## Critérios de aceite

- [X] Apenas usuários autenticados e ativos acessam o módulo.
- [X] O usuário pode alternar entre **Fazer reserva** e **Visualizar reservas**.
- [X] O sistema impede reservas em datas anteriores à atual.
- [X] Os tipos de ativos são apresentados em abas.
- [X] Os ativos são apresentados conforme o tipo selecionado.
- [X] Tempos ocupados não aparecem como disponíveis na criação da reserva.
- [X] O usuário pode selecionar múltiplos ativos e tempos.
- [X] O botão **Reservar** fica abaixo da seleção de ativos e tempos.
- [X] O sistema verifica novamente a disponibilidade antes de salvar.
- [X] O sistema impede reservas conflitantes.
- [X] A visualização permite escolher o tipo e o ativo.
- [X] A agenda apresenta todos os tempos e suas situações.
- [X] A interface funciona em mobile, tablet e desktop.

## Fora do escopo

- Reservas recorrentes;
- Lista de espera;
- Notificações por e-mail ou SMS;
- Integração com calendários externos;
- Cobrança pela utilização dos ativos.