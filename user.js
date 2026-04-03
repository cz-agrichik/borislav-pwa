(function () {

  const STORAGE_KEY = "math-trainer-user";

  let user = null;

  let overlayEl = null;
  let inputEl = null;

  const listeners = [];

  // --- THEMES ---

  const THEMES = [
    { id: "indigo", bg: "#eef2ff", topbar: "#4f46e5" },
    { id: "blue",   bg: "#ecfeff", topbar: "#0284c7" },
    { id: "green",  bg: "#f0fdf4", topbar: "#16a34a" },
    { id: "orange", bg: "#fff7ed", topbar: "#ea580c" },
    { id: "pink",   bg: "#fdf2f8", topbar: "#db2777" },
    { id: "purple", bg: "#faf5ff", topbar: "#9333ea" },
    { id: "yellow", bg: "#fefce8", topbar: "#ca8a04" },
    { id: "slate",  bg: "#f1f5f9", topbar: "#334155" }
  ];

  // --- utils ---

  function guid() {
    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getTheme() {
    return THEMES.find(t => t.id === user.themeId) || THEMES[0];
  }

  function control(sel) {
    const el = overlayEl.querySelector(sel);

    return {
      el,

      val(v) {
        if (!el) return;

        if (v === undefined) return el.value;
        el.value = v;
      },

      on(event, handler) {
        if (!el) return;
        el.addEventListener(event, handler);
      }
    };
  }

  // --- state ---

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      user = JSON.parse(raw);

      if (!user.themeId) {
        user.themeId = "indigo";
      }
      if (!user.topicStats) {
        user.topicStats = {};
      }
      if (!user.baseLevel) {
        user.baseLevel = "none";
      }
      if (!user.learnSpeed) {
        user.learnSpeed = 4;
      }
      if (!user.pointsSymbol) {
        user.pointsSymbol = "";
      }
    } else {
      user = {
        id: guid(),
        name: "Ученица",
        themeId: "indigo",
        topicStats: {},
        isNew: true,
        baseLevel: "none"
      };
      save();
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  function emit() {
    listeners.forEach(fn => fn(user));
  }

  // --- public API ---

  function get() {
    return user;
  }

  function setName(name) {
    const next = name || "Игрок";
    if (next === user.name) return;

    user.name = next;
    save();
    emit();
  }

  function setTheme(id) {
    if (user.themeId === id) return;

    user.themeId = id;
    save();
    applyTheme();
    emit();
  }

  function setLearnSpeed(val) {
    if (user.learnSpeed === val) return;

    user.learnSpeed = val;
    save();
    emit();
  }

  function getLearnSpeed() {
    return user.learnSpeed || 4;
  }

  function ensureTopicStats(typeId) {
    if (!user) {
      load();
    }
    if (!user.topicStats) {
      user.topicStats = {};
    }
    if (!user.topicStats[typeId]) {
      user.topicStats[typeId] = {
        currentStreak: 0,
        maxStreak: 0
      };
  }

  return user.topicStats[typeId];
}

  function getTopicStats(typeId) {
    return ensureTopicStats(typeId);
  }

  function recordTopicSuccess(typeId) {
    const stats = ensureTopicStats(typeId);

    const next = {
      currentStreak: stats.currentStreak + 1,
      maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1)
    };

    user.topicStats[typeId] = next;

    save();
    emit();
  }

  function recordTopicFail(typeId) {
    const stats = ensureTopicStats(typeId);

    stats.currentStreak = 0;

    save();
    emit();
  }

  function setBaseLevel(level) {
    if (user.baseLevel === level) return;

    user.baseLevel = level;
    save();
    emit();
  }

  function setPointsSymbol(symbol) {
    if (user.pointsSymbol === symbol) return;

    user.pointsSymbol = symbol;
    save();
    emit();
  }

  function getPointsSymbol() {
    return user.pointsSymbol || "";
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  // --- apply theme ---

  function applyTheme() {
    const t = getTheme();

    document.body.style.background = t.bg;

    const headers = document.querySelectorAll("header.topbar");
    headers.forEach(h => {
      h.style.background = t.topbar;
    });
  }

  // --- UI ---

  function bindUI(containerEl) {
    overlayEl = containerEl || document.createElement("div");

    inputEl = overlayEl.querySelector("input");
    const saveBtn = overlayEl.querySelector("#saveBtn");
    const backBtn = overlayEl.querySelector("#backBtn");
    const grid = overlayEl.querySelector(".theme-grid");

    // render themes
    THEMES.forEach(theme => {
      const el = document.createElement("div");

      el.style.width = "42px";
      el.style.height = "42px";
      el.style.borderRadius = "10px";
      el.style.cursor = "pointer";

      el.style.background = `linear-gradient(
        to bottom,
        ${theme.topbar} 0%,
        ${theme.topbar} 40%,
        ${theme.bg} 40%,
        ${theme.bg} 100%
      )`;

      el.style.border =
        theme.id === user.themeId
          ? "3px solid #111"
          : "2px solid #fff";

      el.addEventListener("click", () => {
        setTheme(theme.id);

        [...grid.children].forEach(c => c.style.border = "2px solid #fff");
        el.style.border = "3px solid #111";
      });

      grid.appendChild(el);

      const baseSelect = overlayEl.querySelector("#baseLevelSelect");
      baseSelect.value = user.baseLevel;
      baseSelect.addEventListener("change", () => {
        setBaseLevel(baseSelect.value);
      });

      const learnSelect = overlayEl.querySelector("#learnSpeedSelect");
      learnSelect.value = user.learnSpeed;

      learnSelect.addEventListener("change", () => {
        setLearnSpeed(parseInt(learnSelect.value, 4));
      });

      const symbolSelect = overlayEl.querySelector("#pointsSymbolSelect");
      symbolSelect.value = user.pointsSymbol;

      symbolSelect.addEventListener("change", () => {
        setPointsSymbol(symbolSelect.value);
      });
    });

    saveBtn.addEventListener("click", () => {
      setName(inputEl.value);
      close();
    });

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        close();
      });
    }

    const withdrawInput = overlayEl.querySelector("#withdrawInput");
    const withdrawBtn = overlayEl.querySelector("#withdrawBtn");

    withdrawBtn.addEventListener("click", () => {
      const amount = parseInt(withdrawInput.value, 10) || 0;

      if (amount <= 0) return;

      const ok = confirm(`Точно хочешь выплатить ${amount}?`);
      if (!ok) return;

      const need = amount * 5;
      const current = window.Stats.getScore();

      if (current < need) {
        alert("Пока не хватает баллов 🙂");
        return;
      }

      window.Stats.addScore(-need);

      alert("Готово! 💸");
      emit();
    });

    const exportBtn = overlayEl.querySelector("#exportBtn");

    exportBtn.addEventListener("click", () => {
      exportUserData();
    });

    const importBtn = overlayEl.querySelector("#importBtn");
    const importInput = overlayEl.querySelector("#importInput");

    importBtn.addEventListener("click", () => {
      importInput.click();
    });

    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      importUserData(file);
    });
  }

  function exportUserData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);

      if (!data) {
        alert("Нет данных для экспорта");
        return;
      }

      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const userName = (user.name || "user").replace(/\s+/g, "_");

      a.download = `${userName}_profile.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Ошибка экспорта");
    }
  }

  function importUserData(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const text = e.target.result;
        const parsed = JSON.parse(text);

        const ok = confirm("Перезаписать текущий профиль?");
        if (!ok) return;

        // 🔥 сохраняем
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

        // 🔄 перезагружаем состояние
        user = parsed;

        // гарантируем поля (важно для старых файлов)
        if (!user.themeId) user.themeId = "indigo";
        if (!user.topicStats) user.topicStats = {};
        if (!user.baseLevel) user.baseLevel = "none";
        if (!user.learnSpeed) user.learnSpeed = 4;
        if (!user.pointsSymbol) user.pointsSymbol = "";

        save();
        applyTheme();
        emit();
        refreshUI();

        alert("Профиль загружен ✅");
      } catch (err) {
        console.error(err);
        alert("Ошибка загрузки файла");
      }
    };

    reader.readAsText(file);
  }

  function refreshUI() {
    if (!overlayEl) return;

    // имя
    if (inputEl) {
      inputEl.value = user.name;
    }

    // селекты
    const baseSelect = overlayEl.querySelector("#baseLevelSelect");
    if (baseSelect) baseSelect.value = user.baseLevel;

    const learnSelect = overlayEl.querySelector("#learnSpeedSelect");
    if (learnSelect) learnSelect.value = user.learnSpeed;

    const symbolSelect = overlayEl.querySelector("#pointsSymbolSelect");
    if (symbolSelect) symbolSelect.value = user.pointsSymbol;

    // тема (рамки)
    const grid = overlayEl.querySelector(".theme-grid");
    if (grid) {
      [...grid.children].forEach((el, i) => {
        const theme = THEMES[i];
        el.style.border =
          theme.id === user.themeId
            ? "3px solid #111"
            : "2px solid #fff";
      });
    }

    // прогресс
    renderProgress();
  }

  function renderProgress() {
    const el = overlayEl.querySelector("#progressList");
    if (!el || !window.ProblemGen) return;

    const groups = {
      touch: [],
      active: [],
      progress: [],
      repeat: [],
      complete: []      
    };

    window.ProblemGen.getDifficultyPolicy().forEach(p => {
      if (groups[p.level]) {
        groups[p.level].push(p.item);
      }
    });

    function renderList(arr, title, color, bg) {
      if (!arr.length) return "";

      return `
        <div style="margin-bottom:12px;">
          <div style="font-weight:600; color:${color}; margin-bottom:6px;">
            ${title}
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${arr.map(id => {
              const stats = window.User.getTopicStats(id);
              const hint = `текущий: ${stats.currentStreak}, достигнутый: ${stats.maxStreak}`;

              return `
                <span
                  data-hint="${hint}"
                  class="topic-pill"
                  style="
                    padding:4px 8px;
                    border-radius:999px;
                    background:${bg};
                    position:relative;
                    cursor:pointer;
                  "
                >
                  ${window.ProblemGen.taskTypeTitle(id)}
                </span>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    el.innerHTML =
      renderList(groups.touch, "Начали", "#ca8a04", "#fef3c7") + 
      renderList(groups.active, "Проходится", "#2563eb", "#dbeafe") +
      renderList(groups.progress, "Получается", "#7c3aed", "#ede9fe") +
      renderList(groups.repeat, "Повторяется", "#16a34a", "#dcfce7") +
      renderList(groups.complete, "Завершено", "#6b7280", "#e5e7eb")

    overlayEl.querySelectorAll(".topic-pill").forEach(el => {
      el.addEventListener("click", () => showHint(el));
    });
  }

  function open() {
    inputEl.value = user.name;
    renderProgress();

    if (hostContainer) {
      document.getElementById("mainPage").hidden = true;
      hostContainer.hidden = false;
      return;
    }

    overlayEl.classList.remove("hidden");
    overlayEl.setAttribute("aria-hidden", "false");
  }

  function close() {
    if (hostContainer) {
      hostContainer.hidden = true;
      document.getElementById("mainPage").hidden = false;
      return;
    }

    overlayEl.classList.add("hidden");
    overlayEl.setAttribute("aria-hidden", "true");
  }

  let hostContainer = null;

  function init(containerEl) {
    hostContainer = containerEl || null;
    load();
    bindUI(containerEl);
    applyTheme();
    emit();

    if (user.isNew) {
      setTimeout(() => {
        open();
        user.isNew = false;
        save();
      }, 0);
    }
  }

  function showHint(el) {
    document.querySelectorAll(".hint-popup").forEach(e => e.remove());

    const hint = el.getAttribute("data-hint");

    const popup = document.createElement("div");
    popup.className = "hint-popup";
    popup.textContent = hint;

    popup.style.position = "absolute";
    popup.style.bottom = "120%";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.background = "#111";
    popup.style.color = "#fff";
    popup.style.padding = "6px 10px";
    popup.style.borderRadius = "8px";
    popup.style.fontSize = "12px";
    popup.style.whiteSpace = "nowrap";
    popup.style.zIndex = "10";

    el.appendChild(popup);

    setTimeout(() => popup.remove(), 1500);
  }

  // --- export ---

  window.User = {
    init,
    open,
    get,
    onChange,
    setName,
    setTheme,
    getTopicStats,
    recordTopicSuccess,
    recordTopicFail,
    setBaseLevel,
    setLearnSpeed,
    getLearnSpeed,
    setPointsSymbol,
    getPointsSymbol,
  };

})();