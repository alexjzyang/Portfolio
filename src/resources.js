// Central configuration for resource system
export const CONSTANTS = {
    initial: { food: 5, water: 3, wood: 2 },
    dailyUse: { food: 10, water: 8, woodForFire: 4 },
    // Morale handled in src/morale.js; keep only fire upkeep here
    yields: {
        food: { amount: 3, duration: 40 }, // per action
        water: { amount: 5, duration: 80 },
        wood: { amount: 2, duration: 65 },
    },
    caps: { water: 20, wood: 50 },
    spoilageDays: { food: 3 },
};

// Represents the output of a single gather action
export class Yield {
    constructor(duration, amount) {
        this.duration = duration; // ticks required
        this.amount = amount; // amount gathered on completion
    }
}

// Generic resource with optional cap and spoilage (FIFO batches)
export class Resource {
    constructor(name, initialAmount, yieldSpec, options = {}) {
        const { cap = Infinity, perishableDays = null } = options;
        this.name = name;
        this._cap = cap;
        this._yield = yieldSpec
            ? new Yield(yieldSpec.duration, yieldSpec.amount)
            : null;
        this._perishableDays = perishableDays;

        // If perishable, track FIFO batches: { day, amount }
        if (this._perishableDays) {
            this._batches = [];
            if (initialAmount > 0)
                this._batches.push({ day: 1, amount: initialAmount });
        } else {
            this._amount = initialAmount;
        }
    }

    get amount() {
        if (this._perishableDays) {
            return this._batches.reduce((sum, b) => sum + b.amount, 0);
        }
        return this._amount;
    }

    get cap() {
        return this._cap;
    }

    get gatherSpec() {
        return this._yield;
    }

    add(value, currentDay = 1) {
        const canAdd = Math.max(0, Math.min(value, this._cap - this.amount));
        if (canAdd <= 0) return 0;
        if (this._perishableDays) {
            this._batches.push({ day: currentDay, amount: canAdd });
        } else {
            this._amount += canAdd;
        }
        return canAdd;
    }

    remove(value) {
        const toRemove = Math.max(0, Math.min(value, this.amount));
        if (toRemove <= 0) return 0;
        if (this._perishableDays) {
            let remaining = toRemove;
            while (remaining > 0 && this._batches.length) {
                const b = this._batches[0];
                const take = Math.min(b.amount, remaining);
                b.amount -= take;
                remaining -= take;
                if (b.amount <= 0) this._batches.shift();
            }
        } else {
            this._amount -= toRemove;
        }
        return toRemove;
    }

    // Apply spoilage for perishable items at end of day
    applySpoilage(currentDay) {
        if (!this._perishableDays) return 0;
        let expired = 0;
        const keep = [];
        for (const b of this._batches) {
            if (currentDay - b.day >= this._perishableDays) {
                expired += b.amount;
            } else {
                keep.push(b);
            }
        }
        this._batches = keep;
        return expired;
    }
}

// High-level manager to coordinate multiple resources and daily rules
export class ResourcesManager {
    constructor(config = {}) {
        const cfg = {
            ...CONSTANTS,
            ...config,
            initial: { ...CONSTANTS.initial, ...(config.initial || {}) },
            dailyUse: { ...CONSTANTS.dailyUse, ...(config.dailyUse || {}) },
            yields: { ...CONSTANTS.yields, ...(config.yields || {}) },
            caps: { ...CONSTANTS.caps, ...(config.caps || {}) },
            spoilageDays: {
                ...CONSTANTS.spoilageDays,
                ...(config.spoilageDays || {}),
            },
        };

        this.day = 1;
        this.fireIsLit = true;
        this.resources = {
            food: new Resource("food", cfg.initial.food, cfg.yields.food, {
                perishableDays: cfg.spoilageDays.food ?? null,
            }),
            water: new Resource("water", cfg.initial.water, cfg.yields.water, {
                cap: cfg.caps.water ?? Infinity,
            }),
            wood: new Resource("wood", cfg.initial.wood, cfg.yields.wood, {
                cap: cfg.caps.wood ?? Infinity,
            }),
        };

        this.cfg = cfg;
    }

    get(name) {
        return this.resources[name];
    }

    // Perform a gather action immediately; returns action info
    gather(name) {
        const res = this.get(name);
        if (!res || !res.gatherSpec) return { duration: 0, added: 0 };
        const { duration, amount } = res.gatherSpec;
        const added = res.add(amount, this.day);
        return { duration, added };
    }

    // Apply end-of-day rules: consumption, fire upkeep, spoilage
    applyEndOfDay() {
        const { dailyUse } = this.cfg;
        const summary = {
            consumed: {},
            fireOn: false,
            expired: {},
        };

        // Food and water consumption
        summary.consumed.food = this.get("food").remove(dailyUse.food);
        summary.consumed.water = this.get("water").remove(dailyUse.water);

        // Fire upkeep affects morale
        const woodConsumed = this.get("wood").remove(dailyUse.woodForFire);
        const fireOn = woodConsumed >= dailyUse.woodForFire;
        this.fireIsLit = fireOn;
        summary.consumed.woodForFire = woodConsumed;
        summary.fireOn = fireOn;

        // Spoilage (food only for now)
        const expiredFood = this.get("food").applySpoilage(this.day);
        if (expiredFood > 0) summary.expired.food = expiredFood;

        this.day += 1;
        return summary;
    }

    // Snapshot for UI/debug
    getState() {
        return {
            day: this.day,
            fireOn: this.fireIsLit,
            food: this.get("food").amount,
            water: this.get("water").amount,
            wood: this.get("wood").amount,
        };
    }
}

// Convenience export of a default manager
export function createDefaultResourcesManager() {
    return new ResourcesManager();
}

let TASK_ID_SEQ = 1;
class Task {
    constructor(name, yieldSpec) {
        this.id = TASK_ID_SEQ++;
        this.name = name;
        // Snapshot duration/amount at creation in case balance changes later
        this.duration = yieldSpec?.duration || 0;
        this.amount = yieldSpec?.amount || 0;
        this._progress = this.duration;
    }
    tick(ticks = 1) {
        this._progress -= ticks;
        return this._progress <= 0;
    }
    timeRemaining() {
        return Math.max(0, this._progress);
    }
}

export class TaskQueue {
    constructor(resourceManager) {
        this.tasks = [];
        this.currentTask = null;
        this.resourceManager = resourceManager;
    }
    addTask(taskName) {
        const res = this.resourceManager.get(taskName);
        if (!res || !res.gatherSpec) return null;
        const task = new Task(taskName, res.gatherSpec);
        this.tasks.push(task);
        if (!this.currentTask) this.startNextTask();
        return task;
    }
    startNextTask() {
        if (this.tasks.length && !this.currentTask) {
            this.currentTask = this.tasks.shift() || null;
        }
        return this.currentTask;
    }
    // Cancel the currently running task (no reward) and start the next one
    cancelCurrentTask() {
        if (!this.currentTask) return null;
        const cancelled = this.currentTask;
        this.currentTask = null;
        this.startNextTask();
        return cancelled;
    }
    // Remove a pending task by 0-based index; returns the removed task or null
    removePendingByIndex(index) {
        if (index < 0 || index >= this.tasks.length) return null;
        const [removed] = this.tasks.splice(index, 1);
        return removed || null;
    }
    // Remove a task by id. If it's the current task, cancels with no reward.
    removeById(taskId) {
        if (this.currentTask && this.currentTask.id === taskId) {
            return this.cancelCurrentTask();
        }
        const idx = this.tasks.findIndex((t) => t.id === taskId);
        if (idx !== -1) return this.removePendingByIndex(idx);
        return null;
    }
    completeCurrentTask() {
        if (!this.currentTask) return null;
        const completed = this.currentTask;
        this.currentTask = null;
        // Apply the resource gain respecting caps/spoilage rules
        const res = this.resourceManager.get(completed.name);
        if (res) res.add(completed.amount, this.resourceManager.day);
        // Immediately begin next task if available
        this.startNextTask();
        return completed;
    }
    tick(ticks = 1) {
        if (!this.currentTask) this.startNextTask();
        if (!this.currentTask) return null;
        if (this.currentTask.tick(ticks)) {
            // if complete, auto-start next task
            this.completeCurrentTask();
        }
    }
}




