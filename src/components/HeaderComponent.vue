<template>
  <header class="header">
    <nav class="header__nav">
      <ul class="header__nav__ul">
        <li class="header__nav__ul__li">
          <NuxtLink to="/" exact-active
            ><img
              class="logo"
              src="@/assets/images/logo-dark.svg"
              alt="logo supernotaire"
          /></NuxtLink>
        </li>
        <li class="header__nav__ul__li">
          <NuxtLink to="/comment-ca-marche" exact>Comment ça marche ?</NuxtLink>
        </li>
      </ul>
      <div class="header__nav__buttons">
        <NuxtLink to="/inscription">
          <SecondaryButton variant="accent-color">Connexion</SecondaryButton>
        </NuxtLink>
        <NuxtLink to="/inscription">
          <PrimaryButton variant="accent-color" icon="arrow_right">
            Inscription
          </PrimaryButton>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
<style lang="scss" scoped>
// .router-link-exact-active {
//   border-bottom: 2px solid $accent-color;
// }

.logo {
}

.header {
  display: none;
  padding: 1rem;
  box-shadow: $shadow-black;
  background-color: $base-color;
  height: 72px;
  z-index: 2;
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 2000px;
  left: 0;
  right: 0;
  margin: 0 auto;

  @media (min-width: $big-tablet-screen) {
    display: flex;
    padding: 1rem 4rem;
  }

  &__nav {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1.5rem;

    &__buttons {
      display: flex;
      gap: 1.5rem;
    }

    &__ul {
      list-style: none;
      display: flex;
      gap: 1rem;
      align-items: center;
      width: 100%;
      justify-content: space-between;

      &__li a {
        font-weight: $semi-bold;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        color: $text-color;
        font-size: 1rem;
      }

      &--dark {
        a {
          color: $base-color;
        }
      }
    }
  }
}
</style>
