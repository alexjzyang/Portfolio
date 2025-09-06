// Morale subsystem: continuous, condition-based decay with per-tick updates

export class MoraleMeter {
    constructor(initial, options = {}) {
        const {
            min = 0,
            max = 10,
            baseRatePerDay = -1, // negative means decay per day
            clamp = true,
        } = options;

        this.value = initial;
        this.min = min;
        this.max = max;
        this.baseRatePerDay = baseRatePerDay;
        this.clamp = clamp;

        // simple modifiers model: combine adds and muls
        // modifiers[name] = { add, mul }
        this.modifiers = new Map();
    }

    // One-off change (e.g., rest event, celebration)
    add(delta) {
        this.value += delta;
        if (this.clamp) this._applyClamp();
        return this.value;
    }

    setModifier(name, { add = 0, mul = 1 } = {}) {
        this.modifiers.set(name, { add, mul });
    }

    clearModifier(name) {
        this.modifiers.delete(name);
    }

    clearAllModifiers() {
        this.modifiers.clear();
    }

    // Effective rate per day after modifiers
    getEffectiveRatePerDay() {
        let add = 0;
        let mul = 1;
        for (const m of this.modifiers.values()) {
            add += m.add || 0;
            mul *= m.mul || 1;
        }
        return (this.baseRatePerDay + add) * mul;
    }

    // Applies continuous change over ticks. Negative rate reduces morale.
    // dayTicks is ticks per in-game day, e.g., 600.
    tick(ticks = 1, dayTicks = 600) {
        const ratePerDay = this.getEffectiveRatePerDay();
        const delta = (ratePerDay * ticks) / dayTicks;
        this.value += delta;
        if (this.clamp) this._applyClamp();
        return this.value;
    }

    _applyClamp() {
        if (this.value < this.min) this.value = this.min;
        if (this.value > this.max) this.value = this.max;
    }

    getState(dayTicks = 600) {
        const perDay = this.getEffectiveRatePerDay();
        return {
            value: this.value,
            min: this.min,
            max: this.max,
            baseRatePerDay: this.baseRatePerDay,
            effectiveRatePerDay: perDay,
            effectiveRatePerTick: perDay / dayTicks,
        };
    }
}

// Convenience: default morale tuned to docs
// - Starts at 10, decays 1/day with fire on, 2/day with fire off (via modifier)
export function createDefaultMorale() {
    const morale = new MoraleMeter(10, { min: 0, max: 10, baseRatePerDay: -1 });
    return morale;
}

// Helper to reflect fire state: doubles decay when fire is off
export function applyFireModifier(morale, fireOn) {
    // mul=1 when fire on; mul=2 when fire off doubles decay
    morale.setModifier("fire", { add: 0, mul: fireOn ? 1 : 2 });
}

