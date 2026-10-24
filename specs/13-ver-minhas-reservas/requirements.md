# Requirements — Visualizar minhas reservas

## Objetivo

Permitir que usuários autenticados visualizem, de maneira clara e objetiva, apenas as reservas vinculadas à sua conta.

## Requisitos funcionais

- O sistema deverá disponibilizar a opção `Minhas reservas` no menu principal.
- O usuário deverá estar autenticado para acessar a funcionalidade.
- O sistema deverá apresentar somente as reservas pertencentes ao usuário autenticado.
- A tela deverá apresentar por padrão as reservas aceitas a partir do dia atual, sem data final definida.
- A listagem deverá ser ordenada da data de reserva mais antiga para a mais recente.
- Cada reserva deverá apresentar:
  - Identificação da reserva;
  - Nome do ativo;
  - Categoria do ativo;
  - Data da reserva;
  - Horário de início;
  - Horário de término;
  - Finalidade;
  - Situação atual;
  - Data de criação.
- O usuário deverá conseguir visualizar os detalhes de uma reserva.
- O usuário deverá conseguir filtrar as reservas por situação.
- O usuário deverá conseguir filtrar as reservas por período.
- O usuário deverá conseguir pesquisar pelo nome ou identificação do ativo.
- O sistema deverá permitir a combinação dos filtros disponíveis.
- O usuário deverá conseguir limpar todos os filtros aplicados.
- O sistema deverá apresentar a quantidade de reservas encontradas.
- A listagem deverá possuir paginação ou carregamento progressivo.
- O sistema deverá exibir uma mensagem quando o usuário não possuir reservas.
- O sistema deverá exibir uma mensagem quando nenhuma reserva corresponder aos filtros aplicados.

## Situações da reserva

A funcionalidade deverá considerar, conforme as regras existentes no sistema, as seguintes situações:

- `aceita`;
- `concluida`;
- `cancelada`.

Cada situação deverá possuir uma identificação visual e textual.

Como as reservas do sistema são aceitas automaticamente, novas reservas entram como `aceita`. A situação `concluida` é calculada pela data e horário da reserva, e `cancelada` é definida pelo cancelamento registrado.

## Filtros

A tela deverá permitir os seguintes filtros:

- Situação da reserva;
- Data inicial;
- Data final;
- Nome ou identificação do ativo.

Os filtros deverão considerar exclusivamente as reservas do usuário autenticado.

## Detalhes da reserva

Ao selecionar uma reserva, o sistema deverá apresentar:

- Número ou identificação da reserva;
- Nome e identificação do ativo;
- Categoria do ativo;
- Descrição do ativo;
- Data da reserva;
- Horário de início;
- Horário de término;
- Finalidade da utilização;
- Observações;
- Situação atual;
- Motivo do cancelamento ou rejeição, quando aplicável;
- Data e hora da criação;
- Data e hora da última alteração.

## Regras de negócio

- Cada usuário poderá visualizar somente suas próprias reservas.
- O usuário não poderá acessar reservas de outras pessoas pela interface ou diretamente pela API.
- A identificação do usuário deverá ser obtida por meio da sessão ou token de autenticação.
- O backend não deverá confiar em um `usuario_id` enviado pelo frontend.
- Reservas canceladas e concluídas deverão permanecer disponíveis no histórico.
- As reservas não deverão ser excluídas da listagem após seu encerramento.
- Os filtros não poderão permitir acesso a reservas de outros usuários.
- A visualização de uma reserva não deverá modificar sua situação.
- As informações apresentadas deverão refletir os dados mais recentes registrados no sistema.
- As ações disponíveis deverão respeitar a situação da reserva e as permissões do usuário.
- Reservas aceitas poderão ser canceladas pelo próprio usuário, mediante confirmação, e deverão permanecer no histórico com a situação `Cancelada`.

## Ordenação

A listagem deverá apresentar as reservas em ordem fixa:

- Data da reserva em ordem crescente, usando horário e id como desempate.

## Interface

- A tela deverá apresentar o título `Minhas reservas`.
- As reservas deverão ser exibidas em uma tabela responsiva ou em cartões.
- A situação deverá ser apresentada por meio de texto, cor e indicador visual.
- A interface deverá destacar reservas aceitas do dia.
- Reservas canceladas e concluídas deverão possuir apresentação visual diferenciada.
- Os filtros deverão ser fáceis de acessar e limpar.
- Os elementos interativos deverão possuir áreas de toque adequadas.
- A interface deverá ser adaptada para smartphones, tablets e desktops.

## Segurança

- O acesso à funcionalidade deverá exigir autenticação.
- O backend deverá filtrar as reservas pelo identificador do usuário autenticado.
- O sistema deverá impedir a alteração do identificador do proprietário da reserva.
- O sistema deverá negar o acesso direto a reservas de outros usuários.
- O endpoint de cancelamento deverá validar que a reserva pertence ao usuário autenticado.
- Todas as consultas ao banco deverão ser parametrizadas.
- Os dados informados nos filtros deverão ser validados e sanitizados.
- O sistema não deverá expor informações pessoais de outros usuários.

## Critérios de aceitação

### Visualizar as próprias reservas

**Dado que** o usuário esteja autenticado  
**E** possua reservas cadastradas  
**Quando** acessar a opção `Minhas reservas`  
**Então** o sistema deverá apresentar somente as reservas vinculadas à sua conta.

### Usuário sem reservas

**Dado que** o usuário esteja autenticado  
**E** não possua reservas cadastradas  
**Quando** acessar a opção `Minhas reservas`  
**Então** o sistema deverá exibir uma mensagem informando que nenhuma reserva foi encontrada.

### Filtrar por situação

**Dado que** o usuário possua reservas com diferentes situações  
**Quando** selecionar uma situação  
**Então** o sistema deverá apresentar somente suas reservas que correspondam ao filtro.

### Filtrar por período

**Dado que** o usuário possua reservas em diferentes datas  
**Quando** informar uma data inicial e uma data final  
**Então** o sistema deverá apresentar somente suas reservas dentro do período informado.

### Pesquisar por ativo

**Dado que** o usuário possua diferentes reservas  
**Quando** pesquisar pelo nome ou identificação de um ativo  
**Então** o sistema deverá apresentar somente suas reservas relacionadas ao termo pesquisado.

### Combinar filtros

**Dado que** o usuário esteja na tela `Minhas reservas`  
**Quando** aplicar mais de um filtro  
**Então** o sistema deverá apresentar somente as reservas que atendam a todos os critérios informados.

### Visualizar detalhes

**Dado que** o usuário esteja visualizando suas reservas  
**Quando** selecionar uma reserva  
**Então** o sistema deverá apresentar todos os detalhes permitidos sobre ela.

### Tentar acessar reserva de outro usuário

**Dado que** o usuário esteja autenticado  
**Quando** tentar acessar diretamente uma reserva pertencente a outro usuário  
**Então** o sistema deverá negar o acesso  
**E** não deverá exibir informações da reserva.

### Manter histórico

**Dado que** o usuário possua reservas concluídas ou canceladas  
**Quando** acessar `Minhas reservas`  
**Então** essas reservas deverão continuar disponíveis para consulta.

### Responsividade

**Dado que** o usuário acesse a funcionalidade por um dispositivo móvel, tablet ou computador  
**Quando** visualizar suas reservas  
**Então** a interface deverá adaptar-se ao tamanho da tela  
**E** preservar a legibilidade e a utilização dos controles.
