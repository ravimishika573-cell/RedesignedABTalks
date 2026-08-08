const STATUS_META = {
  done: { label: "Committed & posted" },
  partial: { label: "One proof submitted" },
  missed: { label: "Missed — no submission" },
  today: { label: "Today" },
  upcoming: { label: "Not started yet" },
};

export function renderChain(chain, { activeDay = null, compact = false } = {}) {
  const cellSize = compact ? 8 : 11;
  const gap = compact ? 3 : 4;

  const cells = chain
    .map((d) => {
      const isActive = activeDay === d.day;
      const cls = ["chain-cell", `chain-cell--${d.status}`, isActive ? "chain-cell--active" : ""]
        .filter(Boolean)
        .join(" ");
      const title = `Day ${d.day}: ${STATUS_META[d.status]?.label ?? d.status}`;
      return `<span class="${cls}" style="width:${cellSize}px;height:${cellSize}px" title="${title}" role="img" aria-label="${title}"></span>`;
    })
    .join("");

  return `<div class="chain-row" style="gap:${gap}px" role="img" aria-label="60-day streak chain">${cells}</div>`;
}
