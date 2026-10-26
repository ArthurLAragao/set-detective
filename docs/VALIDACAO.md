# Validação do projeto

Verificações realizadas em 26/10/2026.

## Cálculos e regras

- Sintaxe de `script.js` aprovada por `node --check`.
- Gabaritos de todas as regiões das três missões conferidos.
- 10.000 problemas aleatórios verificados com semente reproduzível: dois e três conjuntos, união, nenhum, apenas A, exatamente uma opção e par exclusivo.
- 179.723 asserções no total, incluindo fórmulas inversas de inclusão-exclusão, cardinalidades, entradas inválidas e regras de pontuação.

Execute a suíte na raiz do repositório:

```bash
node --check script.js
node tests/math.test.cjs
```

## Fluxo no navegador

- Telas de início, Como Jogar e Teoria, com retorno à investigação.
- Preenchimento sincronizado entre o diagrama e o painel, nos dois sentidos.
- Destaque de erro, dica, correção e avanço entre as três missões.
- Cinco desafios concluídos, incluindo um tempo esgotado observado por 60 segundos, um erro e três acertos.
- Entrada inválida rejeitada sem encerrar o desafio; resposta válida bloqueada após avaliação.
- Explicações após acerto, erro e tempo esgotado.
- Pausa na ajuda e na teoria, com retorno ao mesmo caso.
- Partida de verificação: 250 + 300 + 300 pontos nas missões e 300 no desafio; total de 1.150, precisão de 67% (6 acertos em 9 verificações) e melhor missão Redes Sociais.
- Reinício com pontuação, campos e progresso zerados.
- Sem erros ou avisos JavaScript no registro consultado do navegador.

## Layout e limites da verificação

O início e o diagrama de três conjuntos foram inspecionados visualmente. O layout foi conferido em desktop e em larguras de viewport de 1.024, 390 e 320 pixels, sem rolagem horizontal nas verificações.

Essas verificações usam navegador e emulação de viewport. Não representam testes em aparelho físico, em todos os navegadores ou uma auditoria completa com leitor de tela.

A captura em `docs/preview.png` corresponde à interface real. Nenhum dado pessoal de partida é persistido pelo jogo.
