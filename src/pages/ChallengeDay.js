import { getTask, CHAIN, STUDENT } from "../data/mock-data.js";
import { renderChain } from "../components/StreakChain.js";

export function ChallengeDayPage({ id }) {
  const day = parseInt(id, 10) || 12;
  const task = getTask(day);

  if (!task) {
    return notFoundView(day);
  }

  const dayStatus = CHAIN.find((c) => c.day === day)?.status || "upcoming";
  const isMissedDay = dayStatus === "missed";

  return `
  <div class="app-shell is-page-day">
    <header class="topbar">
      <a href="#/dashboard" class="row gap-2" style="font-size:13px;color:var(--text-mid)">${iconBack()} Dashboard</a>
      <div class="pill pill-gold">Day ${day} / 60</div>
    </header>

    <main>
      <div class="px" style="padding-top:var(--sp-5)">

        <div class="card" style="padding:var(--sp-4)">
          <div class="row" style="justify-content:space-between;margin-bottom:var(--sp-3)">
            <span class="section-label" style="margin-bottom:0">Your chain</span>
            <span class="text-low" style="font-size:11px">${STUDENT.currentStreak}-day streak</span>
          </div>
          ${renderChain(CHAIN, { compact: true, activeDay: day })}
        </div>

        ${isMissedDay ? missedDayBanner(day) : ""}

        <section class="mt-4">
          <div class="section-label">Today's build</div>
          <h1 style="font-family:var(--font-mono);font-size:var(--text-xl);line-height:1.3;letter-spacing:-0.01em;margin:0 0 var(--sp-3)">${task.title}</h1>
          <p style="font-size:14px;line-height:1.6;color:var(--text-mid);margin:0 0 var(--sp-4)">${task.brief}</p>
          <div class="row gap-2" style="flex-wrap:wrap">
            ${task.estimatedTime ? `<span class="pill pill-neutral">⏱ ${task.estimatedTime}</span>` : ""}
            <span class="pill pill-neutral">${STUDENT.track}</span>
          </div>
        </section>

        ${task.requirements && task.requirements.length ? requirementsBlock(task.requirements) : ""}

        ${task.starterNotes ? `
        <section class="mt-4">
          <div class="card" style="background:var(--circuit-wash);border-color:var(--circuit-dim)">
            <div class="row gap-2" style="margin-bottom:6px">
              ${iconLightbulb()}
              <span style="font-weight:700;font-size:13px;color:var(--circuit)">Before you start</span>
            </div>
            <p style="font-size:13px;line-height:1.55;color:var(--text-hi);margin:0">${task.starterNotes}</p>
          </div>
        </section>` : ""}

        ${isMissedDay ? closedSubmissionBlock(day) : openSubmissionBlock(day)}

      </div>
    </main>
  </div>`;
}

function openSubmissionBlock(day) {
  return `
        <section class="mt-6" id="submit-section">
          <div class="section-label">Submit today's proof</div>
          <p class="text-low" style="font-size:12px;margin:-2px 0 var(--sp-4)">Both are required to keep your streak alive.</p>

          <form id="proof-form" novalidate>
            <div class="field" id="field-github">
              <label for="input-github">GitHub repo or commit URL</label>
              <input
                type="url"
                id="input-github"
                placeholder="https://github.com/yourname/abtalks-day${day}"
                autocomplete="off"
                inputmode="url"
              />
              <div class="field-hint">Paste the exact commit link, not just your profile.</div>
              <div class="field-error">That doesn't look like a GitHub URL — check the link.</div>
            </div>

            <div class="field" id="field-linkedin">
              <label for="input-linkedin">LinkedIn post URL</label>
              <input
                type="url"
                id="input-linkedin"
                placeholder="https://linkedin.com/posts/yourname_..."
                autocomplete="off"
                inputmode="url"
              />
              <div class="field-hint">Tag #ABTalks60 so recruiters can find your run.</div>
              <div class="field-error">That doesn't look like a LinkedIn URL — check the link.</div>
            </div>

            <div id="draft-preview" class="card" style="display:none;margin-top:var(--sp-2);margin-bottom:var(--sp-4);border-style:dashed;border-color:var(--border-soft)">
              <div class="section-label" style="margin-bottom:var(--sp-3)">Preview — this is what Day ${day} will look like</div>
              <div class="proof-row" id="preview-github" style="display:none">
                <div class="proof-icon" style="background:var(--circuit-wash)">${iconCommit()}</div>
                <div class="proof-meta">
                  <div class="proof-title">Code committed</div>
                  <div class="proof-sub" id="preview-github-url"></div>
                </div>
                ${iconCheck("var(--circuit)")}
              </div>
              <div class="proof-row" id="preview-linkedin" style="display:none">
                <div class="proof-icon" style="background:var(--ember-wash)">${iconLinkedIn()}</div>
                <div class="proof-meta">
                  <div class="proof-title">Post shared</div>
                  <div class="proof-sub" id="preview-linkedin-url"></div>
                </div>
                ${iconCheck("var(--ember)")}
              </div>
              <div class="row gap-2 mt-3" id="preview-chain-note" style="font-size:12px;color:var(--text-low)">
                ${iconInfo()} <span>Submitting completes this cell on your chain — streak becomes <strong id="preview-streak-number" style="color:var(--gold)">${STUDENT.currentStreak + 1}</strong>.</span>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" id="submit-btn" disabled>
              Add both links to submit
            </button>
          </form>

          <div id="success-state" style="display:none" class="card text-center" style="border-color:var(--circuit)">
            <div style="font-size:32px;margin-bottom:var(--sp-2)">${iconBigCheck()}</div>
            <div style="font-weight:700;font-size:var(--text-lg);margin-bottom:4px">Day ${day} locked in</div>
            <p class="text-low" style="font-size:13px;margin-bottom:var(--sp-5)">Your streak is now <strong style="color:var(--gold)">${STUDENT.currentStreak + 1} days</strong>. Day ${day + 1} unlocks at midnight IST.</p>
            <a href="#/dashboard" class="btn btn-secondary">Back to dashboard</a>
          </div>
        </section>`;
}

function closedSubmissionBlock(day) {
  return `
        <section class="mt-6">
          <div class="section-label">Submission window</div>
          <div class="card text-center" style="border-color:var(--border-soft)">
            <div style="font-size:24px;margin-bottom:var(--sp-2)">🔒</div>
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">This day is closed</div>
            <p class="text-low" style="font-size:13px;line-height:1.5;margin-bottom:var(--sp-5)">Day ${day} ended without proof, so it can't accept a submission now. Head to today's task to keep the rest of your chain intact.</p>
            <a href="#/day/12" class="btn btn-primary">Go to today's task</a>
          </div>
        </section>`;
}

function requirementsBlock(reqs) {
  return `
  <section class="mt-4">
    <div class="section-label">What "done" means today</div>
    <div class="card">
      ${reqs
        .map(
          (r, i) => `
        <div class="row gap-3" style="align-items:flex-start;${i > 0 ? "margin-top:12px;padding-top:12px;border-top:1px solid var(--border-hair)" : ""}">
          <div style="flex-shrink:0;margin-top:2px;color:var(--circuit)">${iconCheckSmall()}</div>
          <span style="font-size:13px;line-height:1.5;color:var(--text-hi)">${r}</span>
        </div>`
        )
        .join("")}
    </div>
  </section>`;
}

function missedDayBanner(day) {
  return `
  <div class="card mt-4" style="background:var(--danger-wash);border-color:var(--danger)">
    <div class="row gap-2" style="align-items:flex-start">
      <div style="flex-shrink:0;color:var(--danger)">${iconWarnBig()}</div>
      <div>
        <div style="font-weight:700;font-size:13px;color:var(--text-hi)">You're viewing a missed day</div>
        <div class="text-low" style="font-size:12px;margin-top:2px;line-height:1.5">Day ${day} closed without a submission. It stays marked as missed on your chain — you can't backfill it, but it doesn't block today's task.</div>
      </div>
    </div>
  </div>`;
}

function notFoundView(day) {
  return `
  <div class="app-shell is-page-day">
    <header class="topbar">
      <a href="#/dashboard" class="row gap-2" style="font-size:13px;color:var(--text-mid)">${iconBack()} Dashboard</a>
    </header>
    <main class="px text-center" style="padding-top:var(--sp-16)">
      <div style="font-family:var(--font-mono);font-size:var(--text-3xl);margin-bottom:var(--sp-3)">Day ${day}</div>
      <p class="text-low" style="font-size:14px;max-width:280px;margin:0 auto var(--sp-6)">This day hasn't unlocked yet, or it's outside your 60-day window.</p>
      <a href="#/dashboard" class="btn btn-primary" style="max-width:220px;margin:0 auto">Back to dashboard</a>
    </main>
  </div>`;
}

function iconBack() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>`; }
function iconCommit() { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--circuit)" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22.95" y2="12"/></svg>`; }
function iconLinkedIn() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ember)"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8.25h4v14.5h-4v-14.5zm7.5 0h3.84v1.98h.05c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.67 4.8 6.14v8.46h-4v-7.5c0-1.79-.03-4.09-2.5-4.09-2.5 0-2.88 1.95-2.88 3.96v7.63h-4v-14.5z"/></svg>`; }
function iconLightbulb() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--circuit)" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a6 6 0 00-4 10.5c.5.5.8 1 .9 1.5h6.2c.1-.5.4-1 .9-1.5A6 6 0 0012 2z"/></svg>`; }
function iconCheck(color) { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" style="flex-shrink:0"><path d="M4 12l6 6L20 6"/></svg>`; }
function iconCheckSmall() { return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l6 6L20 6"/></svg>`; }
function iconBigCheck() { return `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--circuit)" stroke-width="2.5" style="margin:0 auto"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>`; }
function iconInfo() { return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`; }
function iconWarnBig() { return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/></svg>`; }

export function initChallengeDayForm() {
  const form = document.getElementById("proof-form");
  if (!form) return;

  const ghInput = document.getElementById("input-github");
  const liInput = document.getElementById("input-linkedin");
  const ghField = document.getElementById("field-github");
  const liField = document.getElementById("field-linkedin");
  const submitBtn = document.getElementById("submit-btn");
  const preview = document.getElementById("draft-preview");
  const previewGh = document.getElementById("preview-github");
  const previewLi = document.getElementById("preview-linkedin");
  const previewGhUrl = document.getElementById("preview-github-url");
  const previewLiUrl = document.getElementById("preview-linkedin-url");

  const isValidGh = (v) => /^https?:\/\/(www\.)?github\.com\/.+/i.test(v.trim());
  const isValidLi = (v) => /^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(v.trim());

  function refresh() {
    const gh = ghInput.value.trim();
    const li = liInput.value.trim();
    const ghOk = gh.length > 0 && isValidGh(gh);
    const liOk = li.length > 0 && isValidLi(li);

    ghField.classList.toggle("has-error", gh.length > 6 && !ghOk);
    liField.classList.toggle("has-error", li.length > 6 && !liOk);

    const anyOk = ghOk || liOk;
    preview.style.display = anyOk ? "block" : "none";
    previewGh.style.display = ghOk ? "flex" : "none";
    previewLi.style.display = liOk ? "flex" : "none";
    if (ghOk) previewGhUrl.textContent = gh;
    if (liOk) previewLiUrl.textContent = li;

    if (ghOk && liOk) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Day 12";
    } else {
      submitBtn.disabled = true;
      submitBtn.textContent = anyOk ? "Add the other link to submit" : "Add both links to submit";
    }
  }

  ghInput.addEventListener("input", refresh);
  liInput.addEventListener("input", refresh);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (submitBtn.disabled) return;
    form.style.display = "none";
    document.getElementById("success-state").style.display = "block";
    document.getElementById("success-state").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}
