<script setup lang="ts">
useHead({
  script: [
    {
      key: "speculation-rules",
      type: "speculationrules",
      innerHTML: JSON.stringify({
        prefetch: [
          {
            where: { href_matches: "/(notaires|vendeurs|inscription)$" },
            eagerness: "moderate",
          },
        ],
        // prerender: [
        //   {
        //     where: { href_matches: "/inscription$" },
        //     eagerness: "eager",
        //   },
        // ],
      }),
    },
  ],
});
</script>

<template>
  <header class="header">
    <nav class="header__nav">
      <ul class="header__nav__ul">
        <li class="header__nav__ul__li">
          <NuxtLink to="/"
            ><img
              class="logo"
              src="@/assets/images/logo-dark.svg"
              alt="logo supernotaire"
          /></NuxtLink>
        </li>
        <li class="header__nav__ul__li" style="margin-left: auto">
          <NuxtLink to="/notaires" exact>Notaires</NuxtLink>
        </li>
        <li class="header__nav__ul__li">
          <NuxtLink to="/vendeurs" exact>Vendeurs de biens</NuxtLink>
        </li>
        <li class="header__nav__ul__li">
          <NuxtLink to="/outils" exact>Outils</NuxtLink>
        </li>
        <li class="header__nav__ul__li">
          <NuxtLink to="/comment-ca-marche" exact>Comment ça marche ?</NuxtLink>
        </li>
      </ul>
      <div class="header__nav__buttons">
        <!-- <NuxtLink to="/inscription">
          <UISecondaryButton variant="accent-color">Connexion</UISecondaryButton>
        </NuxtLink> -->
        <NuxtLink to="/inscription" exact-active-class="x">
          <UIPrimaryButton variant="accent-color" icon="arrow_right">
            Inscription
          </UIPrimaryButton>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
<style lang="scss" scoped>
.router-link-exact-active {
  border-bottom: 2px solid $accent-color;
}

.logo {
  width: 11.125rem;
  height: 1.56rem;
}

.header {
  display: none;
  padding: 1rem;
  box-shadow: $shadow-black;
  background-color: $base-color;
  height: fit-content;
  z-index: 2;
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 2000px;
  left: 0;
  right: 0;
  margin: 0 auto;
  transform: translateY(0);
  transition: transform 1s cubic-bezier(0.47, 1.64, 0.41, 0.8);

  @starting-style {
    transform: translateY(-1rem);
  }

  @media (min-width: $laptop-screen) {
    display: flex;
    padding: 0.5rem 4rem;
    height: fit-content;
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
      gap: 1.5rem;
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
