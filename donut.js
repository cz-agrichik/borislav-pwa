// donut.js
(function () {
  function polarToCartesian(cx, cy, r, angleDeg) {
    const a = ((angleDeg - 90) * Math.PI) / 180.0;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function describeArc(cx, cy, rOuter, rInner, startAngle, endAngle) {
    const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
    const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
    const startInner = polarToCartesian(cx, cy, rInner, startAngle);
    const endInner = polarToCartesian(cx, cy, rInner, endAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      startOuter.x,
      startOuter.y,
      "A",
      rOuter,
      rOuter,
      0,
      largeArcFlag,
      0,
      endOuter.x,
      endOuter.y,
      "L",
      startInner.x,
      startInner.y,
      "A",
      rInner,
      rInner,
      0,
      largeArcFlag,
      1,
      endInner.x,
      endInner.y,
      "Z",
    ].join(" ");
  }

  function renderDonut({ n, filledCount, donutWrap }) {
    donutWrap.innerHTML = "";

    const size = 190;
    const cx = size / 2;
    const cy = size / 2;
    const rOuter = 82;
    const rInner = 52;
    const gapDeg = 3;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.classList.add("donut-svg");

    const fillColor = "#facc15"; // жёлтый
    const baseColor = "#a16207"; // тёмный жёлтый для контура

    for (let i = 0; i < n; i++) {
      const segAngle = 360 / n;
      const start = i * segAngle + gapDeg / 2;
      const end = (i + 1) * segAngle - gapDeg / 2;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", describeArc(cx, cy, rOuter, rInner, start, end));
      path.setAttribute("stroke", baseColor);
      path.setAttribute("stroke-width", "1");
      path.setAttribute("fill", fillColor);

      const filled = i < filledCount;
      path.classList.add("donut-seg", filled ? "filled" : "empty");
      svg.appendChild(path);
    }

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", cx);
    text.setAttribute("y", cy + 6);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "22");
    text.setAttribute("font-weight", "800");
    text.setAttribute("fill", "#111827");
    text.textContent = `${filledCount}/${n}`;
    svg.appendChild(text);

    donutWrap.appendChild(svg);
  }

  function showSuccessOverlay({
    overlayEl,
    donutWrap,
    n,
    filledCount,
    duration = 650,
  }) {
    renderDonut({ n, filledCount, donutWrap });

    overlayEl.classList.remove("hidden");
    overlayEl.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      overlayEl.classList.add("hidden");
      overlayEl.setAttribute("aria-hidden", "true");
    }, duration);
  }

  // Экспорт в глобал (без модулей/сборки)
  window.DonutUI = {
    renderDonut,
    showSuccessOverlay,
  };
})();