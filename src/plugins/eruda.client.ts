export default defineNuxtPlugin(async () => {
  if (process.server) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("debug") !== "1") return;

  const eruda = await import("eruda");
  eruda.default.init();
});
