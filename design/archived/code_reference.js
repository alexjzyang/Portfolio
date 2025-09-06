/* =========================
   Tick-based Day Clock + Tasks
   ========================= */

const GameClock = (() => {
    // --- Config ---
    const DAY_TICKS = 100; // ticks per day
    const TICK_MS = 200; // real-time ms per tick (tweak feel)

    // Expose for other modules if needed
    const config = { DAY_TICKS, TICK_MS };

    // --- State ---
    const state = {
        day: 1,
        tick: 0, // 0..DAY_TICKS
        timer: null, // setInterval handle
        inTask: null, // { key, name, remaining, onComplete }
        paused: false,
        // Example resources—hook these into your existing resource manager
        resources: { food: 0, wood: 0, morale: 10 },
    };

    // --- Tasks dictionary ---
    // Each task has: duration (ticks), onComplete(state) to mutate resources, and an optional canStart(state)
    const TASKS = {
        forage: {
            name: "Forage for Food",
            duration: 20,
            onComplete: (s) => {
                s.resources.food += 3;
            },
        },
        chop: {
            name: "Chop Wood",
            duration: 25,
            onComplete: (s) => {
                s.resources.wood += 4;
            },
        },
        // Example of a task that consumes something to run
        tend_fire: {
            name: "Tend Fire",
            duration: 10,
            canStart: (s) => s.resources.wood >= 1,
            onStart: (s) => {
                s.resources.wood -= 1;
            }, // pay cost up front
            onComplete: (s) => {
                /* mark fire benefit for EoD if you want later */
            },
        },
    };

    // --- DOM helpers (safe if elements missing) ---
    const el = (id) => document.getElementById(id);
    const setText = (id, text) => {
        const n = el(id);
        if (n) n.textContent = text;
    };
    const setBarPct = (id, pct) => {
        const n = el(id);
        if (n) n.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    };

    function updateTimeHud() {
        setText("dayLabel", `Day ${state.day}`);
        setText("tickLabel", `${state.tick} / ${DAY_TICKS}`);
        setBarPct("timeBar", (state.tick / DAY_TICKS) * 100);
        setText(
            "taskLabel",
            state.inTask
                ? `Working: ${state.inTask.name} (${state.inTask.remaining}t left)`
                : "No task"
        );
    }

    // --- Public API: start a task by key ---
    function startTask(key) {
        if (state.inTask) return false; // already busy
        const def = TASKS[key];
        if (!def) return false;

        // optional gate
        if (def.canStart && !def.canStart(state)) return false;

        state.inTask = {
            key,
            name: def.name,
            remaining: def.duration,
            onComplete: def.onComplete || (() => {}),
        };
        if (def.onStart) def.onStart(state);
        updateTimeHud();
        return true;
    }

    // --- Advance one tick ---
    function tickOnce() {
        if (state.paused) return;
        if (state.tick >= DAY_TICKS) {
            // Safety: if we overshoot due to timing, immediately end day
            endOfDay();
            return;
        }

        // Progress current task, if any
        if (state.inTask) {
            state.inTask.remaining -= 1;
            if (state.inTask.remaining <= 0) {
                // Finish task
                try {
                    state.inTask.onComplete(state);
                } catch (e) {
                    console.error(e);
                }
                state.inTask = null;
                // You could add a toast/message here like "You finished Foraging (+3 Food)"
            }
        }

        // Advance global time
        state.tick += 1;
        updateTimeHud();

        // If we just hit the end, run EoD sequence
        if (state.tick >= DAY_TICKS) {
            endOfDay();
        }
    }

    // --- End of Day handling ---
    function endOfDay() {
        // Apply upkeep (Phase 1 minimal example)
        // Tune these or hook to your design manager
        const upkeep = {
            food: -2,
            morale: -1,
        };

        state.resources.food += upkeep.food;
        state.resources.morale += upkeep.morale;

        // Example fail state
        if (state.resources.morale <= 0) {
            state.resources.morale = 0;
            pause();
            setText("taskLabel", "Game Over: Morale reached 0");
            console.warn("Game Over: Morale 0");
            updateTimeHud();
            return;
        }

        // New day
        state.day += 1;
        state.tick = 0;
        state.inTask = null;

        // Optional: small narrative or unlock checks here

        updateTimeHud();
    }

    // --- Controls ---
    function play() {
        if (state.timer) return;
        state.paused = false;
        state.timer = setInterval(tickOnce, TICK_MS);
        updateTimeHud();
    }

    function pause() {
        state.paused = true;
        if (state.timer) clearInterval(state.timer);
        state.timer = null;
        updateTimeHud();
    }

    function togglePause() {
        if (state.timer) pause();
        else play();
    }

    // --- Bootstrap ---
    function init() {
        updateTimeHud();
        play(); // start automatically; or call manually from your init
    }

    // --- Expose ---
    return {
        init,
        play,
        pause,
        togglePause,
        startTask,
        config,
        state, // expose for debugging/dev tools
        TASKS, // so you can add/modify tasks elsewhere
    };
})();

/* ====== Example: wire buttons to tasks ======
   Hook this up to your existing buttons.
   If your HTML has buttons with these IDs, this will Just Work™.
*/
const bindIf = (id, fn) => {
    const n = document.getElementById(id);
    if (n) n.addEventListener("click", fn);
};

window.addEventListener("DOMContentLoaded", () => {
    GameClock.init();
    bindIf("btnForage", () => GameClock.startTask("forage"));
    bindIf("btnChop", () => GameClock.startTask("chop"));
    bindIf("btnTendFire", () => GameClock.startTask("tend_fire"));
    bindIf("btnPause", () => GameClock.togglePause());
});
