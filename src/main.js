import { route, startRouter } from "./router.js";
import { LandingPage, initHeroChain } from "./pages/Landing.js";
import { DashboardPage } from "./pages/Dashboard.js";
import { ChallengeDayPage, initChallengeDayForm } from "./pages/ChallengeDay.js";

route("/", LandingPage);
route("/dashboard", DashboardPage);
route("/day/:id", ChallengeDayPage);

const mount = document.getElementById("app");

window.setAfterRenderHook((path) => {
  if (path === "/") initHeroChain();
  if (path.startsWith("/day/")) initChallengeDayForm();
});

startRouter(mount);
