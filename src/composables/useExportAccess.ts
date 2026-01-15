import { computed } from "vue";

type AccessState = {
  access: boolean;
  checked: boolean;
  loading: boolean;
};

export const useExportAccess = () => {
  const state = useState<AccessState>("exportAccessState", () => ({
    access: false,
    checked: false,
    loading: false,
  }));

  const refresh = async (sessionId?: string) => {
    // Si déjà en cours et aucun sessionId fourni, on ne relance pas.
    if (state.value.loading && !sessionId) return state.value.access;
    state.value.loading = true;
    try {
      const params = sessionId ? { session_id: sessionId } : undefined;
      const result = await $fetch<{ access: boolean }>("/api/access/export", {
        method: "GET",
        params,
      });
      state.value.access = Boolean(result?.access);
      state.value.checked = true;
    } catch (error) {
      console.error("[useExportAccess] refresh failed", error);
    } finally {
      state.value.loading = false;
    }
    return state.value.access;
  };

  return {
    access: computed(() => state.value.access),
    checked: computed(() => state.value.checked),
    loading: computed(() => state.value.loading),
    refresh,
  };
};
