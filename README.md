# Head Soccer Champions

Jogo arcade de futebol para navegador, com campo em Canvas e jogadores 3D em Three.js. Para carregar o módulo 3D, sirva a pasta por HTTP. No Windows, execute `powershell -ExecutionPolicy Bypass -File .\serve-game.ps1` e abra `http://127.0.0.1:8000/`.

## Partida

- Escolha dois times entre 22 opções com escudos gráficos conceituais e cores de uniforme selecionáveis.
- Jogue contra a IA ou em dois jogadores no mesmo teclado.
- Escolha duração (60, 90 ou 120 segundos) e arena.
- A partida tem física com passo fixo, gravidade, quique, colisão de bola com corpo/cabeça, chute especial, gol, prorrogação e desempate por gol de ouro.
- Tela cheia pelo botão no topo.

## Controles

- Jogador 1: `A` / `D` para mover, `W` para pular e `Espaço` para chute especial.
- Jogador 2: `←` / `→` para mover, `↑` para pular e `Enter` para chute especial.
- `Esc` pausa e retoma.

Os nomes e as cores dos clubes são usados em uma apresentação conceitual. Os escudos são desenhos originais com abreviações, não reproduções oficiais. As caricaturas de oito jogadores foram obtidas de CityPNG e são armazenadas localmente; veja assets/players/CREDITS.md e a página credits.html para as fontes e atribuições. Pelé, Ronaldinho, Zidane e Beckham mantêm a aparência original.


## Personagens extras

A seleção tem 22 opções: 12 jogadores e Chaves, Kratos, Madara, Kick Buttowski, Bob Esponja, Lula Molusco, Lula, Bolsonaro, Zé Pilintra e Professor Xavier. Os retratos são caricaturas em PNG e aparecem em campo. Xavier joga com a cadeira de rodas visível, mantendo os mesmos controles e regras. Fontes e prompts: assets/characters/CREDITS.md.
