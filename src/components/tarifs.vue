<script setup lang="ts">
import { colors } from "@/utils/colors";
import question from "@/assets/images/question-100.svg";

const plans = ref([
  {
    name: "Essentiel",
    price: "0€",
    frequency: "/mois",

    features: [
      {
        included: true,
        text: "10 dossiers intelligents par mois",
      },
      {
        included: true,
        text: "Pré-rédaction de documents illimitée",
      },
      {
        included: true,
        text: "Visioconférences sécurisées illimitées",
      },
      {
        included: true,
        text: "Visibilité et demandes d’ouverture depuis l’annuaire",
      },
      {
        included: false,
        text: "Espaces collaborateurs supplémentaires (clercs, etc)",
      },
      {
        included: false,
        text: "Mise en avant dans l’annuaire",
      },
    ],
    link: "/inscription",
    buttonType: "secondary",
  },
  {
    name: "Premium",
    price: "200€",
    frequency: "/mois",
    features: [
      {
        included: true,
        text: "Tout ce qui est inclus dans le plan essentiel",
      },
      {
        included: true,
        text: "Dossiers intelligents illimités",
      },
      {
        included: true,
        text: "Mise en avant dans l’annuaire",
      },
      {
        included: true,
        text: "2 espaces collaborateur sécurisés",
      },
    ],
    link: "/inscription",
    buttonType: "primary",
  },
]);
</script>
<template>
  <div class="tarifs">
    <div class="tarifs__headlines">
      <h3 class="tarifs__headlines__title">Nos tarifs</h3>
      <p class="tarifs__headlines__subtitle">
        Commencez à gagner du temps facturable gratuitement ou décuplez votre
        impact grâce aux fonctionnalités premium.
      </p>
    </div>
    <div class="tarifs__plans">
      <div class="tarifs__plans__plan" v-for="plan in plans" :key="plan.name">
        <div class="tarifs__plans__plan__header">
          <h4 class="tarifs__plans__plan__header__name">{{ plan.name }}</h4>
          <div class="tarifs__plans__plan__header__price">
            <span class="tarifs__plans__plan__header__price__amount">{{
              plan.price
            }}</span
            ><span class="tarifs__plans__plan__header__price__frequency">{{
              plan.frequency
            }}</span>
          </div>

          <NuxtLink :to="plan.link" class="tarifs__plans__plan__link">
            <PrimaryButton
              v-if="plan.buttonType === 'primary'"
              variant="accent-color"
              >Commencer maintenant</PrimaryButton
            >
            <SecondaryButton
              v-if="plan.buttonType === 'secondary'"
              variant="accent-color"
              >Commencer maintenant</SecondaryButton
            >
          </NuxtLink>
        </div>
        <ul class="tarifs__plans__plan__features">
          <li
            v-for="feature in plan.features"
            :key="feature.text"
            class="tarifs__plans__plan__features__feature"
          >
            <IconComponent
              :icon="
                feature.included ? 'check_circle' : 'currency_circle_dollar'
              "
              :color="
                feature.included
                  ? colors['success-color']
                  : colors['purple-color']
              "
              size="1.21rem"
            />
            {{ feature.text }}
          </li>
        </ul>
      </div>
    </div>
    <div class="tarifs__questions">
      <img
        class="tarifs__questions__image"
        :src="question"
        alt="image question"
      />
      <div class="tarifs__questions__text">
        <span class="tarifs__questions__text__title">Une question ?</span>
        <span class="tarifs__questions__text__subtitle"
          >Parlez-nous, nous pouvons vous aider.</span
        >
      </div>

      <div class="tarifs__questions__buttons">
        <PrimaryButton variant="accent-color">Nous contacter</PrimaryButton>
        <TertiaryButton variant="text-color-faded"
          >Foire Aux Questions</TertiaryButton
        >
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tarifs {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  padding: 2rem 0;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 0;
    column-gap: 2rem;
    row-gap: 4rem;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto;
    justify-content: center;
    place-items: center;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2rem;
    width: 100%;
    max-width: 600px;

    @media (min-width: $big-tablet-screen) {
      gap: 4rem;
      grid-column: 1 / 4;
      grid-row: 1;
    }

    &__title {
      font-size: 1.85rem;
      font-weight: $bold;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 3rem;
      }
    }

    &__subtitle {
      font-size: 1rem;
      line-height: 1.35;
      font-weight: $regular;
      margin-top: -1rem;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
        margin-top: -3rem;
      }
    }
  }

  &__plans {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    @media (min-width: $big-tablet-screen) {
      //take all columns and span 2 rows
      grid-column: 1 / 3;
      grid-row: 2 / 3;
      height: 100%;
    }

    &__plan {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      gap: 2rem;
      background-color: $primary-color;
      border-radius: $radius;

      @media (min-width: $laptop-screen) {
        flex-direction: row;
        padding: 2rem;
        height: 100%;
        align-items: center;
      }

      &__header {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        &__name {
          font-size: 1rem;
          font-weight: $medium;
          color: $accent-color;
          text-transform: uppercase;

          @media (min-width: $big-tablet-screen) {
            font-size: 1.25rem;
          }
        }

        &__price {
          display: flex;
          gap: 0.5rem;
          align-items: center;

          &__amount {
            font-size: 3rem;
            font-weight: $bold;
          }

          &__frequency {
            font-size: 1rem;
            font-weight: $regular;
            color: $text-color-faded;
          }
        }
      }

      &__features {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        &__feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: $regular;
        }
      }
    }
  }

  &__questions {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border: 1px solid rgba($text-color, 0.1);
    border-radius: $radius;
    padding: 1rem;

    @media (min-width: $big-tablet-screen) {
      padding: 2rem;
      grid-column: 3;
      grid-row: 2 / 3;
    }

    &__text {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      &__title {
        font-size: 2.5rem;
        font-weight: $semi-bold;
      }

      &__subtitle {
        font-size: 1.25rem;
        font-weight: $regular;
      }
    }

    &__buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @media (min-width: $big-tablet-screen) {
        align-items: center;
      }
    }
  }
}
</style>
