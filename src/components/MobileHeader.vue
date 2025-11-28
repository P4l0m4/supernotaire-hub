<script setup lang="ts">
import { ref } from "vue";
import { colors } from "@/utils/colors";
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

const isMenuOpen = ref(false);

const target = useTemplateRef<HTMLElement>("target");
onClickOutside(target, () => (isMenuOpen.value = false));
</script>
<template>
  <header class="header" ref="target">
    <NuxtLink
      to="/"
      class="logo"
      @click="isMenuOpen = false"
      @keydown.enter="isMenuOpen = false"
      @keydown.space="isMenuOpen = false"
      tabindex="0"
      aria-label="accueil"
      ><img src="@/assets/images/logo-dark.svg" alt="logo supernotaire"
    /></NuxtLink>
    <button
      type="button"
      class="menu-button"
      @click="isMenuOpen = !isMenuOpen"
      @keydown.esc="isMenuOpen = false"
      tabindex="0"
      aria-label="menu"
    >
      <UIIconComponent
        :icon="isMenuOpen ? 'xx' : 'menu'"
        size="2rem"
        :color="colors['text-color']"
      />
    </button>
    <Transition>
      <nav class="header__nav" v-if="isMenuOpen">
        <ul class="header__nav__links">
          <li class="header__nav__links__link" style="margin-top: 2.5rem">
            <NuxtLink
              to="/inscription"
              class="nuxt-link"
              @keydown.esc="isMenuOpen = false"
              exact
              >Accès anticipé<span class="line"></span
            ></NuxtLink>
          </li>
          <li class="header__nav__links__link">
            <NuxtLink to="/beta" @keydown.esc="isMenuOpen = false" exact
              >Notaires</NuxtLink
            >
          </li>
          <li class="header__nav__links__link">
            <NuxtLink to="/vendeurs" @keydown.esc="isMenuOpen = false" exact
              >Vendeurs</NuxtLink
            >
          </li>
          <li class="header__nav__links__link">
            <NuxtLink to="/outils" @keydown.esc="isMenuOpen = false" exact
              >Boîte à outils</NuxtLink
            >
          </li>
          <li class="header__nav__links__link">
            <NuxtLink
              to="/tutoriels"
              class="nuxt-link"
              @keydown.esc="isMenuOpen = false"
              exact
              >Tutoriels<span class="line"></span
            ></NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>
<style lang="scss" scoped>
.header {
  display: flex;
  position: relative;
  padding: 1.5rem;
  background-color: $base-color;
  box-shadow: $shadow-black;
  z-index: 1;
  transform: translateY(0);
  transition: transform 1s cubic-bezier(0.47, 1.64, 0.41, 0.8);

  @starting-style {
    transform: translateY(-1rem);
  }

  @media (min-width: $laptop-screen) {
    display: none;
  }

  &__nav {
    position: fixed;
    top: 0.75rem;
    right: 1rem;
    z-index: 2;

    &__links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background-color: $primary-color;
      padding: 1rem;
      border-radius: calc($radius / 2);
    }
  }

  .menu-button {
    position: fixed;
    right: 1rem;
    top: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background-color: $primary-color;
    z-index: 3;
    border-radius: calc($radius / 2);
    box-shadow: $shadow-black;
  }
}

.nuxt-link {
  text-decoration: none;
  color: $text-color;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  gap: 2px;

  .line {
    width: 0px;
    height: 2px;
    background-color: transparent;
    transition: width 0.3s ease, background-color 0.3s ease;
  }
}

.router-link-exact-active {
  .line {
    width: 100%;
    background-color: $accent-color;
  }
}

.logo {
  img {
    width: 11.125rem;
    height: 1.56rem;
  }
}
</style>
