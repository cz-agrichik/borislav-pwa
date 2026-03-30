// stats.js
(function () {
  const STORAGE_KEY = "borislav-pwa-stats";
  const SCORE_KEY = "borislav-pwa-score";

  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  let score = parseInt(localStorage.getItem(SCORE_KEY) || "0", 10);
  let currentTask = null;
  let startTime = null;

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(SCORE_KEY, score);
  }

    function startTask(text, typeId, typeLabel) {
        currentTask = {
            text,
            typeId,
            typeLabel,
            errors: 0,
            solved: false,
            timeMs: 0,
        };

        startTime = performance.now();
    }

  function recordAttempt(isCorrect, scoreDelta = 0) {
    if (!currentTask) return;

    if (isCorrect) {
      const endTime = performance.now();
      currentTask.timeMs = Math.round(endTime - startTime);
      currentTask.solved = true;

      currentTask.scoreDelta = scoreDelta;
      score += scoreDelta;
      tasks.push(currentTask);
      save();
      currentTask = null;
      startTime = null;
    } else {
      currentTask.errors += 1;
    }
  }

  function getSummary() {
    const totalSolved = tasks.length;

    const totalAttempts = tasks.reduce(
      (sum, t) => sum + t.errors + 1,
      0
    );

    const totalTimeMs = tasks.reduce(
      (sum, t) => sum + t.timeMs,
      0
    );

    const avgTimeMs = totalSolved
      ? Math.round(totalTimeMs / totalSolved)
      : 0;

    const accuracy = totalAttempts
      ? Math.round((totalSolved / totalAttempts) * 100)
      : 0;

    return {
      totalSolved,
      totalAttempts,
      totalTimeMs,
      avgTimeMs,
      accuracy,
      score,
      tasks,
    };
  }

  function getScore() {
    return score;
  }

  function reset() {
    tasks = [];
    score = 0;
    currentTask = null;
    startTime = null;
    save();
  }

  function cleanupKeepStreaks() {
    // какие типы задач сейчас активны
    const activeTypes = new Set(
      (window.ProblemGen?.difficultyPolicy || [])
        .filter(p => {
          const lvl = p.level;
          return lvl !== "complete" && lvl !== "not_started";
        })
        .map(p => p.item)
    );

    const byType = {};

    tasks.forEach(t => {

      // если задача больше не используется — пропускаем
      if (!activeTypes.has(t.typeId)) return;

      if (!byType[t.typeId]) {
        byType[t.typeId] = [];
      }

      byType[t.typeId].push(t);
    });

    const newTasks = [];

    Object.values(byType).forEach(list => {

      let streak = [];

      for (let i = list.length - 1; i >= 0; i--) {
        const t = list[i];

        if (t.errors === 0) {
          streak.push(t);
        } else {
          break;
        }
      }

      streak.reverse().forEach(t => newTasks.push(t));
    });

    tasks = newTasks;

    // пересчитываем score
    score = tasks.reduce((sum, t) => sum + (t.scoreDelta || 0), 0);

    save();
  }

  function addScore(delta) {
    score += delta;
    save();
  }

  window.Stats = {
    startTask,
    recordAttempt,
    getSummary,
    getScore,
    reset,
    cleanupKeepStreaks,
    addScore
  };
})();