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

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

forage = () => {
    const foragedFood = rand(2, 4);
    food += foragedFood;
    morale -= 1;

    console.log(`Foraged ${foragedFood} food; Morale decreased by 1.`);
};

chop = () => {
    const choppedWood = rand(3, 5);
    wood += choppedWood;
    food -= 1;

    console.log(`Chopped ${choppedWood} wood; Food decreased by 1.`);
};

rest = () => {
    morale += 2;
    food -= 1;

    console.log(`Rested; Morale increased by 2; Food decreased by 1.`);
};

trade = () => {
    if (checkTradeAvailability()) {
        let tradedFood = rand(1, 3);
        wood -= 2;
        food += tradedFood;
        console.log(
            `Traded ${tradedFood} food; Wood decreased by 2; Morale increased by 1.`
        );
    } else {
        console.log("Not enough wood to trade.");
    }
    morale += 1;
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
        console.log("You have run out of food!");
        return true;
    }
    if (morale <= 0) {
        console.log("Your morale has hit rock bottom!");
        return true;
    }
    if (day === MAX_DAY) {
        console.log("You have survived for a week!");
        return true;
    }
    return false;
}
function checkTradeAvailability() {
    // Disable "Trade with Merchant" button if no wood is available
    return wood >= 2;
}

export function updateState(receivedAction) {
    // action
    performAction(receivedAction);
    // end of day
    food -= UPKEEP;
    console.log(`End of day ${day}: Food -${UPKEEP}`);
    // check progress
    gameover = checkCondition();
    day++;
    console.log(`Day ${day}: Food ${food}, Morale ${morale}, Wood ${wood}`);
}

export function getState() {
    return { day, food, morale, wood, gameover };
}

function initializeGame() {
    day = 1;
    food = INITIAL_FOOD;
    morale = INITIAL_MORALE;
    wood = INITIAL_WOOD;
    gameover = false;
    console.log(`Day ${day}: Food ${food}, Morale ${morale}, Wood ${wood}`);
}

initializeGame();
