import { LEADERBOARD } from "../data/mock-data.js";
import { renderChain } from "../components/StreakChain.js";

const DEMO_CHAIN = Array.from({ length: 60 }, (_, i) => {
  const day = i + 1;
  if (day === 23) return { day, status: "missed" };
  if (day <= 42) return { day, status: "done" };
  if (day === 43) return { day, status: "today" };
  return { day, status: "upcoming" };
});

export function LandingPage() {
  const leaderboardRows = LEADERBOARD.slice(0, 3)
    .map(
      (s) => `
    <div class="row gap-3" style="padding:10px 0;border-bottom:1px solid var(--border-hair)">
      <div style="width:24px;font-family:var(--font-mono);font-size:12px;color:var(--text-low)">#${s.rank}</div>
      <div style="width:30px;height:30px;border-radius:999px;background:var(--ink-700);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--text-mid)">${s.initials}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600">${s.name}</div>
        <div style="font-size:11px;color:var(--text-low)">${s.college}</div>
      </div>
      <div class="pill pill-gold">🔥 ${s.streak}</div>
    </div>`
    )
    .join("");

  return `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand"><span class="brand-mark">AB</span> ABTalks</div>
      <a href="#/dashboard" class="btn btn-ghost btn-sm">Log in</a>
    </header>

    <main class="px" style="padding-top:var(--sp-8)">
      <section class="text-center">
        <div class="pill pill-neutral" style="margin-bottom:var(--sp-5)">
          <span style="width:6px;height:6px;border-radius:999px;background:var(--circuit);display:inline-block"></span>
          1,842 students building right now
        </div>

        <div id="hero-chain" style="margin-bottom:var(--sp-6)"></div>

        <h1 style="font-family:var(--font-mono);font-size:var(--text-3xl);line-height:1.15;letter-spacing:-0.02em;margin:0 0 var(--sp-3)">
          That's 60 days of<br/>
          <span style="background:linear-gradient(90deg,var(--circuit),var(--ember));-webkit-background-clip:text;background-clip:text;color:transparent">proof, not promises.</span>
        </h1>
        <p class="text-mid" style="font-size:var(--text-base);line-height:1.55;max-width:360px;margin:0 auto">
          Build something every day. Push it to GitHub. Post it on LinkedIn.
          In 60 days, recruiters don't ask if you can code — they've already watched you do it.
        </p>

        <a href="#/dashboard" class="btn btn-primary mt-6" style="max-width:320px;margin:var(--sp-6) auto 0">
          Start Day 1 — it's free
        </a>
        <p class="text-low mt-3" style="font-size:12px">No credit card. Pick a track in under a minute.</p>
      </section>

      <section class="mt-8">
        <div class="section-label">Why a streak, not a course</div>
        <div class="card">
          <div class="row gap-3" style="align-items:flex-start">
            <div class="proof-icon" style="background:var(--circuit-wash)">${iconCommit()}</div>
            <div>
              <div class="proof-title">Real commits, not quizzes</div>
              <div class="proof-sub" style="white-space:normal">Every day ends with working code in a public repo — the same evidence a hiring manager looks for.</div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="row gap-3" style="align-items:flex-start">
            <div class="proof-icon" style="background:var(--ember-wash)">${iconLinkedIn()}</div>
            <div>
              <div class="proof-title">Visible while it's happening</div>
              <div class="proof-sub" style="white-space:normal">A daily LinkedIn post means recruiters see your growth in month one, not after graduation.</div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="row gap-3" style="align-items:flex-start">
            <div class="proof-icon" style="background:var(--gold-wash)">${iconFlame()}</div>
            <div>
              <div class="proof-title">The chain does the nagging</div>
              <div class="proof-sub" style="white-space:normal">One unbroken row of 60 days is harder to walk away from than a syllabus you can close the tab on.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-8">
        <div class="section-label">How it works</div>
        <div class="card stack gap-4">
          ${howStep("1", "Pick a track", "Full-Stack, DSA, Android, ML — pick what you're weakest at, not what's easiest.")}
          ${howStep("2", "Get a task at midnight IST", "One scoped build, sized for 1–3 hours after class. No ambiguity about what 'done' means.")}
          ${howStep("3", "Submit before the day resets", "Drop your commit link and LinkedIn post. Miss the window, the chain shows it — no hiding a skipped day.")}
        </div>
      </section>

      <section class="mt-8">
        <div class="row" style="justify-content:space-between;align-items:baseline">
          <div class="section-label" style="margin-bottom:0">This week's leaders</div>
          <span class="text-low" style="font-size:11px">1,842 total</span>
        </div>
        <div class="card">${leaderboardRows}</div>
      </section>

      <section class="mt-8 text-center" style="padding-bottom:var(--sp-10)">
        <h2 style="font-family:var(--font-mono);font-size:var(--text-xl);margin-bottom:var(--sp-2)">Day 1 takes six minutes.</h2>
        <p class="text-mid" style="font-size:var(--text-sm);margin-bottom:var(--sp-5)">Everyone on that leaderboard started at zero streak too.</p>
        <a href="#/dashboard" class="btn btn-primary">Start my streak</a>
      </section>
    </main>
  </div>`;
}

function howStep(num, title, body) {
  return `
  <div class="row gap-4" style="align-items:flex-start">
    <div style="font-family:var(--font-mono);font-weight:700;color:var(--text-low);font-size:var(--text-sm);width:20px;flex-shrink:0;padding-top:2px">${num}</div>
    <div>
      <div style="font-weight:600;font-size:var(--text-sm);margin-bottom:2px">${title}</div>
      <div class="text-low" style="font-size:13px;line-height:1.5">${body}</div>
    </div>
  </div>`;
}

function iconCommit() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--circuit)" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22.95" y2="12"/></svg>`;
}
function iconLinkedIn() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--ember)"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8.25h4v14.5h-4v-14.5zm7.5 0h3.84v1.98h.05c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.67 4.8 6.14v8.46h-4v-7.5c0-1.79-.03-4.09-2.5-4.09-2.5 0-2.88 1.95-2.88 3.96v7.63h-4v-14.5z"/></svg>`;
}
function iconFlame() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2c1 3-2 4-2 7a3 3 0 006 0c0-1-.5-2-1-2.5 2 1 3.5 3.5 3.5 6a6 6 0 11-12 0c0-4 2.5-6 3.5-8.5.5-1.2 1.4-1.8 2-2z"/></svg>`;
}

export function initHeroChain() {
  const el = document.getElementById("hero-chain");
  if (!el) return;
  el.innerHTML = renderChain(DEMO_CHAIN, { compact: true });
}
