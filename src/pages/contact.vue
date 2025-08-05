<script setup lang="ts">
import { colors } from "@/utils/colors";
import { copyToClipboard } from "@/utils/otherFunctions";

const options = [
  {
    icon: "phone",
    text: "06 95 15 53 01",
  },
  {
    icon: "phone",
    text: "06 70 50 35 93",
  },
  {
    icon: "mail",
    text: "aurore.sajott@gmail.com",
  },
];
</script>
<template>
  <Container>
    <div class="contact">
      <div class="contact__headlines">
        <h1 class="titles">Nous contacter</h1>
        <p class="subtitles">
          Des questions sur la plateforme ? Envie de nous soutenir ou de
          participer à la bêta ?
        </p>
      </div>
      <div class="contact__options">
        <div
          class="contact__options__option"
          v-for="option in options"
          :key="option.text"
          @click="copyToClipboard(option.text)"
        >
          <span class="contact__options__option__icon"
            ><IconComponent
              :icon="option.icon"
              :color="colors['accent-color']"
              size="1.75rem"
          /></span>
          {{ option.text }}
          <IconComponent
            icon="copy"
            :color="colors['text-color-faded']"
            size="1rem"
            class="contact__options__option__copy-icon"
          />
        </div>
        <NuxtLink
          to="/inscription"
          aria-label="Tester l’outil en avant-première"
          style="width: 100%"
        >
          <PrimaryButton
            variant="accent-color"
            icon="lightning_fill"
            style="width: 100%; margin-left: auto"
          >
            Tester en avant-première
          </PrimaryButton>
        </NuxtLink>
      </div>
    </div>
  </Container>
</template>
<style lang="scss" scoped>
.contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100svh - 4rem);
  gap: 2rem;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    justify-content: center;
    align-items: center;
    gap: 4rem;
    padding: 4rem 0;
    min-height: initial;
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
      text-wrap: balance;
    }
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 600px;
    align-items: center;

    @media (min-width: $big-tablet-screen) {
      gap: 2rem;
    }

    &__option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.75rem 0.75rem 0.75rem;
      color: $text-color;
      font-size: 1rem;
      font-weight: $regular;
      width: 100%;
      height: 5.25rem;
      border-radius: calc($radius / 2);
      cursor: pointer;
      background-color: rgba($accent-color, 0.1);

      @media (min-width: $big-tablet-screen) {
        gap: 1rem;
      }

      &:hover .contact__options__option__copy-icon {
        color: $accent-color;
        transform: scale(1.2);
      }

      &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 3rem;
        min-height: 3rem;
        width: 3rem;
        height: 3rem;
        border-radius: calc($radius / 2);
        background-color: rgba($accent-color, 0.1);

        @media (min-width: $big-tablet-screen) {
          min-width: 4rem;
          min-height: 4rem;
          width: 4rem;
          height: 4rem;
        }
      }

      &__copy-icon {
        margin-left: auto;
        transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;
      }
    }
  }
}
</style>
