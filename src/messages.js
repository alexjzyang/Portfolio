// const DAILY_MESSAGES = [
//     "The sun rises quietly over camp.",
//     "It is rainy today; everything feels damp.",
//     "A cold wind blows through the trees.",
//     "Birdsong greets the morning air.",
//     "Clouds gather, but no storm comes yet.",
//     "Many days have passed, and you endure.",
//     "The fire crackles softly through the night.",
//     "Morning dew soaks your boots.",
//     "Stars still linger faintly in the dawn sky.",
//     "The woods are eerily silent today.",
//     "Distant thunder rumbles but never arrives.",
//     "The camp feels strangely peaceful this morning.",
//     "Shadows stretch long as the sun climbs slowly.",
//     "Your breath fogs in the chill morning air.",
//     "The day begins with a restless stillness.",
//     "Rustling leaves echo around the camp.",
//     "The air smells of rain carried on the wind.",
//     "A gentle breeze offers some comfort.",
//     "The forest canopy filters golden sunlight.",
//     "It feels as if time is moving slowly today.",
// ];

// export function getGreetingMessage() {
//     const msg =
//         DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)];
//     return msg;
// }

const THE_STORY = {
    1: [
        "The camp is quiet as you prepare for the days ahead.",
        "Morning light breaks gently through the trees.",
        "The first day feels almost like routine.",
    ],
    2: [
        "A light rain patters against the leaves.",
        "The forest air is damp and heavy.",
        "Your boots sink slightly into the wet ground.",
    ],
    3: [
        "Clouds drift low, muting the sunlight.",
        "The campfire smolders, slow to catch flame.",
        "A restless unease creeps into the quiet.",
    ],
    4: [
        "Halfway through. Fatigue hums in the background.",
        "Shadows feel longer, though the day is still young.",
        "The rhythm of survival sets in.",
    ],
    5: [
        "The forest grows oddly still.",
        "Every small sound makes you turn your head.",
        "Supplies weigh heavier in your mind than your pack.",
    ],
    6: [
        "The night’s chill lingers even into the morning.",
        "Your steps feel slower, though the path hasn’t changed.",
        "Only resolve keeps you upright now.",
    ],
    7: [
        "The last dawn rises. One more day.",
        "Your body aches, but the end is near.",
        "The silence feels almost sacred this morning.",
    ],
    8: [
        "The final day dawns, and you are still here.\nTHE END",
        "Hope flickers like the dying embers of the fire.\nTHE END",
        "You have come so far, but the end is in sight.\nTHE END",
    ],
};

export function getStory(day) {
    const options = THE_STORY[day] || [];
    if (options.length === 0) return "";
    return options[Math.floor(Math.random() * options.length)];
}
