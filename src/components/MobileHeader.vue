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
      ><img src="@/assets/images/logo-dark.svg" alt="logo EasyCase"
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
              to="/vente-documents-notaire"
              class="nuxt-link"
              @keydown.esc="isMenuOpen = false"
              exact
              :style="{ color: `${colors['accent-color']}` }"
              ><UIWrappedIcon
                icon="file_text_fill"
                :color="colors['accent-color']"
                size="small"
              />Préparer mon dossier</NuxtLink
            >
          </li>
          <li class="header__nav__links__link">
            <NuxtLink
              to="/outils"
              class="nuxt-link"
              @keydown.esc="isMenuOpen = false"
              exact
              :style="{ color: `${colors['purple-color']}` }"
              ><UIWrappedIcon
                icon="tree_structure_fill"
                :color="colors['purple-color']"
                size="small"
              />Boîte à outils</NuxtLink
            >
          </li>

          <li class="header__nav__links__link">
            <NuxtLink
              to="/vendeurs"
              class="nuxt-link"
              @keydown.esc="isMenuOpen = false"
              exact
              :style="{ color: `${colors['text-color']}` }"
              ><UIWrappedIcon
                icon="user_fill"
                :color="`${colors['text-color']}60`"
                size="small"
              />Vendeurs</NuxtLink
            >
          </li>
          <li class="header__nav__links__link">
            <NuxtLink
              to="/beta"
              class="nuxt-link"
              @keydown.esc="isMenuOpen = false"
              exact
              :style="{ color: `${colors['text-color']}` }"
              ><UIWrappedIcon
                icon="briefcase_fill"
                :color="`${colors['text-color']}60`"
                size="small"
              />Notaires</NuxtLink
            >
          </li>
          <li class="header__nav__links__link">
            <NuxtLink
              to="/tutoriels"
              class="nuxt-link"
              @keydown.esc="isMenuOpen = false"
              exact
              :style="{ color: `${colors['text-color']}` }"
              ><UIWrappedIcon
                icon="question_fill"
                :color="`${colors['text-color']}60`"
                size="small"
              />Tutoriels</NuxtLink
            >
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
  z-index: 2;
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
    top: 1.5rem;
    right: 1rem;
    z-index: 2;

    &__links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background-color: $primary-color;
      border: 1px solid rgba($text-color, 0.1);
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
    box-shadow: 0.25rem 0.25rem 0 rgba($secondary-color, 0.1);
  }
}

.nuxt-link {
  text-decoration: none;
  color: $text-color;
  white-space: nowrap;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  text-align: left;
  background-color: $base-color;
  padding: 0.25rem;
  padding-right: 0.75rem;
  border-radius: calc($radius/4);
  transform: translateY(0);
  transition:
    box-shadow 0.2s ease,
    transform 1s cubic-bezier(0.47, 1.64, 0.41, 0.8);

  @starting-style {
    transform: translateY(-1rem);
  }
}

.router-link-exact-active {
  box-shadow: 0.25rem 0.25rem 0
    color-mix(in srgb, currentColor 10%, transparent);
}

.logo {
  box-shadow: none;

  img {
    width: 6rem;
  }
}
</style>
