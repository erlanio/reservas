# Requirements — Notificação de Usuários Pendentes

## Objetivo

Permitir que usuários master sejam notificados no dashboard quando existirem usuários cadastrados aguardando aprovação.

## Contexto

Após realizar o login, o usuário master deve visualizar no dashboard uma notificação informando a existência de cadastros pendentes.

A notificação deve permitir o acesso rápido à tela de gerenciamento de usuários.

Usuários normais não devem visualizar informações sobre cadastros pendentes.

## Requisitos funcionais

### RF01 — Controlar o acesso

A notificação deve ser apresentada somente para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível de acesso `master`.

### RF02 — Consultar usuários pendentes

Ao carregar o dashboard, o sistema deve consultar a quantidade de usuários com situação `pendente`.

### RF03 — Exibir a notificação

Quando existir pelo menos um usuário pendente, o sistema deve apresentar uma notificação no dashboard.

### RF04 — Exibir a quantidade

A notificação deve informar a quantidade total de usuários aguardando aprovação.

### RF05 — Ajustar a mensagem

O sistema deve utilizar uma mensagem adequada à quantidade:

- **Um usuário:** “Existe 1 usuário aguardando aprovação.”
- **Mais de um usuário:** “Existem X usuários aguardando aprovação.”

### RF06 — Exibir indicador no menu

O item **Usuários** do menu lateral deve apresentar um indicador com a quantidade de cadastros pendentes.

### RF07 — Acessar os usuários pendentes

Ao selecionar a notificação ou o indicador, o sistema deve direcionar o master para a tela de usuários com o filtro `pendente` aplicado.

### RF08 — Atualizar a notificação

A quantidade deve ser atualizada quando um usuário for:

- Cadastrado;
- Aprovado;
- Rejeitado;
- Excluído.

### RF09 — Remover a notificação

Quando não existirem usuários pendentes, o sistema deve ocultar a notificação e o indicador do menu.

### RF10 — Não bloquear o dashboard

Se ocorrer uma falha ao consultar os cadastros pendentes, o dashboard deve continuar funcionando.

O sistema não deve apresentar informações técnicas ou credenciais na mensagem de erro.

## Fluxo principal

1. O usuário master realiza o login.
2. O sistema direciona o usuário para o dashboard.
3. O sistema consulta a quantidade de usuários pendentes.
4. O sistema identifica um ou mais cadastros aguardando aprovação.
5. O sistema apresenta a notificação no dashboard.
6. O sistema apresenta a quantidade no item **Usuários** do menu.
7. O master seleciona a notificação.
8. O sistema direciona para a tela de usuários.
9. O sistema aplica o filtro de usuários pendentes.

## Fluxos alternativos

### Nenhum usuário pendente

1. O usuário master acessa o dashboard.
2. O sistema consulta os usuários pendentes.
3. O sistema identifica que não existem cadastros aguardando aprovação.
4. O sistema não apresenta a notificação nem o indicador.

### Usuário normal

1. O usuário normal acessa o dashboard.
2. O sistema verifica seu nível de acesso.
3. O sistema não consulta nem apresenta informações sobre usuários pendentes.

### Falha na consulta

1. O usuário master acessa o dashboard.
2. O sistema não consegue consultar os usuários pendentes.
3. O dashboard continua sendo apresentado.
4. O sistema registra o erro sem expor dados sensíveis.
5. O sistema pode apresentar a mensagem: **“Não foi possível atualizar as notificações.”**

## Regras de negócio

- Somente usuários master podem visualizar a notificação.
- A quantidade deve considerar apenas usuários com situação `pendente`.
- Usuários aprovados, rejeitados, excluídos ou presentes na lixeira não devem ser contabilizados.
- A notificação deve permanecer visível enquanto existirem usuários pendentes.
- Fechar visualmente a notificação não deve alterar a situação dos usuários.
- A notificação deve desaparecer quando todos os cadastros forem aprovados, rejeitados ou excluídos.
- A contagem deve ser validada no backend.
- O acesso à tela de usuários deve continuar protegido para usuários master.

## Requisitos de interface

- A notificação deve possuir destaque sem impedir o uso do dashboard.
- A quantidade de usuários pendentes deve estar visível.
- O item **Usuários** deve apresentar um indicador numérico.
- O indicador deve possuir texto acessível para leitores de tela.
- A notificação deve ser selecionável e direcionar para os usuários pendentes.
- A interface deve manter as cores e a tipografia do sistema.
- A notificação deve utilizar a abordagem Mobile First.

## Atualização dinâmica

A notificação deve ser atualizada:

- Ao abrir o dashboard;
- Ao retornar para o dashboard;
- Após aprovar um usuário;
- Após rejeitar um usuário;
- Após excluir um usuário.

A atualização deve ocorrer sem recarregar toda a página.

## Critérios de aceite

- [ ] Apenas usuários autenticados, ativos e master visualizam a notificação.
- [ ] O dashboard consulta a quantidade de usuários pendentes.
- [ ] A notificação aparece quando existe pelo menos um cadastro pendente.
- [ ] A notificação apresenta a quantidade correta.
- [ ] A mensagem diferencia singular e plural.
- [ ] O item **Usuários** apresenta um indicador numérico.
- [ ] Ao selecionar a notificação, o master é direcionado para os usuários pendentes.
- [ ] A quantidade é atualizada após aprovação, rejeição ou exclusão.
- [ ] A notificação desaparece quando não existem usuários pendentes.
- [ ] Usuários normais não visualizam a notificação.
- [ ] Uma falha na consulta não impede o funcionamento do dashboard.
- [ ] A notificação funciona em mobile, tablet e desktop.

## Fora do escopo

- Notificações por e-mail;
- Notificações por SMS;
- Notificações push;
- Aprovação diretamente pelo dashboard;
- Histórico de notificações;
- Preferências individuais de notificação.