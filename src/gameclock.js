/* =========================
   Tick-based Day Clock
   ========================= */

const GameClock = (maxTicks) => {
    const DAY_TICKS = 600,
        TICK_MS = 200;
    const config = { DAY_TICKS, TICK_MS };
    const state = { day: 1, tick: 0, timer: null, paused: false };
    const listeners = {
        tick: new Set(),
        endOfDay: new Set(),
        update: new Set(),
    };
    let maxDayTicks = maxTicks || Infinity;

    const on = (event, fn) => {
        listeners[event]?.add(fn);
        return () => listeners[event]?.delete(fn);
    };
    const emit = (event, payload) => {
        listeners[event]?.forEach((fn) => fn(payload));
    };

    function tickOnce() {
        state.tick += 1;
        emit("tick", { state, config });
        emit("update", { state, config });
        if (state.tick >= DAY_TICKS) endOfDay();
        if ((maxDayTicks -= 1) <= 0) pause();
    }
    function endOfDay() {
        state.day += 1;
        state.tick = 0;
        emit("endOfDay", { state, config });
        emit("update", { state, config });
    }
    function play() {
        if (state.timer) return;
        state.paused = false;
        state.timer = setInterval(tickOnce, TICK_MS);
        emit("update", { state, config });
    }
    function pause() {
        if (!state.paused) emit("update", { state, config });
        state.paused = true;
        clearInterval(state.timer);
        state.timer = null;
    }
    function togglePause() {
        state.timer ? pause() : play();
    }
    function init() {
        emit("update", { state, config });
        play();
    }
    function getState() {
        return state;
    }

    return { init, play, pause, togglePause, on, getState, config };
};
export default GameClock;
