<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";

const tpEl = ref<HTMLElement | null>(null);

function initTP() {
  const TP = (window as any).Trustpilot;
  if (TP && tpEl.value) TP.loadFromElement(tpEl.value, true);
}

onMounted(async () => {
  await nextTick();
  // charge une seule fois
  const existing = document.getElementById("tp-script");
  if (existing) return initTP();

  const s = document.createElement("script");
  s.id = "tp-script";
  s.src =
    "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
  s.async = true;
  s.onload = initTP;
  document.head.appendChild(s);
});
</script>

<template>
  <ClientOnly>
    <NuxtLink
      class="trustpilot"
      to="https://fr.trustpilot.com/review/supernotaire.fr"
      target="_blank"
      rel="noopener"
    >
      <span class="trustpilot__title">Vous aimez Supernotaire ?</span>
      <span class="trustpilot__subtitle"
        >Aidez des millions de français à nous découvrir</span
      >
      <div
        ref="tpEl"
        class="trustpilot-widget"
        data-locale="fr-FR"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id="68acaae4f868ed4fa17d96bd"
        data-style-height="52px"
        data-style-width="100%"
        data-token="26ac862f-06f7-4963-aec9-56b86964b144"
      >
        <a
          href="https://fr.trustpilot.com/review/supernotaire.fr"
          target="_blank"
          rel="noopener"
          >Trustpilot</a
        >
      </div>
    </NuxtLink>
  </ClientOnly>
</template>
<style lang="scss" scoped>
.trustpilot {
  background-color: rgba(#00b67a, 0.1);
  border-radius: calc($radius * 0.5);
  padding: 1.5rem 1rem 1rem 1rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  &__title {
    font-size: 1.25rem;
    font-weight: $regular;
    text-wrap: balance;
  }

  &__subtitle {
    font-size: 1rem;
    text-wrap: balance;
    text-align: center;
    margin-bottom: 1rem;
  }
}
</style>
