# Impasse (CS114 — Stellenbosch University, 1st Year)

**Language:** Java (no external libraries — custom board rendering, both console and Swing GUI, plus WAV sound effects)

## Summary

A block-placement puzzle game built from a project skeleton for a first-year Computer Science course. Players place colored blocks left-to-right into a square grid; each placement only opens up the adjacent cell to its right, so the board fills one cascading row at a time. The game continuously checks the board after every move for three distinct illegal-state conditions — a "blockade" (too many same-colored blocks in a column), a "split" (an unreachable region created), and a "dead end" (a repeated pattern that traps future placement) — any of which immediately ends the game. Supports 2, 3, or 4 colors (board size and difficulty scale with the color count: 8×8 up to 128×128), runs in both a text console mode and a Swing GUI mode with sound feedback, and supports two independently-implemented rule variants ("first hand-in" vs. "second hand-in" — an early version and an extended version with the split/dead-end detection added).

## Technical highlights

- **Three independent board-scanning detectors, each a distinct algorithm:**
  - `textBlockadeCheck` — scans each column for `k`-or-longer runs of the same color.
  - `splitSearch` — converts each fully-occupied row to a string and checks for duplicate row patterns elsewhere on the board (a proxy for a board split into disconnected, mirrored regions).
  - `deadEndSearch` — scans each row for a repeated substring, then checks whether that substring recurs later in the same row, catching patterns that would force an unwinnable repetition.
  Each is written as a standalone, board-agnostic function that takes the grid and size, and all three run after every placement rather than being fused into one combined check — deliberately keeping each rule independently testable.
- **Speculative move simulation for early-termination detection** (`earlyGameTermination`): before declaring the game unwinnable, the code temporarily places every possible next color at every open cell, re-runs all three detectors against that hypothetical board, then reverts the cell — genuinely searching one ply ahead for *any* legal move before ending the game, rather than assuming the game is stuck.
- **Command-line-driven configuration**: game mode, text/GUI rendering, color count (2/3/4, which also determines board size 8/30/128), and blockade length are all validated from CLI args at startup, with defaults and printed warnings for out-of-range values instead of crashing on bad input.
- **Graceful degradation for platform-specific audio failure**: sound playback is wrapped in a try/catch that silently no-ops on failure, with an explicit code comment documenting a known Ubuntu/`StdAudio` incompatibility discovered during testing — the game stays fully playable with audio simply disabled rather than crashing on an unsupported platform.
- **Same rule engine, two presentation layers**: the text-mode and GUI-mode game loops both call the identical validation functions (`textBlockadeCheck`, `splitSearch`, `deadEndSearch`, `earlyGameTermination`) — no duplicated game logic between the two input/render paths, only the I/O layer differs (stdin/stdout vs. `StdDraw` mouse-free keyboard-driven canvas).

## Screenshots

| File | Shows |
| --- | --- |
| `01-gui-board.png` | GUI — 30×30 board (3-color mode), several cascading placements down column 0 and across row 0 |
| `02-blockade-termination.png` | GUI — 8×8 board (2-color mode), a deliberately triggered blockade showing the live termination message, score, and move count |
| `03-text-mode-console.png` | Console renderer — the same color-cascade placement logic rendered as a plain-text grid |

*Screenshots were captured by compiling and running the actual project locally, playing live moves through both the GUI and console interfaces.*
