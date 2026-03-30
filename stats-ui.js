(function () {

  function render(containerEl) {
    const summary = window.Stats.getSummary();

    const solved = summary.totalSolved;
    const attempts = summary.totalAttempts;
    const accuracy = summary.accuracy;

    const totalSec = (summary.totalTimeMs / 1000).toFixed(1);
    const avgSec = (summary.avgTimeMs / 1000).toFixed(1);

    const accuracyLine = `Точность ${accuracy}% (${solved}/${attempts})`;

    const byType = {};

    summary.tasks.forEach(t => {
      if (!byType[t.typeLabel]) {
        byType[t.typeLabel] = {
          solved: 0,
          errors: 0,
          time: 0,
          tasks: []
        };
      }

      byType[t.typeLabel].solved += 1;
      byType[t.typeLabel].errors += t.errors;
      byType[t.typeLabel].time += t.timeMs;
      byType[t.typeLabel].tasks.push(t);
    });

    let typesHtml = "";

    if (Object.keys(byType).length === 0) {
      typesHtml = "<br><br><span style='opacity:.7'>Пока нет задач</span>";
    } else {
      typesHtml =
        "<br><br><b>По типам:</b><br><br>" +
        Object.entries(byType)
          .map(([label, data], index) => {

            const attemptsType = data.solved + data.errors;
            const accType = attemptsType
              ? Math.round((data.solved / attemptsType) * 100)
              : 0;

            const avgTypeTime = data.solved
              ? (data.time / data.solved / 1000).toFixed(1)
              : 0;

            const typeId = `type_${index}`;

            // --- streak ---
            let streak = 0;

            for (let i = data.tasks.length - 1; i >= 0; i--) {
              const t = data.tasks[i];
              if (t.errors === 0) streak++;
              else break;
            }

            const tasksList = data.tasks
              .map((t) => {
                const sec = (t.timeMs / 1000).toFixed(1);
                const attemptsTask = 1 + t.errors;
                const accuracyTask = Math.round((1 / attemptsTask) * 100);

                return `
                  <div style="margin:8px 0; padding:6px 0; border-bottom:1px solid #eee;">
                    <div style="font-weight:600;">
                      ${t.text.replace(" = ?", "")}
                    </div>
                    <div style="font-size:.85em; opacity:.7;">
                      ${sec} сек • Точность ${accuracyTask}% (1/${attemptsTask})
                    </div>
                  </div>
                `;
              })
              .reverse()
              .join("");

            return `
              <div style="margin-bottom:18px; padding:10px; border-radius:12px; background:#f8fafc;">
                <div 
                    data-type="${typeId}" 
                    style="font-weight:700; cursor:pointer;">
                    ${label} ▾
                </div>

                <div style="font-size:.9em; margin-top:4px;">
                Точность ${accType}% (${data.solved}/${attemptsType})<br>
                Среднее время: ${avgTypeTime} сек
                ${renderStreak(streak)}
                </div>

                <div id="${typeId}" style="display:none; margin-top:8px;">
                ${tasksList}
                </div>
              </div>
            `;
          })
          .join("");
    }

    containerEl.innerHTML =
      `<b>${accuracyLine}</b><br>
      Общее время: ${totalSec} сек<br>
      Среднее время: ${avgSec} сек`
      + typesHtml +
      `<br><br>
      <button id="cleanupStatsBtn" 
        style="padding:8px 12px;border-radius:10px;border:none;background:#ef4444;color:white;">
        Клинап истории
      </button>`;

    bindToggles(containerEl);
    
    const cleanupBtn = containerEl.querySelector("#cleanupStatsBtn");

    if (cleanupBtn) {
      cleanupBtn.addEventListener("click", () => {

        if (!confirm("Удалить всю историю кроме текущих стриков?")) return;

        window.Stats.cleanupKeepStreaks();

        render(containerEl);
      });
    }
  }

  function renderStreak(streak) {
    if (streak > 9) {
      return `<b style="color:#10b981;">🔥 Streak ${streak}</b>`;
    }

    if (streak > 4) {
      return `<b style="color:#10b981;">Streak ${streak}</b>`;
    }

    return `<b style="color:#111;">Streak ${streak}</b>`;
  }

  function bindToggles(containerEl) {
    const headers = containerEl.querySelectorAll("[data-type]");

    headers.forEach(header => {
        header.addEventListener("click", () => {
        const id = header.dataset.type;
        const el = containerEl.querySelector(`#${id}`);
        if (!el) return;

        el.style.display =
            el.style.display === "none" ? "block" : "none";
        });
    });
  }

  function open(overlayEl, containerEl) {
    render(containerEl);
    overlayEl.classList.remove("hidden");
    overlayEl.setAttribute("aria-hidden", "false");
  }

  function close(overlayEl) {
    overlayEl.classList.add("hidden");
    overlayEl.setAttribute("aria-hidden", "true");
  }

  window.StatsUI = {
    render,
    open,
    close
  };

})();