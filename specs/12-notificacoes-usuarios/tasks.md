# Tasks — Notificações de usuários

## 1. Banco de dados

- [ ] Criar a tabela `notificacoes`.
- [ ] Adicionar o campo `id`.
- [ ] Adicionar o campo `usuario_id`.
- [ ] Adicionar o campo `tipo`.
- [ ] Adicionar o campo `titulo`.
- [ ] Adicionar o campo `mensagem`.
- [ ] Adicionar o campo `referencia_tipo`.
- [ ] Adicionar o campo `referencia_id`.
- [ ] Adicionar o campo `lida`.
- [ ] Definir `false` como valor padrão do campo `lida`.
- [ ] Adicionar o campo `lida_em`.
- [ ] Adicionar os campos `created_at` e `updated_at`.
- [ ] Criar o relacionamento entre a notificação e o usuário destinatário.
- [ ] Criar índices para `usuario_id`, `tipo`, `lida` e `created_at`.
- [ ] Criar e executar a migration correspondente.

## 2. Modelo de notificações

- [ ] Criar o modelo de notificação no backend.
- [ ] Definir os tipos de notificação permitidos:
  - `cadastro_aprovado`;
  - `cadastro_rejeitado`;
  - `reserva_realizada`;
  - `reserva_aprovada`;
  - `reserva_alterada`;
  - `reserva_cancelada`.
- [ ] Criar validações para os campos obrigatórios.
- [ ] Criar relacionamento com o modelo de usuário.
- [ ] Criar suporte para relacionar a notificação a uma reserva.
- [ ] Implementar ordenação da notificação pela data de criação.

## 3. Serviço de notificações

- [ ] Criar um serviço centralizado para gerar notificações.
- [ ] Criar uma função para notificar um usuário.
- [ ] Validar se o destinatário existe.
- [ ] Validar se o tipo de notificação é permitido.
- [ ] Registrar título, mensagem, destinatário e referência relacionada.
- [ ] Impedir a criação de notificações duplicadas para o mesmo evento.
- [ ] Garantir que falhas no serviço não interrompam a operação principal.
- [ ] Registrar erros de criação de notificações nos logs do sistema.

## 4. Notificações de cadastro

- [ ] Integrar o serviço de notificações ao fluxo de aprovação de cadastro.
- [ ] Criar uma notificação quando o cadastro for aprovado.
- [ ] Informar ao usuário que seu acesso foi liberado.
- [ ] Integrar o serviço ao fluxo de rejeição de cadastro.
- [ ] Criar uma notificação quando o cadastro for rejeitado.
- [ ] Incluir o motivo da rejeição na notificação.
- [ ] Impedir a geração duplicada da notificação de validação.

## 5. Notificações de reservas

- [ ] Integrar o serviço de notificações ao cadastro de reservas.
- [ ] Criar uma notificação quando uma reserva for realizada.
- [ ] Incluir os dados principais da reserva na notificação.
- [ ] Criar uma notificação quando uma reserva for aprovada.
- [ ] Criar uma notificação quando informações relevantes forem alteradas.
- [ ] Identificar os dados modificados na notificação de alteração.
- [ ] Criar uma notificação quando uma reserva for cancelada.
- [ ] Informar quem realizou o cancelamento.
- [ ] Incluir o motivo do cancelamento, quando informado.
- [ ] Relacionar cada notificação à reserva correspondente.
- [ ] Criar notificações somente após a conclusão da operação principal.

## 6. Endpoints da API

- [ ] Criar o endpoint para listar as notificações do usuário autenticado.
- [ ] Criar o endpoint para consultar uma notificação específica.
- [ ] Criar o endpoint para consultar a quantidade de notificações não lidas.
- [ ] Criar o endpoint para marcar uma notificação como lida.
- [ ] Criar o endpoint para marcar todas as notificações como lidas.
- [ ] Implementar paginação na listagem de notificações.
- [ ] Permitir filtragem por tipo.
- [ ] Permitir filtragem por situação de leitura.
- [ ] Ordenar as notificações da mais recente para a mais antiga.
- [ ] Retornar códigos HTTP adequados em todas as operações.

## 7. Segurança e permissões

- [ ] Exigir autenticação em todos os endpoints.
- [ ] Obter o destinatário a partir do usuário autenticado.
- [ ] Impedir que o usuário consulte notificações de outras pessoas.
- [ ] Impedir que o usuário marque notificações de outras pessoas como lidas.
- [ ] Não permitir o envio de `usuario_id` arbitrário nas consultas pessoais.
- [ ] Sanitizar os parâmetros e filtros recebidos.
- [ ] Utilizar consultas parametrizadas no banco de dados.
- [ ] Validar as permissões no backend.

## 8. Interface — Indicador de notificações

- [ ] Adicionar um ícone de notificações no cabeçalho ou menu principal.
- [ ] Exibir a quantidade de notificações não lidas.
- [ ] Ocultar o contador quando não existirem notificações não lidas.
- [ ] Atualizar o contador após a leitura de uma notificação.
- [ ] Garantir que o indicador funcione para usuários master e comuns.
- [ ] Garantir acessibilidade por teclado.
- [ ] Adicionar descrição acessível ao ícone.
- [ ] Ajustar o indicador para dispositivos móveis.

## 9. Interface — Lista de notificações

- [ ] Criar a área de listagem das notificações.
- [ ] Apresentar título, mensagem, tipo, data e hora.
- [ ] Diferenciar visualmente notificações lidas e não lidas.
- [ ] Ordenar os registros da data mais recente para a mais antiga.
- [ ] Permitir a abertura de uma notificação.
- [ ] Adicionar a opção `Marcar como lida`.
- [ ] Adicionar a opção `Marcar todas como lidas`.
- [ ] Adicionar filtros por tipo e situação de leitura.
- [ ] Implementar paginação ou carregamento progressivo.
- [ ] Exibir uma mensagem quando não existirem notificações.
- [ ] Exibir uma mensagem em caso de erro no carregamento.
- [ ] Garantir que a interface seja responsiva.

## 10. Navegação das notificações

- [ ] Direcionar notificações de reserva para os detalhes da reserva.
- [ ] Direcionar notificações de cadastro para a área adequada do sistema.
- [ ] Validar se o registro relacionado ainda existe antes do redirecionamento.
- [ ] Exibir uma mensagem quando o registro relacionado não estiver disponível.
- [ ] Marcar a notificação como lida quando ela for aberta.
- [ ] Impedir redirecionamentos para páginas sem permissão de acesso.

## 11. Atualização das notificações

- [ ] Carregar as notificações ao iniciar a aplicação.
- [ ] Atualizar periodicamente a quantidade de notificações não lidas.
- [ ] Atualizar a listagem após uma nova notificação.
- [ ] Evitar requisições repetidas desnecessárias.
- [ ] Tratar falhas de conexão sem interromper o uso do sistema.
- [ ] Avaliar o uso de polling, Server-Sent Events ou WebSocket.

## 12. Responsividade e acessibilidade

- [ ] Aplicar a abordagem mobile first.
- [ ] Ajustar a lista de notificações para smartphones.
- [ ] Garantir que textos longos não ultrapassem os limites da tela.
- [ ] Utilizar áreas de toque adequadas nos botões.
- [ ] Garantir contraste entre notificações lidas e não lidas.
- [ ] Permitir navegação utilizando teclado.
- [ ] Utilizar atributos acessíveis nos controles.
- [ ] Testar a interface em smartphones, tablets e desktops.

## 13. Testes do backend

- [ ] Testar a criação de uma notificação de cadastro aprovado.
- [ ] Testar a criação de uma notificação de cadastro rejeitado.
- [ ] Testar a criação de uma notificação de reserva realizada.
- [ ] Testar a criação de uma notificação de reserva aprovada.
- [ ] Testar a criação de uma notificação de reserva alterada.
- [ ] Testar a criação de uma notificação de reserva cancelada.
- [ ] Testar a prevenção de notificações duplicadas.
- [ ] Testar a listagem de notificações do usuário autenticado.
- [ ] Testar a consulta da quantidade de notificações não lidas.
- [ ] Testar a marcação de uma notificação como lida.
- [ ] Testar a marcação de todas as notificações como lidas.
- [ ] Testar a tentativa de acesso a notificações de outro usuário.
- [ ] Testar filtros, ordenação e paginação.

## 14. Testes da interface

- [ ] Testar a exibição do contador de notificações.
- [ ] Testar a atualização do contador após a leitura.
- [ ] Testar a diferenciação visual entre notificações lidas e não lidas.
- [ ] Testar a abertura dos detalhes da notificação.
- [ ] Testar o redirecionamento para a reserva relacionada.
- [ ] Testar a opção de marcar todas como lidas.
- [ ] Testar os estados de carregamento, vazio e erro.
- [ ] Testar a interface em diferentes tamanhos de tela.
- [ ] Testar a navegação por teclado.

## 15. Validação final

- [ ] Verificar se todos os eventos definidos geram notificações.
- [ ] Confirmar que cada usuário visualiza somente suas notificações.
- [ ] Confirmar que as notificações não são excluídas após a leitura.
- [ ] Confirmar que falhas nas notificações não bloqueiam as operações principais.
- [ ] Confirmar que não são geradas notificações duplicadas.
- [ ] Confirmar que a interface está responsiva.
- [ ] Executar todos os testes automatizados.
- [ ] Realizar testes manuais dos fluxos principais.