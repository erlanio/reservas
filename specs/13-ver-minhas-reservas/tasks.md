# Tasks — Visualizar minhas reservas

## 1. Backend — Consulta das reservas

- [x] Criar o endpoint para listar as reservas do usuário autenticado.
- [x] Obter o identificador do usuário por meio da sessão ou token.
- [x] Filtrar as reservas pelo usuário autenticado.
- [x] Impedir o uso de um `usuario_id` enviado pelo frontend.
- [x] Incluir os dados do ativo relacionado a cada reserva.
- [x] Incluir a situação atual de cada reserva.
- [x] Ordenar as reservas da data mais antiga para a mais recente.
- [x] Implementar paginação na consulta.
- [x] Retornar a quantidade total de reservas encontradas.
- [x] Retornar códigos HTTP adequados para sucesso e erro.

## 2. Backend — Detalhes da reserva

- [x] Criar o endpoint para consultar os detalhes de uma reserva.
- [x] Validar se a reserva existe.
- [x] Verificar se a reserva pertence ao usuário autenticado.
- [x] Negar o acesso quando a reserva pertencer a outro usuário.
- [x] Retornar os dados do ativo relacionado.
- [x] Retornar o motivo do cancelamento ou rejeição, quando aplicável.
- [x] Retornar as datas de criação e última alteração.
- [x] Não modificar a situação da reserva durante a consulta.

## 3. Filtros e pesquisa

- [x] Implementar filtro por situação da reserva.
- [x] Implementar filtro por data inicial.
- [x] Implementar filtro por data final.
- [x] Implementar pesquisa pelo nome do ativo.
- [x] Implementar pesquisa pela identificação do ativo.
- [x] Permitir a combinação dos filtros.
- [x] Validar se a data inicial é anterior ou igual à data final.
- [x] Sanitizar os parâmetros recebidos.
- [x] Aplicar todos os filtros somente às reservas do usuário autenticado.
- [x] Criar uma opção para limpar os filtros.

## 4. Ordenação

- [x] Implementar ordenação fixa pela data da reserva em ordem crescente, com horário e id como desempate.
- [x] Remover controles manuais de ordenação da interface.

## 5. Interface — Menu

- [x] Adicionar a opção `Minhas reservas` no menu principal.
- [x] Exibir a opção somente para usuários autenticados.
- [x] Configurar a navegação para a tela de reservas do usuário.
- [x] Destacar a opção quando a tela estiver aberta.
- [x] Ajustar o item do menu para dispositivos móveis.

## 6. Interface — Listagem

- [x] Criar a tela `Minhas reservas`.
- [x] Integrar a tela ao endpoint de listagem.
- [x] Exibir a identificação da reserva.
- [x] Exibir o nome e a categoria do ativo.
- [x] Exibir a data da reserva.
- [x] Exibir os horários de início e término.
- [x] Exibir a finalidade da reserva.
- [x] Exibir a situação atual.
- [x] Exibir a data de criação.
- [x] Apresentar a quantidade de reservas encontradas.
- [x] Criar uma ação para visualizar os detalhes.
- [x] Atualizar a listagem quando os filtros forem alterados.
- [x] Preservar as reservas concluídas e canceladas na listagem.
- [x] Trazer por padrão reservas aceitas a partir do dia atual, sem data final.
- [x] Ordenar a listagem pela data da reserva em ordem crescente.

## 7. Identificação visual das situações

- [x] Criar indicadores para reservas aceitas.
- [x] Criar indicadores para reservas concluídas.
- [x] Criar indicadores para reservas canceladas.
- [x] Utilizar texto e ícone além das cores.
- [x] Garantir contraste adequado entre texto e fundo.
- [x] Destacar reservas aceitas do dia.

## 8. Interface — Filtros

- [x] Criar o campo de filtro por situação.
- [x] Criar o campo de data inicial.
- [x] Criar o campo de data final.
- [x] Criar o campo de pesquisa por ativo.
- [x] Criar o controle de ordenação.
- [x] Adicionar o botão `Filtrar`.
- [x] Adicionar o botão `Limpar filtros`.
- [x] Exibir os filtros ativos.
- [x] Buscar automaticamente quando os filtros forem alterados.
- [x] Apresentar uma mensagem para períodos inválidos.
- [x] Ajustar os filtros para dispositivos móveis.

## 9. Interface — Detalhes da reserva

- [x] Criar a página ou modal de detalhes.
- [x] Exibir o número ou identificação da reserva.
- [x] Exibir o nome, a identificação e a categoria do ativo.
- [x] Exibir a descrição do ativo.
- [x] Exibir a data e os horários da reserva.
- [x] Exibir a finalidade e as observações.
- [x] Exibir a situação atual.
- [x] Exibir o motivo de cancelamento ou rejeição, quando aplicável.
- [x] Exibir as datas de criação e última alteração.
- [x] Adicionar uma ação para retornar à listagem.
- [x] Tratar o caso em que a reserva não for encontrada.
- [x] Tratar o caso em que o usuário não possuir permissão.

## 10. Paginação

- [x] Definir a quantidade de reservas apresentadas por página.
- [x] Adicionar controles para avançar e retornar páginas.
- [x] Exibir a página atual e a quantidade total de páginas.
- [x] Manter os filtros durante a troca de página.
- [x] Impedir o acesso a páginas inexistentes.
- [x] Ajustar os controles para dispositivos móveis.

## 11. Estados da interface

- [x] Criar um indicador de carregamento.
- [x] Exibir uma mensagem quando o usuário não possuir reservas.
- [x] Exibir uma mensagem quando nenhum resultado corresponder aos filtros.
- [x] Exibir uma mensagem quando ocorrer erro na consulta.
- [x] Adicionar uma opção para tentar carregar novamente.
- [x] Evitar a exibição de dados antigos durante uma nova consulta.
- [x] Desabilitar ações enquanto os dados estiverem sendo carregados.

## 12. Segurança

- [x] Exigir autenticação nos endpoints.
- [x] Aplicar o filtro do usuário autenticado em todas as consultas.
- [x] Impedir acesso direto a reservas de outros usuários.
- [x] Não expor dados pessoais de outros usuários.
- [x] Validar e sanitizar os filtros.
- [x] Utilizar consultas parametrizadas no banco de dados.
- [x] Validar os campos permitidos para ordenação.
- [x] Não utilizar apenas controles do frontend para proteger os dados.
- [x] Registrar tentativas de acesso não autorizado nos logs.

## 13. Responsividade e acessibilidade

- [x] Desenvolver a interface com abordagem mobile first.
- [x] Apresentar as reservas em cartões nas telas menores.
- [x] Utilizar tabela responsiva em telas maiores.
- [x] Garantir que os textos não ultrapassem os limites da tela.
- [x] Criar áreas de toque adequadas para os controles.
- [x] Garantir navegação por teclado.
- [x] Adicionar nomes acessíveis aos botões e filtros.
- [x] Garantir foco visível nos elementos interativos.
- [x] Não utilizar somente cores para identificar situações.
- [x] Testar a tela em smartphones, tablets e desktops.

## 14. Testes do backend

- [x] Testar a listagem das reservas do usuário autenticado.
- [x] Confirmar que reservas de outros usuários não são retornadas.
- [x] Testar usuário sem reservas.
- [x] Testar filtro por situação.
- [x] Testar filtro por período.
- [x] Testar pesquisa pelo ativo.
- [x] Testar a combinação de filtros.
- [x] Testar período inválido.
- [x] Testar ordenação crescente e decrescente.
- [x] Testar paginação.
- [x] Testar consulta dos detalhes de uma reserva.
- [x] Testar acesso direto a uma reserva de outro usuário.
- [x] Testar acesso sem autenticação.
- [x] Testar reserva inexistente.

## 15. Testes da interface

- [x] Testar a abertura da tela pelo menu.
- [x] Testar a exibição das reservas.
- [x] Testar os indicadores de situação.
- [x] Testar a aplicação dos filtros.
- [x] Testar a limpeza dos filtros.
- [x] Testar a ordenação.
- [x] Testar a troca de páginas.
- [x] Testar a abertura dos detalhes.
- [x] Testar os estados de carregamento, lista vazia e erro.
- [x] Testar a visualização em dispositivos móveis.
- [x] Testar a navegação por teclado.
- [x] Testar a interface com textos longos.

## 16. Validação final

- [x] Confirmar que o usuário visualiza somente suas reservas.
- [x] Confirmar que reservas encerradas permanecem no histórico.
- [x] Confirmar que todos os filtros funcionam corretamente.
- [x] Confirmar que a paginação mantém os filtros aplicados.
- [x] Confirmar que os detalhes apresentam os dados atualizados.
- [x] Confirmar que tentativas de acesso indevido são bloqueadas.
- [x] Confirmar que a interface está responsiva.
- [x] Executar todos os testes automatizados.
- [x] Realizar testes manuais dos principais fluxos.
