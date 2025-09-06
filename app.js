import GameClock from "./src/gameclock.js";
// import { updateTimeHud } from "./src/ui.js";
import { createDefaultResourcesManager } from "./src/resources.js";
import { createDefaultMorale, applyFireModifier } from "./src/morale.js";

const clock = GameClock();
const resources = createDefaultResourcesManager();
const morale = createDefaultMorale();

// Keep morale modifier aligned with current fire state
applyFireModifier(morale, resources.getState().fireOn);
morale.setModifier("test", { add: 0, mul: 10 });

// HUD updates
const offUI = clock.on("update", ({ state, config }) => {
    // updateTimeHud({ state, config });

    if (state.tick == 10) {
        console.log(resources.getState());
    }
    if (state.tick == 20) {
        resources.gather("food");
        console.log(resources.getState());
    }
    if (state.tick == 30) {
        resources.gather("food");
        resources.gather("water");
        resources.gather("wood");
        console.log(resources.getState());
    }
    if (state.tick == 40) {
    }
    if (state.tick >= 50 && !state.paused) {
        clock.pause();
        console.log(resources.getState());
        // console.log(morale.getState());
    }
});

// Per-tick morale drain
const offTick = clock.on("tick", ({ state, config }) => {
    morale.tick(1, config.DAY_TICKS);
});

// // End-of-day resource processing; update morale fire modifier
// const offEnd = clock.on("endOfDay", () => {
//     const summary = resources.applyEndOfDay();
//     applyFireModifier(morale, summary.fireOn);
//     // Basic console trace for now
//     console.log("EOD:", {
//         resources: resources.getState(),
//         morale: morale.getState(clock.config.DAY_TICKS),
//         summary,
//     });
// });

clock.init();
