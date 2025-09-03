/* =========================
   Tick-based Day Clock + Tasks
   ========================= */

const GameClock = (onTick) => {
    // --- Config ---
    const DAY_TICKS = 40; // ticks per day
    const TICK_MS = 100; // real-time ms per tick (tweak feel)

    // Expose for other modules if needed
    const config = { DAY_TICKS, TICK_MS };

    // --- State ---
    const state = {
        day: 1,
        tick: 0, // 0..DAY_TICKS
        timer: null, // setInterval handle
        // inTask: null, // { key, name, remaining, onComplete }
        paused: false,
        // Example resources—hook these into your existing resource manager
        // resources: { food: 0, wood: 0, morale: 10 },
    };

    // --- Advance one tick ---
    function tickOnce() {
        // if (state.paused) return;
        console.log("Tick once");
        // Advance global time
        state.tick += 1;
        if (state.tick >= DAY_TICKS) {
            endOfDay();
        }
        onTick();
        // updateTimeHud();
    }
    function endOfDay() {
        state.day += 1;
        state.tick = 0;
    }
    // --- Controls ---
    function play() {
        if (state.timer) return;
        state.paused = false;
        state.timer = setInterval(tickOnce, TICK_MS);
        // updateTimeHud();
    }

    function pause() {
        state.paused = true;
        if (state.timer) clearInterval(state.timer);
        state.timer = null;
        // updateTimeHud();
    }

    function togglePause() {
        if (state.timer) pause();
        else play();
    }

    // --- Bootstrap ---
    function init() {
        // updateTimeHud();
        play(); // start automatically; or call manually from your init
    }

    // --- Getters ---
    function getState() {
        return state;
    }
    // --- Expose ---
    return {
        init,
        play,
        pause,
        togglePause,
        getState,
        // startTask,
        config,
        // state, // expose for debugging/dev tools
        // TASKS, // so you can add/modify tasks elsewhere
    };
};

export default GameClock;
