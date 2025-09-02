import { getStory } from "./messages.js";
export function updateUI(state) {
    const dayEl = document.getElementById("status-day");
    const foodEl = document.getElementById("status-food");
    const moraleEl = document.getElementById("status-morale");
    const woodEl = document.getElementById("status-wood");

    dayEl.innerText = `${state.day}`;
    foodEl.innerText = `${state.food}`;
    moraleEl.innerText = `${state.morale}`;
    woodEl.innerText = `${state.wood}`;

    const gameoverLabelEl = document.getElementById("gameover-label");
    state.gameover
        ? (gameoverLabelEl.innerText = "Game Over")
        : (gameoverLabelEl.innerText = "");

    const storyLineEl = document.getElementById("story-line");
    storyLineEl.innerText = getStory(state.day);

    const messageLineEl = document.getElementById("message-line");
    messageLineEl.innerText = state.message;
}
