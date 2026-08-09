import { currentPath } from "./router.js";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("currentPath strips query string", () => {
  globalThis.location = { hash: "#/dashboard?state=day1" };
  assertEquals(currentPath(), "/dashboard");
});

Deno.test("currentPath defaults to / when hash is empty", () => {
  globalThis.location = { hash: "" };
  assertEquals(currentPath(), "/");
});
