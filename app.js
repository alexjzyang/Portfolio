import GameClock from "./src/gameclock.js";
import { updateTimeHud } from "./src/ui.js";

const gameClock = GameClock(onTick);
gameClock.init();

function onTick(state) {
    updateTimeHud(state);
}
