<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  getNotariesByCommune,
  getNotariesByDepartement,
  getNotariesByPostalCode,
  type NotaryProfile,
} from "@/utils/notaries";

const query = ref("");
const pending = ref(false);
const errorMessage = ref<string | null>(null);
const notaries = ref<NotaryProfile[]>([]);

const { $supabase } = useNuxtApp();

const normalizedNumbers = computed(() => query.value.replace(/\D/g, ""));

const inferredMode = computed<"departement" | "postal" | "commune">(() => {
  if (/^\d{2}$/.test(normalizedNumbers.value)) return "departement";
  if (/^\d{5}$/.test(normalizedNumbers.value)) return "postal";
  return "commune";
});

const placeholder = computed(
  () => "2 chiffres (departement), 5 chiffres (code postal) ou nom de commune"
);

const minLength = computed(() => {
  if (inferredMode.value === "departement") return 2;
  if (inferredMode.value === "postal") return 5;
  return 3;
});

const showEmptyState = computed(
  () =>
    !pending.value &&
    !errorMessage.value &&
    query.value.trim().length >= minLength.value &&
    notaries.value.length === 0
);

watch(query, (value) => {
  if (!value.trim()) {
    notaries.value = [];
    errorMessage.value = null;
  }
});

async function fetchNotaries() {
  const value = query.value.trim();
  const numbersOnly = normalizedNumbers.value;

  const effectiveValue =
    inferredMode.value === "commune" ? value : numbersOnly;

  if (effectiveValue.length < minLength.value) {
    notaries.value = [];
    errorMessage.value = null;
    return;
  }

  if (!$supabase) {
    errorMessage.value = "Supabase n'est pas initialisé.";
    return;
  }

  pending.value = true;
  errorMessage.value = null;

  try {
    let data: NotaryProfile[] = [];
    if (inferredMode.value === "departement") {
      data = await getNotariesByDepartement($supabase, numbersOnly);
    } else if (inferredMode.value === "postal") {
      data = await getNotariesByPostalCode($supabase, numbersOnly);
    } else {
      data = await getNotariesByCommune($supabase, value);
    }

    notaries.value = data;
  } catch (err: any) {
    console.error(err);
    errorMessage.value =
      err?.message || "Impossible de récupérer les notaires pour cette zone.";
    notaries.value = [];
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <Container>
    <div class="annuaire">
      <div class="headlines">
        <h1 class="headlines__title">
          Trouvez les meilleurs notaires de votre région
        </h1>
        <h2 class="headlines__subtitle paragraphs">
          Utilisez notre annuaire pour voir le classement des meilleures études
          notariales près de chez vous.
        </h2>
      </div>
      <div class="annuaire__controls">
        <FormElementsSearchBar
          v-model="query"
          :placeholder="placeholder"
          :error="errorMessage || undefined"
          @search="fetchNotaries"
        />
        <p class="annuaire__hint">
          Tapez 2 chiffres pour un département, 5 chiffres pour un code postal, ou le nom
          d'une commune. La recherche s'adapte automatiquement.
        </p>
      </div>

      <div v-if="pending" class="annuaire__status">Recherche en cours...</div>
      <div
        v-else-if="errorMessage"
        class="annuaire__status annuaire__status--error"
      >
        {{ errorMessage }}
      </div>
      <div v-else-if="showEmptyState" class="annuaire__status">
        Aucun resultat pour "{{ query.trim() }}".
      </div>

      <ul v-else class="annuaire__list">
        <li v-for="n in notaries" :key="n.siret" class="annuaire__list__card">
          <div class="annuaire__list__card__header">
            <h3>{{ n.denomination }}</h3>
            <span
              v-if="n.rating !== null"
              class="annuaire__list__card__rating"
              aria-label="Note Google"
            >
              ★ {{ Number(n.rating).toFixed(1) }}
              <span v-if="n.userRatingsTotal"
                >({{ n.userRatingsTotal }} avis)</span
              >
            </span>
            <span
              v-else
              class="annuaire__list__card__rating annuaire__list__card__rating--muted"
            >
              Note indisponible
            </span>
          </div>

          <p class="annuaire__list__card__address">
            {{ n.adresse }}, {{ n.codePostal }} {{ n.commune }} — Departement
            {{ n.departement }}
          </p>
          <p class="annuaire__list__card__meta">SIRET {{ n.siret }}</p>

          <p v-if="n.matchedName" class="annuaire__list__card__match">
            Correspondance Google Maps: <strong>{{ n.matchedName }}</strong>
            <span v-if="n.matchedAddr"> • {{ n.matchedAddr }}</span>
            <span v-if="n.confidence !== null">
              • Confiance {{ n.confidence }}%</span
            >
          </p>
        </li>
      </ul>
    </div>
  </Container>
  <HotjarTracking />
</template>

<style scoped lang="scss">
.annuaire {
  display: flex;
  flex-direction: column;
  padding: 3rem 1rem;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 760px;
  }

  &__hint {
    color: $text-color-faded;
    font-size: $small-text;
  }

  &__status {
    padding: 1rem 1.25rem;
    border: 1px solid rgba($text-color, 0.1);
    border-radius: $radius;
    background-color: rgba($text-color, 0.04);
    color: $text-color;

    &--error {
      border-color: rgba($error-color, 0.3);
      background-color: rgba($error-color, 0.08);
      color: $error-color;
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;

    &__card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.25rem;
      background-color: $primary-color;
      border: 1px solid rgba($text-color, 0.08);
      border-radius: calc($radius / 1.2);
      box-shadow: $shadow-black;

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;

        h3 {
          font-size: 1.05rem;
          font-weight: $semi-bold;
        }
      }

      &__rating {
        font-size: $small-text;
        color: $accent-color;
        white-space: nowrap;

        &--muted {
          color: $text-color-faded;
        }
      }

      &__address {
        color: $text-color;
        line-height: 1.4;
      }

      &__meta {
        color: $text-color-faded;
        font-size: $small-text;
      }

      &__match {
        color: $text-color;
        font-size: $small-text;
        line-height: 1.4;

        strong {
          font-weight: $semi-bold;
        }
      }
    }
  }
}
</style>
