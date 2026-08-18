# Moving Maze (CS144 — Stellenbosch University, 1st Year)

**Language:** Java (no external libraries — custom board rendering, both console and Swing GUI)

## Summary

A 4-player sliding-tile maze game (Labyrinth-style) built from a project skeleton for a first-year Computer Science course. Players navigate a grid of interlocking path tiles to collect relics, where the board itself changes shape every turn: each player slides a "floating" tile into a row or column edge, shunting the entire row/column across and ejecting a tile out the opposite side, before moving along whatever path the new tile layout allows. Runs in two interchangeable modes from the same game state: a plain-text console renderer using Unicode box-drawing characters, and a full Swing GUI with sprite-based rendering.

## Technical highlights

- **Recursive backtracking pathfinding respecting per-tile connections** (`Adventurer.pathFinding`): before a move is accepted, the game walks the requested path tile-by-tile, checking at each step whether the current tile's encoded exits (`MoveInDirection`) actually connect to the exit side of the next tile — not just that the next tile is adjacent. A `boolean[][]` visited-tile array prevents revisiting a tile within the same path search. This means the "legal moves" aren't a simple distance check; they're derived from the live connectivity graph of the current (constantly-shifting) board.
- **Tile encoding as a compact string representation**: each tile stores its open sides as a short code (`Tile.java`) that both the rotation logic and the connectivity check (`MoveInDirection`) read directly, rather than modeling each tile as a full object graph — a deliberate compactness/readability tradeoff for a board that fully regenerates its layout every turn.
- **One game engine, two renderers.** `MovingMaze.java` holds all game state and turn logic independent of presentation; `Board`, `Tile`, `Adventurer`, and `Relics` are shared between the console path (Unicode box-drawing character grid) and the Swing GUI path (`Gui.java`, sprite-based rendering with live score tracking) — the same input format (board file + move file) drives both without duplicating game rules.
- **File-driven board and move input**: board layout, relic count, and the starting floating tile are loaded from a plain-text board file (`In.java`); recorded move sequences can be replayed from file for deterministic testing (`moves/*.txt` against `boards/*.txt`, with expected `outputs/*.txt` for comparison) — the grader/test-suite classes (`StudentTestSuite*.java`) in the repo hang off this same file-driven design.
- **Slide-and-eject board mutation**: sliding a tile in from one edge doesn't just insert it — it shifts every tile in that row/column one position and ejects the tile from the opposite edge to become the new floating tile, while tracking and forbidding sliding back into the immediately-previous exit point (`previousExit`) to prevent a trivial undo move.

## Screenshots

| File | Shows |
| --- | --- |
| `01-slide-rotate-phase.png` | GUI — tile insertion phase: choosing where to slide the floating tile into the 5×5 board |
| `02-move-phase.png` | GUI — movement phase after the slide, board reshaped, floating tile now positioned elsewhere |
| `03-text-mode-console.png` | Console renderer — Unicode box-drawing board, floating tile preview, and end-of-game relic tally after a full played-out game |

*Screenshots were captured by compiling and running the actual project locally, playing live moves through both the GUI and console interfaces.*
