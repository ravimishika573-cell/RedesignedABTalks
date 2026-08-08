const routes = [];

export function route(pattern, render) {
  const paramNames = [];
  const regexStr = pattern
    .replace(/\/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return "/([^/]+)";
    })
    .replace(/\//g, "\\/");
  routes.push({ regex: new RegExp(`^${regexStr}$`), paramNames, render });
}

export function currentPath() {
  const hash = window.location.hash || "#/";
  const raw = hash.slice(1) || "/";
  const qIndex = raw.indexOf("?");
  return qIndex === -1 ? raw : raw.slice(0, qIndex);
}

export function navigate(path) {
  window.location.hash = path;
}

let afterRenderHook = () => {};
window.setAfterRenderHook = (fn) => (afterRenderHook = fn);

export function startRouter(mountEl) {
  function resolve() {
    const path = currentPath();
    for (const r of routes) {
      const match = path.match(r.regex);
      if (match) {
        const params = {};
        r.paramNames.forEach((name, i) => (params[name] = match[i + 1]));
        mountEl.innerHTML = r.render(params);
        window.scrollTo(0, 0);
        document.querySelectorAll("[data-nav]").forEach((el) => {
          el.classList.toggle("is-active", el.getAttribute("data-nav") === path);
        });
        afterRenderHook(path);
        return;
      }
    }
    mountEl.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-mid)">Page not found.</div>`;
  }

  window.addEventListener("hashchange", resolve);
  resolve();
}
