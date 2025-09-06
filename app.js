// Minimal Node CLI test
// Goal: hook TaskQueue to GameClock and verify gathers update resources.
// Run: node app.js

(async () => {
    const { default: GameClock } = await import("./src/gameclock.js");
    const { createDefaultResourcesManager, TaskQueue } = await import(
        "./src/resources.js"
    );

    const MAX_TICKS = 160; // longer run to see multiple completions
    const clock = GameClock(MAX_TICKS);
    const resources = createDefaultResourcesManager();
    const queue = new TaskQueue(resources);

    // Scenario plan:
    // - Start with one task (food, 40t)
    // - After it completes, add wood at t=45 (65t)
    // - Before wood finishes, enqueue another food at t=60 (40t)
    // Expected completions: food at t=40, wood at t=110, food at t=150
    queue.addTask("food");

    let tickCount = 0;
    const logProgress = (label) => {
        const r = resources.getState();
        const cur = queue.currentTask
            ? {
                  name: queue.currentTask.name,
                  remain: queue.currentTask.timeRemaining(),
              }
            : null;
        console.log(`${label} t=${tickCount}`, { r, currentTask: cur });
    };

    // Hook into task completion to log exactly when it happens
    const originalComplete = queue.completeCurrentTask.bind(queue);
    queue.completeCurrentTask = function () {
        const completed = originalComplete();
        if (completed) {
            console.log(
                `Task completed: ${completed.name} at t=${tickCount} (+${completed.amount})`
            );
        }
        return completed;
    };

    console.log("Start:");
    logProgress("state");

    // Persist task references across ticks (don’t redeclare inside tick)
    let woodTask1 = null;
    let woodTask2 = null;
    let woodTask3 = null;

    clock.on("tick", () => {
        tickCount += 1;
        // Inject tasks at specific times
        if (tickCount === 45) {
            woodTask1 = queue.addTask("wood");
            woodTask2 = queue.addTask("wood");
            woodTask3 = queue.addTask("wood");

            console.log("add wood at t=45");
        }
        if (tickCount === 60) {
            queue.addTask("food");
            console.log("add food at t=60");
            console.log(
                "There are now",
                queue.tasks.length,
                "tasks queued/n" + " tasks:",
                queue.tasks.map((t) => JSON.stringify(t)).join("\n")
            );
        }

        if (tickCount === 65 && woodTask1) {
            console.log("remove woodTask1, id=", woodTask1.id);
            queue.removeById(woodTask1.id);
        }
        if (tickCount === 70 && woodTask3) {
            console.log("remove woodTask3, id=", woodTask3.id);
            queue.removeById(woodTask3.id);
        }

        // Progress work
        queue.tick(1);

        // Regular interval logging
        if (
            tickCount === 20 ||
            tickCount === 40 ||
            tickCount === 60 ||
            tickCount === 80 ||
            tickCount === 100 ||
            tickCount === 120 ||
            tickCount === 140 ||
            tickCount === 160
        ) {
            logProgress("checkpoint");
        }

        if (tickCount === MAX_TICKS) {
            console.log("End:");
            logProgress("state");
        }
    });

    clock.init();
})();
