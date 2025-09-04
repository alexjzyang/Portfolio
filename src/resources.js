export const CONSTANTS = {
    initial: { food: 5, water: 3, wood: 2, morale: 10 },
    dailyUse: { food: 10, water: 8, woodForFire: 4 }, // consumed at end of day
    moralePerDay: { fireOn: -1, fireOff: -2 },
    yields: {
        food: { amount: 3, duration: 40 }, // per action
        water: { amount: 5, duration: 80 },
        wood: { amount: 2, duration: 65 },
    },
};

class Resource {
    constructor(name, initialAmount, yieldInfo, dailyUpkeep = 0) {
        this.name = name;
        this.amount = initialAmount;
        this.yield = yieldInfo.amount;
        this.gatherDuration = yieldInfo.duration;
        this.dailyUpkeep = dailyUpkeep;
    }

    consume(value) {
        this.amount -= value;
    }

    add(value) {
        this.amount += value;
    }

    getAmount() {
        return this.amount;
    }

    getYield() {
        return this.yield;
    }
}

// Create resources
export const food = new Resource(
    "food",
    CONSTANTS.initial.food,
    CONSTANTS.yields.food
);
export const water = new Resource(
    "water",
    CONSTANTS.initial.water,
    CONSTANTS.yields.water
);
export const wood = new Resource(
    "wood",
    CONSTANTS.initial.wood,
    CONSTANTS.yields.wood
);

// Actions to gather resources, returning the duration (time cost) in ticks
export function gatherFood() {
    food.add(food.getYield().amount);
    return food.getYield().duration;
}

export function gatherWater() {
    water.add(water.getYield().amount);
    return water.getYield().duration;
}

export function gatherWood() {
    wood.add(wood.getYield().amount);
    return wood.getYield().duration;
}
