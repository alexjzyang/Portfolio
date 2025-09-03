# Survivors Camp – Phase 1 Level Design & Systems

## 🎯 Phase 1 Goal
The player’s objective is to **sustain basic needs with ease** through:
- Gathering essential resources (food, water, wood, stone, morale).
- Building simple camp structures.
- Crafting basic tools.
- Using automation/efficiency upgrades to reduce effort over time.

No other campers join in Phase 1. The game ends if **morale reaches 0**.

---

## ⏱️ Core Game Loop
1. **Game Clock**
   - Day = fixed number of ticks (e.g. 100 ticks).
   - Tasks consume ticks.
   - End of day = survival costs applied.

2. **Player Actions (Tasks)**
   - Forage food (20 ticks → +3 food).
   - Fetch water (15 ticks → +2 water).
   - Chop wood (25 ticks → +4 wood).
   - Tend fire (10 ticks → consumes wood, keeps morale stable).
   - (Later) Gather stone, forage herbs.

3. **End of Day Upkeep**
   - Food: –2/day.
   - Water: –2/day.
   - Morale: –1 baseline.
     - Extra –2 if fire is out.
     - Extra –1 if food or water missing.
     - Extra –3 if both missing.
     - +1 if fire burns all night.
     - +1 if food & water are both above required.

---

## 📦 Resources & Interdependencies

### Core Resources
- **Food 🍖**: survival. Obtained by foraging/hunting.
- **Water 💧**: survival. Obtained from fetching/collectors.
- **Wood 🌲**: fuel, building. Obtained by chopping.
- **Morale 🧠**: sanity. Sustained by food, water, and fire.
- **Stone ⛰️**: building upgrades. Obtained by gathering (mid-phase).

### Optional/Supporting
- **Herbs 🌿**: small morale/survival boosts.
- **Fire 🔥**: consumes wood → sustains morale.

### Dependencies
- Food + Water → sustain survival.
- Wood → fuels fire (protects morale) + used for upgrades.
- Stone + Wood → structures/tools.
- Herbs → optional morale boost.

---

## 🔨 Crafting & Upgrades (Examples)
- **Campfire**: burns wood, reduces morale loss.
- **Campfire Upgrade** (wood + stone): consumes less wood per night.
- **Water Collector**: generates passive water daily.
- **Foraging Basket**: increases food yield.
- **Stone Tools**: reduce wood gathering time.

---

## 📈 Daily Progression Proposal (First 7 Days)
- **Day 1–2**: Player manually gathers, survival is tight.
- **Day 3**: Unlock campfire upgrade.
- **Day 4**: Unlock water collector.
- **Day 5**: Unlock foraging basket.
- **Day 6**: Unlock stone tools.
- **Day 7**: Player can sustain needs with less micromanagement.

---

## 🧩 High-Level Systems Checklist

### Core Systems
- [ ] **Game Clock** (tick counter, day counter).
- [ ] **Resource Manager** (tracks food, water, wood, stone, morale).
- [ ] **Task System** (time cost + yield).
- [ ] **Crafting/Upgrades** (resource recipes → effects).
- [ ] **World State** (fire, weather [future]).
- [ ] **Progression Manager** (day milestones, unlocks).
- [ ] **End of Day Loop** (consumption, morale changes, fail checks).

### Supporting Systems
- [ ] **UI for Tasks** (buttons or menu to choose actions).
- [ ] **UI for Resources** (display counters with icons).
- [ ] **UI for Time** (clock or progress bar).
- [ ] **Narrative Messages** (snippets tied to events/unlocks).

---

## 📝 Narrative Examples
- **Food**: “Your stomach growls, demanding sustenance.”
- **Water**: “Your throat is dry; the river is a lifeline.”
- **Wood**: “The forest looms, both shelter and danger.”
- **Morale**: “Your mind drifts into dark thoughts. The fire keeps them at bay.”
- **Stone**: “Cold, unyielding stones—shaping them may shape your future.”
- **Fire**: “The flames dance. Without them, shadows creep closer.”

