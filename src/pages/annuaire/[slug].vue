<script setup lang="ts">
const route = useRoute();
const notarySlug = route.params.slug;

//notary slug is an ID, so we need to fetch the notary data based on this ID
const {
  data: notary,
  pending,
  error,
} = await useAsyncData("notary", () =>
  $fetch(
    `https://supernotaire-kiro-production.up.railway.app/api/notaries/${notarySlug}`,
    {
      parseResponse: (resp: string) => JSON.parse(resp),
    }
  )
);
</script>
<template>
  <Container>
    <div v-if="pending">Chargement…</div>
    <div v-else-if="error">
      Notaire introuvable: {{ error.statusCode }} – {{ error.statusMessage }}
    </div>

    <div v-else-if="notary" class="notary-page">
      <h1 class="notary-page__title">Mᵉ {{ notary.name }}</h1>
      <div class="notary-page__office">
        <span>{{ notary.office.addressLine1 }}</span>
        <span>{{ notary.office.city }}</span>
        <span>{{ notary.office.postalCode }}, {{ notary.office.region }}</span>
      </div>

      <div class="notary-page__contact">
        <NuxtLink
          :to="`tel:${notary.contact.phone}`"
          class="notary-page__contact__phone"
          >{{ notary.contact.phone }}</NuxtLink
        >
        <NuxtLink :to="`mailto:${notary.contact.email}`">{{
          notary.contact.email
        }}</NuxtLink>
        <span v-if="notary.contact.website">{{ notary.contact.website }}</span>
      </div>
    </div>
  </Container>
</template>
<style scoped lang="scss">
.notary-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__office {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__phone {
      letter-spacing: 0.1rem;
    }
  }
}
</style>
