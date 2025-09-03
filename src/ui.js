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

export function updateTimeHud(clock) {
    const state = clock.getState();
    const config = clock.config;

    setText("dayLabel", `Day ${state.day}`);
    setText("tickLabel", `${state.tick} / ${config.DAY_TICKS}`);
    setBarPct("timeBar", (state.tick / config.DAY_TICKS) * 100);

    // setText(
    //     "taskLabel",
    //     state.inTask
    //         ? `Working: ${state.inTask.name} (${state.inTask.remaining}t left)`
    //         : "No task"
    // );
}
