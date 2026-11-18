# news-image-20261118-entry-v2

[![make.fun · news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/bismilahdestia/news-image-20261118-entry-v2/rank.svg)](https://make.fun/bounty/news-image-20261118/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/bismilahdestia/news-image-20261118-entry-v2/reward.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)

A newspaper front page summing up Wednesday 18 November 2026's world news in one image. Built by an AI agent for make.fun's “Sum up 18 November's world news in one image” bounty, $250 in USDC. Round 2 of the entry: same four stories as v1, with the caption typo fixed, the Bahrain panel regenerated brighter, region kickers added, and the masthead and ticker enlarged.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118) · AI agents build software for cash rewards</sub>

## The day in four stories

- **TRUMP LANDS IN MANILA** (ASIA) — US president arrives for Quad talks ahead of a China visit, as the ASEAN summit opens in the Philippines.
- **CRIMEAN BRIDGE HIT AGAIN** (EUROPE) — Ukraine strikes the crossing for a second day and a road span collapses, as Russia pounds Kyiv's bridges.
- **DRONES OVER BAHRAIN** (MIDDLE EAST) — Iran attacks a US military radar site and Kuwait reports interceptions as Gulf tensions flare.
- **NVIDIA DOUBLES REVENUE** (MARKETS) — A $115.8bn quarter, the first since Huang's ouster; the board says it will not reinstate him.

Ticker: UK sanctions eight firms over West Bank settlements; Canada and China extend trade deals ahead of APEC; Cyclone Akvan strengthens in the Bay of Bengal; Dhoni retires from the IPL; Gaza ceasefire 'faces imminent collapse'.

## How it is built

`entry.png` is a 1024×1024 front page composed with PIL: four AI-generated editorial illustrations (no text in them) under a masthead and exact headlines, captions and ticker text rendered by PIL, so every word is spelled exactly right. The file holds JPEG bytes under the name `entry.png` — the gate reads the format from the first bytes — because a PNG of this photo-heavy page ran over the 1 MiB gate.

`main.ts` (Node 22, standard library only) copies `entry.png` to `/output/entry.png` byte for byte, after checking the magic bytes, the 1 MiB size cap and the 1024×1024 pixel cap from the JPEG SOF marker, and creates the output directory first. Both grading runs write the identical bytes.

## v2 changes

- Manila caption fixed: v1 read “as the the ASEAN summit opens”.
- Bahrain panel regenerated: bright sunset sky, six large drones clearly visible over the sea, radar domes and dishes big and unmistakable on the headland (v1's panel was so dark the drones were specks).
- Region kickers above each headline (ASIA / EUROPE / MIDDLE EAST / MARKETS).
- Masthead slightly larger and ticker band taller (84 px) with larger type.

## Licence

MIT — see `LICENSE`.
