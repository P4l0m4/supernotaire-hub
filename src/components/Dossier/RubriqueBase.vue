<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { loadLogo } from "@/utils/otherFunctions";
import { useExportAccess } from "@/composables/useExportAccess";
import type { FormDefinition } from "@/types/forms";
import { useDriver } from "#imports";

const props = defineProps<{
  sectionId: string;
  title: string;
  storageKey: string;
  pdfPrefix: string;
  formDefinition: FormDefinition;
  docBuilder: (data: any, logo: string) => any;
  requireAccess?: boolean;
  sharedTypeStorageKey?: string;
  sharedAddressCompare?: {
    propertyStorageKey: string;
    propertyPath: string;
    currentStorageKey: string;
    currentPath: string;
    targetPath: string;
    occupantPath?: string;
    occupantValue?: string;
  };
  suggestions?: Array<{ key: string; value: unknown }>;
  prefillEntries?: Array<{ path: string; value: unknown }>;
}>();

const { $pdfMake } = useNuxtApp();
const formData = reactive<Record<string, any>>({});
const showLastAction = ref(false);
const lastValidSnapshot = ref<Record<string, any> | null>(null);
const isHydrated = ref(false);
const prefillHighlights = ref<string[]>([]);
const prefillTimers: Array<ReturnType<typeof setTimeout>> = [];
const PREFILL_DELAY = 700;
const HIGHLIGHT_DURATION = 1200;
const appliedPrefills = new Set<string>();
const {
  access: exportUnlocked,
  checked: accessChecked,
  refresh: refreshAccess,
} = useExportAccess();
const cloneData = (data: Record<string, any>) =>
  JSON.parse(JSON.stringify(data ?? {}));
const TOUR_FLAG = "checklist-tour";

const getByPath = (obj: any, path: string[]) =>
  path.reduce((acc, key) => (acc ? acc[key] : undefined), obj);

const setByPath = (obj: any, path: string[], val: any) => {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    cur = cur[path[i]] ??= {};
  }
  cur[path[path.length - 1]] = val;
};

const normalizeAddress = (value: unknown) => {
  if (!value) return "";
  const normalizeString = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .replace(/[.,;:]/g, "")
      .trim();

  if (typeof value === "string") return normalizeString(value);
  if (typeof value === "object") {
    const label =
      (value as any)?.properties?.label ||
      (value as any)?.label ||
      (value as any)?.properties?.name;
    if (label) return normalizeString(String(label));
    try {
      return normalizeString(JSON.stringify(value));
    } catch {
      return "";
    }
  }
  return "";
};

const schedulePrefill = (path: string, value: unknown) => {
  const timer = setTimeout(() => {
    setByPath(formData, path.split("."), value);
    persistSnapshot(formData);
    prefillHighlights.value = Array.from(
      new Set([...prefillHighlights.value, path]),
    );
    const clearTimer = setTimeout(() => {
      prefillHighlights.value = prefillHighlights.value.filter(
        (p) => p !== path,
      );
    }, HIGHLIGHT_DURATION);
    prefillTimers.push(clearTimer);
  }, PREFILL_DELAY);
  prefillTimers.push(timer);
};

const hydrateFromStorage = () => {
  if (!process.client) return;
  try {
    const raw = localStorage.getItem(props.storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(formData, parsed);
      lastValidSnapshot.value = cloneData(parsed);
      if (parsed?.__completed) {
        showLastAction.value = true;
      }
    }
    if (props.sharedTypeStorageKey) {
      const sharedType = localStorage.getItem(props.sharedTypeStorageKey);
      if (!formData.type_bien && sharedType) {
        schedulePrefill("type_bien", sharedType);
      }
    }
    if (props.sharedAddressCompare) {
      const cfg = props.sharedAddressCompare;
      const readAddress = (storageKey: string, path: string) => {
        try {
          const rawAddress = localStorage.getItem(storageKey);
          if (!rawAddress) return null;
          const parsedAddress = JSON.parse(rawAddress);
          return getByPath(parsedAddress, path.split("."));
        } catch {
          return null;
        }
      };
      const propertyAddress = readAddress(
        cfg.propertyStorageKey,
        cfg.propertyPath,
      );
      const currentAddress = readAddress(
        cfg.currentStorageKey,
        cfg.currentPath,
      );
      if (propertyAddress && currentAddress) {
        const propertyNorm = normalizeAddress(propertyAddress);
        const currentNorm = normalizeAddress(currentAddress);
        if (propertyNorm && currentNorm && propertyNorm === currentNorm) {
          const existing = getByPath(formData, cfg.targetPath.split("."));
          if (existing !== true) {
            schedulePrefill(cfg.targetPath, true);
          }
          if (cfg.occupantPath && cfg.occupantValue) {
            const currentOccupant = getByPath(
              formData,
              cfg.occupantPath.split("."),
            );
            if (!currentOccupant) {
              schedulePrefill(cfg.occupantPath, cfg.occupantValue);
            }
          }
        }
      }
    }
    isHydrated.value = true;
  } catch (e) {
    console.warn("[Rubrique] hydrate failed", props.storageKey, e);
  }
};

const persistSnapshot = (data: Record<string, any>) => {
  if (!process.client) return;
  try {
    localStorage.setItem(props.storageKey, JSON.stringify(data));
    if (props.sharedTypeStorageKey && data?.type_bien) {
      localStorage.setItem(props.sharedTypeStorageKey, data.type_bien);
    }
  } catch (e) {
    console.warn("[Rubrique] persist failed", props.storageKey, e);
  }
};

const tryApplyPrefillEntries = () => {
  if (!props.prefillEntries?.length) return;
  props.prefillEntries.forEach(({ path, value }) => {
    if (appliedPrefills.has(path)) return;
    const current = getByPath(formData, path.split("."));
    const isEmpty =
      current == null ||
      current === "" ||
      (typeof current === "object" && Object.keys(current).length === 0);
    if (!isEmpty) return;
    appliedPrefills.add(path);
    schedulePrefill(path, value);
  });
};

const runChecklistTour = () => {
  if (!process.client) return;
  if (props.sectionId !== "identite") return;
  const flag = localStorage.getItem(TOUR_FLAG);
  if (flag !== "identite") return;

  try {
    const tour = useDriver({
      overlayOpacity: 0.45,
      allowClose: true,
      showProgress: false,
      nextBtnText: "Suivant",
      prevBtnText: "Précédent",
      doneBtnText: "Terminer",
      steps: [
        {
          element: "#checklist-tour-form",
          popover: {
            title: "Complétez les champs de la rubrique",
            description:
              "Nous utilisons ces informations pour générer votre Pré-état daté. Nous les sauvegardons au fur et à mesure pour que vous puissiez reprendre plus tard si besoin.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "[data-tour='tooltip-icon']",
          popover: {
            title: "Besoin d'un coup de main ?",
            description:
              "Cette icône vous aidera à trouver l'information attendue, avec une explication courte ou un tutoriel simple.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "[data-tour='complete-button']",
          popover: {
            title: "Enregistrer la rubrique",
            description:
              "Une fois le formulaire complété, cliquez sur ce bouton pour sauvegarder vos réponses.",
            side: "bottom",
            align: "center",
          },
        },
      ],
    });
    tour.drive();
  } finally {
    localStorage.removeItem(TOUR_FLAG);
  }
};

onMounted(() => {
  hydrateFromStorage();
  tryApplyPrefillEntries();
  runChecklistTour();
});

watch(
  () => props.prefillEntries,
  () => {
    tryApplyPrefillEntries();
  },
  { deep: true },
);

const pdfFileName = (prefix: string) => {
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${date}.pdf`;
};

const onComplete = () => {
  formData.__completed = true;
  const snapshot = cloneData(formData);
  lastValidSnapshot.value = snapshot;
  persistSnapshot(snapshot);
  showLastAction.value = true;
  navigateTo(`/outils/checklist-dossier-vente-notaire`);
};

const onValidState = (payload: { isValid: boolean; model: any }) => {
  if (!isHydrated.value) return;
  if (!payload?.isValid) {
    formData.__completed = false;
    showLastAction.value = false;
    if (lastValidSnapshot.value) {
      persistSnapshot({ ...lastValidSnapshot.value, __completed: false });
    }
    return;
  }
  const snapshot = cloneData(payload.model || {});
  if (formData.__completed) snapshot.__completed = true;
  lastValidSnapshot.value = snapshot;
  persistSnapshot(snapshot);
};

const downloadPdf = async () => {
  // @ts-ignore
  if (!process.client || !$pdfMake?.createPdf) return;
  if (props.requireAccess && !exportUnlocked.value) {
    if (!accessChecked.value) {
      await refreshAccess();
    }
    if (!exportUnlocked.value) {
      console.warn("[RubriqueBase] export locked for premium rubrique");
      return;
    }
  }
  const logo = await loadLogo();
  const doc = props.docBuilder(formData, logo);
  if (!doc) return;
  // @ts-ignore
  $pdfMake.createPdf(doc).download(pdfFileName(props.pdfPrefix));
};

onBeforeUnmount(() => {
  prefillTimers.forEach((t) => clearTimeout(t));
});
</script>

<template>
  <div class="rubrique">
    <div class="rubrique__header">
      <h1 class="titles">{{ title }}</h1>
      <p class="subtitles">
        Remplissez les informations requises pour cette rubrique. Vos données
        sont conservées localement sur votre navigateur.
      </p>
    </div>

    <div class="rubrique__actions">
      <NuxtLink
        to="/outils/checklist-dossier-vente-notaire"
        aria-label="Retourner aux rubriques"
      >
        <UITertiaryButton icon="arrow_left" direction="row-reverse"
          >Retourner aux rubriques</UITertiaryButton
        ></NuxtLink
      >
      <UITertiaryButton
        v-if="showLastAction"
        variant="accent-color"
        icon="download"
        @click="downloadPdf"
      >
        Télécharger le récapitulatif
      </UITertiaryButton>
    </div>
    <div
      class="rubrique__form"
      :id="sectionId === 'identite' ? 'checklist-tour-form' : undefined"
    >
      <FormElementsDynamicForm
        :formDefinition="formDefinition"
        v-model="formData"
        :suggestions="suggestions || []"
        :prefillHighlights="prefillHighlights"
        @complete="onComplete"
        @valid-state="onValidState"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/rubriques.scss";
</style>
