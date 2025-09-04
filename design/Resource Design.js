// Initial Resources
// food: 5
// morale: 10
// water: 3
// wood: 2

// Daily Consumption (Phase 1)

//---- Basic Resources ----//
// Food: –10
// Water: –8
// Firewood: –4

// 600 ticks per day

// Assume 65% of the time to work on gathering resources, which is 390 ticks.
// 45% of the working time to gather food, which is 175.5 ticks.
// 25% of the working time to gather water, which is 97.5 ticks.
// the rest 30% of the working time to gather wood, which is 117 ticks.

// let's use 40 ticks for 3 food, 80 ticks for 5 water, 65 ticks for 2 wood.
// Food: 40*10/3 = 133.33 ticks
// Water: 80*8/5 = 128 ticks
// Wood: 65*4/2 = 130 ticks
// Total: 391.33 ticks

// 391/600 = 65.22% of the time working on gathering basic resources.

//---- Morale ----//
// Wood is used to keep the fire burning. If the fire is out, morale drops faster.
// Each unit of wood lasts 600/4 = 150 ticks 4 wood is needed per day.
// 1 morale is lost per day if the fire is burning, 2 morale is lost per day if the fire is out.

//---- Storage Capacity (Future) ----//
// Food is left on the floor and goes bad after 3 days if not consumed. (based on when it is gathered, FIFO)
// Water can be stored indefinitely, but capped at 20 units of storage
// Wood can be stored indefinitely, but capped at 50 units of storage
