<script setup lang="ts">
import { ref, watch } from "vue";

const API_BASE = "https://supernotaire-kiro-production.up.railway.app";
const query = ref("");
const notaries = ref();
const pending = ref(false);
const error = ref();

async function handleSearch() {
  const {
    data,
    pending: searchPending,
    error: searchError,
  } = await useAsyncData("notaries", () =>
    $fetch(`${API_BASE}/api/notaries`, {
      query: {
        query: query.value,
        page: 1,
        limit: 20,
        sortBy: "relevance",
        sortOrder: "desc",
      },
      parseResponse: (resp: string) => JSON.parse(resp),
    })
  );
  notaries.value = data.value;
  pending.value = searchPending.value;
  error.value = searchError.value;
  console.log("search results ➜", notaries.value.data);
}

watch(query, (newQuery) => {
  if (newQuery.length >= 3) {
    handleSearch();
  } else {
    notaries.value = [];
  }
});
</script>

<template>
  <Container>
    <div class="annuaire">
      <FormelementsSearchBar
        v-model="query"
        placeholder="Chercher par nom"
        @search="(q) => console.log('debounced query ➜', q)"
      />
      <p v-if="pending">Chargement…</p>

      <p v-else-if="error">
        Impossible de récupérer la liste : {{ error.statusCode }} – {{
          error.statusMessage
        }}
      </p>

      <ul v-else class="annuaire__list">
        <li
          v-for="n in notaries?.data ?? []"
          :key="n.id"
          class="annuaire__list__card"
        >
          <NuxtLink
            :to="`/annuaire/${n.id}`"
            class="annuaire__list__card__link-wrapper"
          >
            <span class="annuaire__list__card__link-wrapper__image"></span>
            <h3 class="annuaire__list__card__link-wrapper__name">
              Mᵉ {{ n.name }}
            </h3>

            <span class="annuaire__list__card__link-wrapper__city">{{
              n.office.city
            }}</span
            > </NuxtLink
          >
        </li>
      </ul>
    </div>
  </Container>
</template>
<style scoped lang="scss">
.annuaire {
  display: flex;
  flex-direction: column;
  padding: 4rem 1rem;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;

    &__card {
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @media (min-width: $big-tablet-screen) {
        max-width: 200px;
      }

      &__link-wrapper {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        &__image {
          width: 100%;
          height: 200px;
          background-color: rgb(170, 170, 170);
          border-radius: calc($radius/2);
        }

        &__name {
          font-size: 1rem;
          font-weight: $medium;
        }

        &__city {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: $text-color-faded;
          font-size: $small-text;
          margin-top: -0.5rem;
        }
      }
    }
  }
}
</style>
