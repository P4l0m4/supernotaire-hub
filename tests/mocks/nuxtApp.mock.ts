export const useNuxtApp = () => ({
  $pdfMake: { createPdf: () => ({ download: () => undefined }) },
});

export const navigateTo = (_path: string) => {};
