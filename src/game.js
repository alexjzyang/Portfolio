// Imports
// import readline from "node:readline";

// state
let day, food, morale, wood, gameover;
// events
let forage, chop, rest, trade;

const UPKEEP = 2; // amount of food cost per day
const MAX_DAY = 100;

const INITIAL_FOOD = 5;
const INITIAL_MORALE = 2;
const INITIAL_WOOD = 2;

let message;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

forage = () => {
    const foragedFood = rand(2, 4);
    food += foragedFood;
    morale -= 1;

    message += `Foraged ${foragedFood} food; Morale decreased by 1.\n`;
};

chop = () => {
    const choppedWood = rand(3, 5);
    wood += choppedWood;
    food -= 1;

    message += `Chopped ${choppedWood} wood; Food decreased by 1.\n`;
};

rest = () => {
    morale += 2;
    food -= 1;

    message += `Rested; Morale increased by 2; Food decreased by 1.\n`;
};

trade = () => {
    if (checkTradeAvailability()) {
        let tradedFood = rand(1, 3);
        wood -= 2;
        food += tradedFood;
        message += `Traded ${tradedFood} food; Wood decreased by 2. `;
    } else {
        message += `Not enough wood to trade. `;
    }
    morale += 1;
    message += `Morale increased by 1.\n`;
};

function performAction(action) {
    if (action === "forage") {
        forage();
    } else if (action === "chop") {
        chop();
    } else if (action === "rest") {
        rest();
    } else if (action === "trade") {
        trade();
    }
}

function checkCondition() {
    if (food <= 0) {
        message += `You have run out of food!\n`;
        return true;
    }
    if (morale <= 0) {
        message += `Your morale has hit rock bottom!\n`;
        return true;
    }
    if (day === MAX_DAY) {
        message += `You have survived for a week!\n`;
        return true;
    }
    return false;
}
function checkTradeAvailability() {
    // Disable "Trade with Merchant" button if no wood is available
    return wood >= 2;
}

export function updateState(receivedAction) {
    message = "";
    // action
    performAction(receivedAction);
    // end of day
    food -= UPKEEP;
    message += `End of day ${day}: Food -${UPKEEP}\n`;
    // check progress
    gameover = checkCondition();
    day++;
    // console.log(`Day ${day}: Food ${food}, Morale ${morale}, Wood ${wood}`);
}

export function getState() {
    return { day, food, morale, wood, gameover, message };
}

function initializeGame() {
    day = 1;
    food = INITIAL_FOOD;
    morale = INITIAL_MORALE;
    wood = INITIAL_WOOD;
    gameover = false;
    message = "";
    // console.log(`Day ${day}: Food ${food}, Morale ${morale}, Wood ${wood}`);
}

initializeGame();
