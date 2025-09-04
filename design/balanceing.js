//==== Resource Design ====//
// Survival game with basic resources: food, water, wood, morale
// Food and water are consumed daily
// Wood is used to keep fire burning, affecting morale.

//---- Initial Resources ----//
// food: 5
// morale: 10
// water: 3
// wood: 2

//---- Daily Consumption (Phase 1) ----//
// Food: –10
// Water: –8
// Firewood: –4 needed for fire and morale

//---- Yield ----//
// Food: 3 per 40 ticks
// Water: 5 per 80 ticks
// Wood: 2 per 65 ticks

//---- Morale ----//
// Wood is used to keep the fire burning. If the fire is out, morale drops faster.
// Each unit of wood lasts 600/4 = 150 ticks 4 wood is needed per day.
// 1 morale is lost per day if the fire is burning, 2 morale is lost per day if the fire is out.
