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

export function updateTimeHud(state) {
    setText("dayLabel", `Day ${state.day}`);
    setText("tickLabel", `${state.tick} / ${state.config.DAY_TICKS}`);
    setBarPct("timeBar", (state.tick / state.config.DAY_TICKS) * 100);
    // setText(
    //     "taskLabel",
    //     state.inTask
    //         ? `Working: ${state.inTask.name} (${state.inTask.remaining}t left)`
    //         : "No task"
    // );
}
