# Gomoku AI Player — MPI-Parallel Minimax (CS314 — Stellenbosch University, 3rd Year)

**Language:** C, using MPI (Message Passing Interface) for parallelism
**Harness:** a course-provided Java tournament framework ("Ingenious Framework") that hosts a game server, pairs C clients over TCP sockets, and referees Gomoku matches

## Summary

A Gomoku-playing agent (15×15 board, 5-in-a-row to win) built as a distributed minimax search: the search tree is split across multiple MPI processes on a single machine, with one process acting as a master that dynamically hands out unexplored branches to idle workers and merges their results. The agent connects to a game server over a socket, plays live matches against other students' agents in a round-robin tournament, and was evaluated purely on competitive results rather than a fixed test suite — a different kind of correctness pressure than a typical assignment.

## How it works

- **Search:** minimax with alpha-beta pruning, fixed at depth 4. Rather than recursive function calls, the search is implemented as an **explicit iterative stack machine** (`mini_max`, `push`/`pop`/`peek` over a custom `Stack`/`Node` type carrying move, depth, alpha, beta, running score, and colour per frame) — a deliberate choice to keep full control over pruning state at each frame in C rather than relying on the call stack.
- **Distribution across MPI processes:** the root process (`run_master`) distributes the initial set of legal moves round-robin across worker processes (`run_worker`), giving process 0 a larger initial share. Each worker searches its assigned moves independently to depth 4, then requests more work from the master via a non-blocking probe (`MPI_Iprobe`) once it's exhausted its batch — this is dynamic load balancing, not a static even split, so faster-finishing workers don't sit idle while others are still deep in a branch.
- **Cross-process alpha sharing:** as workers report results, the master tracks the best alpha found so far across *all* processes and forwards it back out with each new batch of moves — meaning a strong move found by one worker tightens the pruning bound used by every other worker's subsequent search, not just its own.
- **Heuristic evaluation** (`evaluate_move`): scores a candidate move on board centrality, the length of same-colour lines it creates or extends, whether it blocks an opponent's line, and whether the resulting line has open ends (an open four is worth far more than a blocked one) — checked in every direction from the placed stone.
- **Network protocol layer:** `comms.c`/`comms.h` (a fixed, unmodifiable protocol supplied by the course) handle the socket handshake and move exchange with the Java-hosted game server; `my_player.c` calls into this layer but owns none of the wire format, which forces a clean separation between game logic and I/O.

## Technical highlights

- **Real distributed computing, not simulated parallelism**: this uses actual `MPI_Init`/`MPI_Comm_rank`/`MPI_Bcast`/`MPI_Send`/`MPI_Recv`/`MPI_Iprobe`, run via `mpirun` across multiple OS processes — inter-process communication and synchronization, not threads sharing memory.
- **Iterative (not recursive) game-tree search in C**, trading a small amount of code complexity for explicit control over the search frontier — relevant given the process is also juggling non-blocking MPI communication mid-search.
- **Master/worker pattern with dynamic (not static) work distribution**: workers pull new work when idle rather than being pre-assigned a fixed share up front, which matters because move evaluation cost is highly non-uniform (a move near existing stones prunes very differently than an isolated one).
- **Operates inside constraints it doesn't control**: a fixed communication protocol (`comms.c`/`.h`), a fixed per-move time budget enforced by the referee, and an opponent whose behaviour is unknown at compile time — the agent has to be robust to all of this without being able to change the harness around it.

## Screenshot

| File | Shows |
| --- | --- |
| `01-board-state.png` | A live match captured mid-game: the MPI agent (`1`) has built an open four in row 6 — four in a row with both ends open, one move from an unstoppable win — while the opponent (`2`) has scattered, disconnected stones. Board state and move history read directly from the game server's live log during an actual tournament run. |

*Captured by compiling the C client with `mpicc`, launching the course's Java tournament server/referee, and running a live match through the full MPI + socket + Java pipeline locally.*
