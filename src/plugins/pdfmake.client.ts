export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.server) return;
  const ready = useState<boolean>("pdfmake-ready", () => false);
  const load = (src: string) =>
    new Promise<void>((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => res();
      s.onerror = rej;
      document.head.appendChild(s);
    });
  try {
    await load(
      "https://cdn.jsdelivr.net/npm/pdfmake@0.2.8/build/pdfmake.min.js",
    );
    await load("https://cdn.jsdelivr.net/npm/pdfmake@0.2.8/build/vfs_fonts.js");
    const pm = (window as any).pdfMake;
    if (pm?.vfs && pm.createPdf) {
      nuxtApp.provide("pdfMake", pm);
      ready.value = true;
    } else {
      console.error("[pdfmake] instance missing vfs/createPdf");
    }
  } catch (e) {
    console.error("[pdfmake] failed to load", e);
  }
});
