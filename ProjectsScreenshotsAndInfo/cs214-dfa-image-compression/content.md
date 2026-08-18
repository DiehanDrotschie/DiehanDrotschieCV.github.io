# DFA-Based Image Compression (CS214 — Stellenbosch University, 2nd Year)

**Language:** Java (Swing GUI, custom file I/O, no compression/image libraries beyond `javax.imageio` for PNG read/write)

## Summary

A lossless compression tool for black-and-white bitmap images that represents an image not as pixels but as a **deterministic finite automaton (DFA)** over a 4-symbol alphabet, following the Culik–Kari style of automata-based image compression (see `Recources/kariImageCompression.pdf` in the project). Every black pixel's position is encoded as a string over `{0,1,2,3}` — a recursively-generated quadrant address — and the compressed file is the minimal DFA that accepts exactly the set of addresses of black pixels. Self-similar or repetitive images (the project's test set includes Sierpinski triangles, checkerboards, and QR codes) compress to a handful of states regardless of resolution, since the automaton captures structural repetition rather than raw pixel data.

## How it works

1. **Compression** (`FA.compressImage`): each black pixel's `(row, col)` is converted to a quadrant-address string via `getAddress` — a recursive function that, at each halving of the image, prepends `1`/`0`/`3`/`2` for top-left/bottom-left/top-right/bottom-right and recurses into that sub-quadrant, terminating at 1×1 resolution.
2. **Quadtree reduction** (`reduceList`): the sorted list of addresses is repeatedly scanned for four sibling addresses sharing the same parent prefix (i.e. a fully-black quadrant); any such group is collapsed into just the shared prefix. This runs to a fixed point (no more merges possible), which is exactly quadtree compression applied at the string level before automaton construction.
3. **DFA construction** (`compressToDFA`): the reduced set of accepted strings is built into a DFA — states and labeled transitions (`State`, `Edges`) — and serialized to a plain-text automaton file (state count, accept states, then `from to symbol` transition triples).
4. **Decompression** (`FA.dfs` + `createImage`): the DFA is traversed depth-first (via a custom `charStack` that pairs each stacked state with the path taken to reach it) to enumerate every accepted string, i.e. every black quadrant address; each address is then mapped back to its pixel coordinates and rendered into a `BufferedImage`.
5. **Multi-resolution decoding**: because each DFA path length corresponds to one level of quadrant subdivision, capping the DFS depth (`maxLen`) reconstructs the image at a lower resolution *from the same compressed file* — no separate low-res encoding is needed. Three different multi-resolution compression strategies are implemented (biasing toward the whitest quadrant, and two variants of making all states accepting to permit early termination), selectable via a CLI flag.

## Technical highlights

- **Formal-language concept applied directly to a real encoding problem**: an image is treated as a regular language (the set of black-pixel addresses), and DFA minimization becomes the compression step — a first-year student implementation of ideas from an actual research paper on automata-based image compression, not just a course exercise reproducing a known library.
- **Custom supporting data structures written for this project** rather than reached for from a library: `charStack` (a stack that tracks both a `State` and its accumulated path string, needed to reconstruct addresses during DFS without recomputation), `State`/`Edges` (an adjacency-list DFA representation via `Map<String, Map<String, ArrayList<String>>>`), and a bespoke `In.java` text-file reader for the automaton format.
- **Extensive input validation on a hand-rolled file format**: `Compress.fileInput` validates state counts, accept-state ranges, and transition well-formedness (in-range states, symbol restricted to `{0,1,2,3}`) with distinct, specific error messages before any DFA is built — the automaton file is untrusted input, not just an internal serialization detail.
- **One shared automaton model drives three interfaces**: the same `FA`/`State`/`Edges` classes back the command-line compressor/decompressor, the Swing GUI (`GUI.java`), and a small synthetic-test generator (`sierPinski`, `checkerBoard`) used to produce known-structure automata for validating the DFS/rendering pipeline independent of real image input.
- **Regression-style test harness**: `tests/input` holds source PNGs, `tests/cmp` the compressed automaton files, `tests/dec` the decompressed reconstructions, and `tests/invalid` deliberately malformed automata to exercise the validation path — a black-box test structure the student built around the tool rather than relying on the course's grading harness alone.

## Screenshot

| File | Shows |
| --- | --- |
| `01-decompression-gui.jpg` | The Swing GUI's decompression view: the raw DFA transition triples read from a compressed automaton file (left) alongside the reconstructed bitmap (right) — in this case an eye image, showing the compression scheme's fidelity on a non-geometric, textured source image rather than just a synthetic fractal test case. |
