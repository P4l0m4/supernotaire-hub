import { useMediaQuery } from "@vueuse/core";

export const useIsMobile = () =>
  import.meta.client ? useMediaQuery("(max-width: 1023px)") : ref(false);

export const useIsDesktop = () =>
  import.meta.client ? useMediaQuery("(min-width: 1024px)") : ref(false);

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

export async function loadLogo(): Promise<string> {
  const url = "/mini-logo.png";
  const blob = await fetch(url).then((r) => r.blob());
  return await new Promise<string>((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
}
