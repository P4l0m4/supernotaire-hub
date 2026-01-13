<template>
  <aside class="export-menu">
    <div class="export-menu__block">
      <h3 class="export-menu__title">Téléchargez le récapitulatif</h3>
      <p class="export-menu__hint">
        Téléchargez le récapitulatif structuré des informations et documents à
        fournir à votre notaire pour la vente de votre bien immobilier.
      </p>
      <UISecondaryButton variant="accent-color" icon="download">
        Exporter le récapitulatif complet
      </UISecondaryButton>
    </div>
  </aside>
</template>
<style scoped lang="scss">
.export-menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding-top: 1.5rem;
  border-top: 1px solid color-mix(in srgb, $text-color 10%, transparent);

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
  }

  @media (min-width: $desktop-screen) {
    flex-direction: column;
    max-width: 22rem;
    padding-left: 1.5rem;
    border-left: 1px solid color-mix(in srgb, $text-color 10%, transparent);
    border-top: none;
    padding-top: 0;
  }

  &__block {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 0.5rem;
    padding: 1rem;
    height: 100%;
    width: 100%;
    min-height: 160px;
    border-radius: calc($radius / 2);
    border: 1px solid color-mix(in srgb, $text-color 8%, transparent);
  }

  &__title {
    font-size: 1.1rem;
    font-weight: $semi-bold;
    width: 100%;
  }

  &__hint {
    color: $text-color-faded;
    font-size: 0.95rem;
    width: 100%;
    margin-bottom: auto;
  }
}
</style>
