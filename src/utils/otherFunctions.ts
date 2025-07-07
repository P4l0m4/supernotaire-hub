import { useMediaQuery } from "@vueuse/core";

export const isDesktop = () => useMediaQuery("(min-width: 1024px)");
export const isMobile = () => useMediaQuery("(max-width: 1023px)");

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}
