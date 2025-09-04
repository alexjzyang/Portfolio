// import GameClock from "./src/gameclock.js";
// import { updateTimeHud } from "./src/ui.js";

import { Resource, Yield } from "./src/resources";

// const gameClock = GameClock(onTick);
// gameClock.init();
// console.log("clock is " + gameClock);

// function onTick(clock) {
//     updateTimeHud(clock);
// }

const INITIAL_FOOD = 5;
const INITIAL_MORALE = 5;
const INITIAL_WATER = 3;
const INITIAL_WOOD = 0;
// const INITIAL_STONE = 0;
const FOOD_YIELD = new Yield(40, 3);
const WATER_YIELD = new Yield(80, 5);
// const MORALE_YIELD = new Yield(20,2);
const WOOD_YIELD = new Yield(65, 2);
// const STONE_YIELD = new Yield(1, 4);

const food = new Resource("food", INITIAL_FOOD, FOOD_YIELD);
const water = new Resource("water", INITIAL_WATER, WATER_YIELD);
// const morale = new Resource("morale", INITIAL_MORALE, MORALE_YIELD);
const wood = new Resource("wood", INITIAL_WOOD, WOOD_YIELD);
// const stone = new Resource("stone", INITIAL_STONE, STONE_YIELD);

// Daily Consumption (Phase 1)
// Food: –10
// Water: –8
// Firewood: –4
