<template>
  <footer class="footer">
    <div class="footer__links-container">
      <div class="footer__links-container__special-box">
        <NuxtLink
          class="footer__links-container__special-box__title-section"
          to="/"
        >
          <img
            class="footer__links-container__special-box__title-section__logo"
            src="@/assets/images/logo-light.svg"
            alt="logo EasyCase"
          />
        </NuxtLink>
        <p class="paragraphs" style="text-wrap: balance">
          Accélérez la finalisation de vos ventes immobilières
        </p>
      </div>
      <ul class="footer__links-container__links">
        <li class="footer__links-container__links__title">
          Notaires<svg
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
            class="svg-underline"
          >
            <path
              d="
      M 0,5
      Q 50,3.5
        100,5
    "
            ></path>
          </svg>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/notaires">Notre offre</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/faq-notaires">F.A.Q.</NuxtLink>
        </li>
      </ul>
      <ul class="footer__links-container__links">
        <li class="footer__links-container__links__title">
          Vendeurs<svg
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
            class="svg-underline"
          >
            <path
              d="
      M 0,5
      Q 50,3.5
        100,5
    "
            ></path>
          </svg>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/vendeurs">Notre offre</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/tutoriels">Tutoriels</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/outils">Boîte à outils</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/faq-vendeurs">F.A.Q.</NuxtLink>
        </li>
      </ul>

      <ul class="footer__links-container__links">
        <li class="footer__links-container__links__title">
          Autres<svg
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
            class="svg-underline"
          >
            <path
              d="
      M 0,5
      Q 50,3.5
        100,5
    "
            ></path>
          </svg>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink :to="{ path: '/', hash: '#roadmap' }">Roadmap</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/annuaire">Annuaire</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/contact">Contact</NuxtLink>
        </li>
      </ul>
      <div class="footer__links-container__special-box">
        <div class="footer__links-container__special-box__title-section">
          <h4
            class="footer__links-container__special-box__title-section__title"
          >
            Gagnez du temps
          </h4>
        </div>
        <p class="paragraphs">
          Créez votre dossier de vente immobilière sans effort et confiez-le
          rapidement à un notaire.
        </p>
        <NuxtLink to="/beta"
          ><UIPrimaryButton variant="accent-color" icon="arrow_right"
            >Accès anticipé</UIPrimaryButton
          ></NuxtLink
        >
      </div>
    </div>

    <div class="footer__bottom-links">
      <NuxtLink
        to="https://docs.google.com/document/d/e/2PACX-1vQW80YJ6C8B_FY9LEPW6j4pEz3IfThZ-StWlcqUTakTnIUuAxn7CcheVopddu5dpgjlal_Amibhh2GF/pub"
        target="_blank"
        >CGV</NuxtLink
      ><NuxtLink
        to="https://docs.google.com/document/d/e/2PACX-1vTOGTdv866qLzIX4H8alMu0WlN-CeYjKNgtsEIJiimH1npT3ypGF3KCcu3eN0h9zmYpVWgK8wzcQqyi/pub"
        target="_blank"
        >CGU</NuxtLink
      ><NuxtLink
        to="https://docs.google.com/document/d/e/2PACX-1vRl0b5T5OmciZCyENe13NQgpoZH2g7YlzJUzgwiQwjbwLoOAvtbgrQDE-xVRqncwj8pHzeM8XxDEvMF/pub"
        target="_blank"
        >RGPD</NuxtLink
      >
      <NuxtLink to="https://tekilawebfactory.com" target="_blank"
        >Mentions légales</NuxtLink
      >
      <NuxtLink to="https://tekilawebfactory.com" target="_blank"
        >©EasyCase 2025</NuxtLink
      >
    </div>
  </footer>
</template>
<style lang="scss" scoped>
.svg-underline {
  display: block;
  position: absolute;
  left: 2px;
  bottom: -4px;
  height: 6px;
  width: calc(100% - 4px);
  fill: none;
  stroke: var(--underline-color, $accent-color);
  stroke-width: 3px;
  stroke-linecap: round;
  overflow: visible;
  stroke-dasharray: 120; // longueur
  stroke-dashoffset: 0;
}

.footer {
  background-color: $secondary-color;
  padding: 1rem;
  gap: 2rem;
  display: flex;
  flex-direction: column;
  border-top: 1px solid $accent-color-faded;
  max-width: 2000px;
  margin: 0 auto;

  @media (min-width: $big-tablet-screen) {
    padding: 2rem;
  }

  @media (min-width: $desktop-screen) {
    padding: 2rem 4rem;
  }

  &__links-container {
    display: flex;
    gap: 2rem;
    flex-direction: column;

    @media (min-width: $tablet-screen) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    &__special-box {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: $text-color-alt;

      @media (min-width: $tablet-screen) {
        max-width: 300px;
      }

      &__title-section {
        display: flex;
        gap: 0.5rem;
        height: fit-content;
        align-items: center;

        &__logo {
          width: 8rem;
          height: 2rem;
        }

        &__title {
          color: $text-color-alt;
          font-size: 1.625rem;
          font-weight: $medium;
        }
      }

      &__link {
        text-decoration: underline;
        color: $text-color-alt;
      }
    }

    &__links {
      display: flex;
      gap: 1rem;
      list-style: none;
      flex-direction: column;
      margin-top: 0.5rem;

      &__title {
        color: $text-color-alt;
        font-size: 1.35rem;
        font-weight: $medium;
        width: fit-content;
        position: relative;
      }

      &__li {
        color: $text-color-alt;

        a {
          color: $text-color-alt;
        }
      }
    }
  }

  &__bottom-links {
    display: flex;
    gap: 1rem;
    color: $accent-color;
    font-size: $small-text;
    width: 100%;
    flex-wrap: wrap;

    @media (min-width: $big-tablet-screen) {
      flex-direction: row;
      max-width: calc(100vw - 6rem);
      margin: 0 auto;
    }

    & a {
      color: $accent-color;
      white-space: nowrap;
    }
  }
}
</style>
