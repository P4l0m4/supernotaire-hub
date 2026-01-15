<script setup lang="ts">
const steps = [
  {
    title: "Enquête utilisateurs",
    description:
      "Nous consultons de nombreux notaires, vendeurs, et acheteurs de biens immobiliers pour bien comprendre leurs besoins et attentes.",
  },
  {
    title: "Conception du produit",
    description:
      "Nous définissons les fonctionnalités clés, l'architecture globale, ainsi que l'apparence et le fonctionnement de la plateforme.",
  },
  {
    title: "Etude de faisabilité",
    description:
      "Une équipe d'experts analyse les aspects techniques et juridiques du projet pour assurer qu'il est réalisable et conforme aux réglementations propres aux outils destinés aux notaires.",
  },
  {
    title: "Développement MVP",
    description:
      "Nous développons une version minimale viable, en nous concentrant sur les fonctionnalités essentielles identifiées lors de la phase de conception.",
  },
  {
    title: "Bêta fermée",
    description:
      "Ouverture de la bêta fermée auprès d'un groupe restreint de notaires, de vendeurs, et d'acheteurs de biens immobiliers pour recueillir des retours d'expérience et identifier les améliorations à apporter.",
  },
  {
    title: "Développement V1",
    description:
      "Nous intégrons les retours de la bêta fermée, corrigeons les bugs, et ajoutons des fonctionnalités supplémentaires pour préparer la version publique.",
  },
  {
    title: "Lancement public",
    description:
      "Nous lançons la version publique de la plateforme, accompagnons les utilisateurs dans sa prise en main, et assurons un support réactif pour garantir une expérience optimale.",
  },
];
</script>
<template>
  <section id="roadmap" class="roadmap">
    <div class="roadmap__headlines">
      <h2 class="roadmap__headlines__title">Où en est EasyCase ?</h2>
      <div class="roadmap__headlines__subtitle">
        Suivez notre progression vers le lancement officiel 🚀
      </div>
    </div>
    <div class="roadmap__step" v-for="(step, i) in steps" :key="step.title">
      <span
        class="roadmap__step__number"
        :class="{ pulse: i + 1 === 4, empty: i + 1 > 4 }"
      >
        <template v-if="i + 1 < 4">
          <UIIconComponent icon="check_fat_fill" size="2rem" />
        </template>
        <template v-else-if="i + 1 >= 4">{{ i + 1 }}</template>
      </span>
      <h3 class="roadmap__step__title">{{ step.title }}</h3>
      <p class="roadmap__step__description">{{ step.description }}</p>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.roadmap {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 4rem 1rem;
  width: 100%;
  height: fit-content;
  position: relative;
  scroll-margin-top: 4rem;

  &::before {
    content: "";
    width: 2px;
    height: 100%;
    min-height: 500px;
    background-color: $accent-color;
    background: linear-gradient(
      to bottom,
      transparent,
      $accent-color,
      transparent
    );
    position: absolute;
    left: 3rem;
    top: 20rem;
  }

  @media (min-width: $laptop-screen) {
    padding: 4rem;
    align-items: center;

    &::before {
      inset: 25rem 0 0 0;
      margin: auto;
    }
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;

    &__title {
      text-align: center;
      font-size: 1.5rem;
      font-weight: $semi-bold;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 2.5rem;
      }
    }

    &__subtitle {
      text-align: center;
      font-size: 1rem;
      color: $text-color-faded;
      text-wrap: balance;
      line-height: 1.35;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
      }
    }
  }

  &__step {
    display: grid;
    grid-template-rows: 4rem auto;
    grid-template-columns: 4rem 1fr;
    column-gap: 1rem;
    row-gap: 0;
    width: 100%;
    height: fit-content;
    min-height: 8rem;
    padding: 1rem;
    border-radius: $radius;
    border: 1px solid transparent;
    transition: background-color 0.3s ease, border 0.3s ease,
      backdrop-filter 0.3s ease;

    @media (min-width: $laptop-screen) {
      width: fit-content;
      max-width: 35rem;
      transform: translateX(calc(50% - 2rem));
    }

    &:has(> .roadmap__step__number.pulse) {
      background-color: rgba($accent-color, 0.05);
      border: 1px solid rgba($accent-color, 0.2);
      backdrop-filter: blur(10px);

      .roadmap__step__number {
        &.pulse::before {
          animation: pulse 2s cubic-bezier(0.66, 0, 0, 1) infinite;
        }
      }

      .roadmap__step__title {
        color: $accent-color;
      }

      .roadmap__step__description {
        color: $secondary-color;
      }
    }

    &__number {
      display: flex;
      justify-content: center;
      align-items: center;
      width: clamp(4rem, 4rem, 4rem);
      height: clamp(4rem, 4rem, 4rem);
      background-color: $accent-color;
      font-size: 2rem;
      font-weight: $bold;
      color: $primary-color;
      border-radius: 50%;
      margin-top: -1rem;
      margin-left: -1rem;
      position: relative;

      &::before {
        content: "";
        width: clamp(5rem, 5rem, 5rem);
        height: clamp(5rem, 5rem, 5rem);
        position: absolute;
        margin: auto;
        background: radial-gradient(rgba($accent-color, 0.2));
        border-radius: 50%;
        z-index: -1;
        backdrop-filter: blur(10px);
      }

      &.empty {
        background-color: $base-color;
        color: $accent-color;
      }
    }

    &__title {
      grid-column: 2 / 3;
      font-size: 1.5rem;
      font-weight: $semi-bold;
      align-self: center;
      transition: color 0.3s ease;
    }

    &__description {
      grid-column: 2 / 3;
      font-size: 1rem;
      line-height: 1.3;
      transition: color 0.3s ease;

      @media (min-width: $laptop-screen) {
        margin-top: -0.5rem;
        font-size: 1.25rem;
      }
    }

    @media (min-width: $laptop-screen) {
      &:nth-of-type(even) {
        grid-template-columns: 1fr 4rem;
        transform: translateX(calc(-50% + 2rem));

        .roadmap__step__number {
          grid-column: 2;
          margin-top: -1rem;
          margin-left: 1rem;
        }

        .roadmap__step__title {
          grid-column: 1;
          grid-row: 1;
          text-align: right;
        }

        .roadmap__step__description {
          grid-column: 1;
          text-align: right;
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
    background: radial-gradient($accent-color, transparent 70%);
  }
  100% {
    transform: scale(1);
  }
}
</style>
