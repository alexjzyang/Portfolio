# Project: Survivor’s Camp (MVP in a night)

## What “done” looks like:

Playable in the browser (one HTML page).
7 turns (days). Each day you type one command.
Win/lose screen with final stats.

~150 lines of JS. No frameworks. No art. No story text beyond short event blurbs.

## Core loop

Show Day, Resources.
Accept one command: forage, chop, rest, trade, help.
Apply deterministic gains/costs.
Roll one random event that tweaks resources.
Decrease food by daily upkeep (e.g., −2).
Check lose (food ≤ 0 or morale ≤ 0) or win (day > 7).

### Commands (balanced to feel meaningful)

forage → +3–6 food, −1 morale (it’s tiring)
chop → +3–5 wood, −1 food (you snack while working)
rest → +2 morale, −1 food
trade (costs 2 wood) → +1 morale, +1–3 food
Tune numbers after one playthrough

## How to playtest & iterate (fast)

Open index.html in your browser, play once.
If it feels too easy/hard, tweak three numbers only:
daily upkeep (−2 food)
forage range (3–6)
morale gains/losses
Add two more events (copy/paste pattern).
If it’s fun for 2–3 runs, consider stretch goals:
Crafting: spend wood to build snare (+1 food/day) or shelter (+1 morale/day).
Visitors: occasional options like host | decline with tradeoffs.
Save/Load: localStorage small state.
