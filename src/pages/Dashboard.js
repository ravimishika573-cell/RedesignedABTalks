import { STUDENT, CHAIN, getTask, LEADERBOARD } from "../data/mock-data.js";
import { renderChain } from "../components/StreakChain.js";

function getStateFlag() {
  const hash = window.location.hash || "";
  const qIndex = hash.indexOf("?");
  if (qIndex === -1) return "normal";
  const params = new URLSearchParams(hash.slice(qIndex + 1));
  return params.get("state") || "normal";
}

export function DashboardPage() {
  const state = getStateFlag();
  if (state === "empty") return emptyProfileView();
  if (state === "day1") return day1View();
  return normalView();
}

function shellOpen() {
  return `
  <div class="app-shell is-page-dashboard">
    <header class="topbar">
      <div class="brand"><span class="brand-mark">AB</span> ABTalks</div>
      <a href="#/dashboard" class="topbar-avatar">${STUDENT.avatarInitials}</a>
    </header>`;
}

function shellClose() {
  return `${bottomNav("/dashboard")}</div>`;
}

function bottomNav(active) {
  const items = [
    { path: "/dashboard", label: "Home", icon: iconHome() },
    { path: "/day/12", label: "Today", icon: iconToday() },
    { path: "/dashboard?tab=leaderboard", label: "Ranks", icon: iconRank() },
    { path: "/dashboard?tab=profile", label: "Profile", icon: iconUser() },
  ];
  return `
  <nav class="bottom-nav">
    ${items
      .map(
        (i) => `<a href="#${i.path}" data-nav="${i.path}" class="${i.path === active ? "is-active" : ""}">${i.icon}<span>${i.label}</span></a>`
      )
      .join("")}
  </nav>`;
}

function normalView() {
  const pct = Math.round((STUDENT.daysCompleted / STUDENT.totalDays) * 100);
  const task = getTask(12);
  const badgesEarned = STUDENT.badges.filter((b) => b.earned).length;

  return `
  ${shellOpen()}
  <main>
    <div class="px" style="padding-top:var(--sp-5)">

      <section class="card" style="background:linear-gradient(145deg, var(--ink-800), var(--ink-700));border-color:var(--border-soft)">
        <div class="row" style="justify-content:space-between;align-items:flex-start">
          <div>
            <div class="section-label" style="margin-bottom:6px">Current streak</div>
            <div class="row gap-2" style="align-items:baseline">
              <span style="font-family:var(--font-mono);font-size:var(--text-4xl);font-weight:800;line-height:1">${STUDENT.currentStreak}</span>
              <span class="text-mid" style="font-size:var(--text-sm)">days</span>
              <span style="font-size:20px">🔥</span>
            </div>
            <div class="text-low mt-2" style="font-size:12px">Longest: ${STUDENT.longestStreak} days · missed 1 day (Day 7)</div>
          </div>
          <div class="pill pill-danger" style="flex-shrink:0">
            ${iconWarn()} 1 gap
          </div>
        </div>
        <div class="mt-4">${renderChain(CHAIN, { compact: true })}</div>
      </section>

      <section class="mt-4">
        <div class="row" style="justify-content:space-between;align-items:baseline;margin-bottom:var(--sp-2)">
          <div class="section-label" style="margin-bottom:0">Today · Day 12</div>
          <span class="pill pill-gold">Due in 6h 12m</span>
        </div>
        <a href="#/day/12" class="card" style="display:block;border-color:var(--gold);box-shadow:0 0 0 1px var(--gold), var(--shadow-card)">
          <div class="row gap-3" style="justify-content:space-between">
            <div style="min-width:0">
              <div style="font-weight:700;font-size:var(--text-base);margin-bottom:4px">${task.title}</div>
              <div class="text-low" style="font-size:13px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${task.brief}</div>
            </div>
            <div style="flex-shrink:0;color:var(--gold)">${iconArrow()}</div>
          </div>
          <div class="row gap-2 mt-3">
            <span class="pill pill-neutral">${task.estimatedTime}</span>
            <span class="pill pill-neutral">2 proofs needed</span>
          </div>
        </a>
      </section>

      <section class="mt-6">
        <div class="section-label">Challenge progress</div>
        <div class="card">
          <div class="row" style="justify-content:space-between;margin-bottom:var(--sp-2)">
            <span style="font-size:13px;font-weight:600">${STUDENT.daysCompleted} of ${STUDENT.totalDays} days</span>
            <span class="text-mono text-low" style="font-size:13px">${pct}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="row gap-4 mt-4">
            ${statBlock("Track", STUDENT.track.split(" ")[0])}
            ${statBlock("Days left", STUDENT.totalDays - STUDENT.daysCompleted - 1)}
            ${statBlock("Started", "Jun 29")}
          </div>
        </div>
      </section>

      <section class="mt-6">
        <div class="row" style="justify-content:space-between;align-items:baseline;margin-bottom:var(--sp-2)">
          <div class="section-label" style="margin-bottom:0">Your standing</div>
          <a href="#/dashboard?tab=leaderboard" class="text-low" style="font-size:12px">See full board →</a>
        </div>
        <div class="card">
          <div class="row gap-4">
            <div style="flex:1;text-align:center;padding:var(--sp-3) 0;border-right:1px solid var(--border-hair)">
              <div style="font-family:var(--font-mono);font-size:var(--text-2xl);font-weight:800">#${STUDENT.rank}</div>
              <div class="text-low" style="font-size:11px;margin-top:2px">of ${STUDENT.totalStudents.toLocaleString()}</div>
            </div>
            <div style="flex:1;text-align:center;padding:var(--sp-3) 0">
              <div style="font-family:var(--font-mono);font-size:var(--text-2xl);font-weight:800;color:var(--ember)">${badgesEarned}/${STUDENT.badges.length}</div>
              <div class="text-low" style="font-size:11px;margin-top:2px">badges earned</div>
            </div>
          </div>
          <div class="row gap-2 mt-4" style="flex-wrap:wrap">
            ${STUDENT.badges
              .map(
                (b) => `
              <div class="pill ${b.earned ? "pill-circuit" : "pill-neutral"}" style="${b.earned ? "" : "opacity:0.55"}">
                ${badgeIcon(b.icon)} ${b.label}
              </div>`
              )
              .join("")}
          </div>
        </div>
      </section>

    </div>
  </main>
  ${shellClose()}`;
}

function day1View() {
  return `
  ${shellOpen()}
  <main>
    <div class="px" style="padding-top:var(--sp-5)">

      <section class="card text-center" style="background:linear-gradient(145deg, var(--ink-800), var(--ink-700))">
        <div class="section-label">Current streak</div>
        <div style="font-family:var(--font-mono);font-size:var(--text-4xl);font-weight:800;margin:var(--sp-2) 0">0</div>
        <p class="text-mid" style="font-size:13px;max-width:280px;margin:0 auto">
          Everyone starts here. Submit Day 1 before midnight and this becomes a 1.
        </p>
      </section>

      <section class="mt-4">
        <div class="section-label">Today · Day 1</div>
        <a href="#/day/12" class="card" style="display:block;border-color:var(--gold);box-shadow:0 0 0 1px var(--gold), var(--shadow-card)">
          <div class="row gap-3" style="justify-content:space-between">
            <div>
              <div style="font-weight:700;margin-bottom:4px">Set up your dev environment</div>
              <div class="text-low" style="font-size:13px">Install Node, Git, and VS Code. Push your first repo.</div>
            </div>
            <div style="color:var(--gold)">${iconArrow()}</div>
          </div>
        </a>
      </section>

      <section class="mt-6 card text-center">
        <div style="font-size:28px;margin-bottom:var(--sp-2)">👀</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">No badges yet</div>
        <div class="text-low" style="font-size:13px">Finish today's task to unlock "Day One Wired."</div>
      </section>

    </div>
  </main>
  ${shellClose()}`;
}

function emptyProfileView() {
  return `
  ${shellOpen()}
  <main>
    <div class="px" style="padding-top:var(--sp-10);text-align:center">
      <div style="width:64px;height:64px;border-radius:18px;background:var(--ink-700);display:flex;align-items:center;justify-content:center;margin:0 auto var(--sp-5);border:1px dashed var(--border-soft)">
        ${iconUser()}
      </div>
      <h2 style="font-family:var(--font-mono);font-size:var(--text-lg);margin-bottom:var(--sp-2)">Pick a track to start your streak</h2>
      <p class="text-low" style="font-size:13px;max-width:280px;margin:0 auto var(--sp-6)">
        Your dashboard fills in the moment you choose one. Nothing to configure — just pick what you want to get good at.
      </p>
      <div class="stack gap-3">
        <a href="#/dashboard" class="btn btn-primary">Choose Full-Stack Web Dev</a>
        <a href="#/dashboard" class="btn btn-secondary">Browse all 6 tracks</a>
      </div>
    </div>
  </main>
  ${shellClose()}`;
}

function statBlock(label, value) {
  return `
  <div style="flex:1;text-align:center">
    <div style="font-weight:700;font-size:13px">${value}</div>
    <div class="text-low" style="font-size:10px;margin-top:2px;text-transform:uppercase;letter-spacing:0.04em">${label}</div>
  </div>`;
}

function badgeIcon(name) {
  const map = { flame: "🔥", bolt: "⚡", rocket: "🚀", flag: "🏁", trophy: "🏆" };
  return map[name] || "•";
}

function iconWarn() { return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/></svg>`; }
function iconArrow() { return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg>`; }
function iconHome() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>`; }
function iconToday() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>`; }
function iconRank() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8M12 17v4M7 4h10l-1 9a4 4 0 01-8 0L7 4z"/><path d="M5 4a2 2 0 002 4M19 4a2 2 0 01-2 4"/></svg>`; }
function iconUser() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>`; }

export { LEADERBOARD };
