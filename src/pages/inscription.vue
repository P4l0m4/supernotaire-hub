<template>
  <Container
    ><div class="inscription"><h1 class="titles">Créez votre compte</h1></div>

    <Inscription />
  </Container>
</template>
<style lang="scss" scoped>
.inscription {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 1rem;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    justify-content: center;
    align-items: center;
    gap: 4rem;
    min-height: initial;
  }

  @media (min-width: $laptop-screen) {
    gap: 8rem;
    padding: 4rem;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    text-align: center;

    .titles,
    .subtitles {
      color: $text-color;
    }
  }
}
</style>
