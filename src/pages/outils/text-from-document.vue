<script setup lang="ts">
import { ref } from "vue";
import { copyToClipboard } from "@/utils/otherFunctions";
import { processDocument } from "@/utils/textFromDocument";

const status = ref("not started");
const statusResponse = ref();
const results = ref();
const isProcessing = ref(false);
const progress = ref(0);
const error = ref("");

async function handleDocumentTextExtraction(file: File) {
  isProcessing.value = true;
  progress.value = 5;

  status.value = "processing";

  try {
    const resp = await processDocument(file);
    status.value = resp.status ?? "failed";
    progress.value = resp.progress;
    error.value = resp.error;
    results.value = resp.results;
  } finally {
    isProcessing.value = false;
  }
}

const dropContainerRef = ref<HTMLLabelElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const onDragEnter = () => dropContainerRef.value?.classList.add("drag-active");
const onDragLeave = () =>
  dropContainerRef.value?.classList.remove("drag-active");

const onDrop = (e: DragEvent) => {
  dropContainerRef.value?.classList.remove("drag-active");
  const files = e.dataTransfer?.files;
  if (files?.[0]) {
    // mirror the input change
    processDocument(files[0]);
  }
};

const simulateClick = () => {
  fileInputRef.value?.click();
};

dropContainerRef.value?.addEventListener("drop", (e) => {
  e.preventDefault();
  dropContainerRef.value?.classList.remove("drag-active");
  if (fileInputRef.value) {
    fileInputRef.value.files = e.dataTransfer.files;
  }
});

function reset() {
  status.value = "not started";
  statusResponse.value = null;
  results.value = null;
  isProcessing.value = false;
  progress.value = 0;
  error.value = "";
}

useHead({
  title: "Extraction de texte depuis un document",
  meta: [
    {
      name: "description",
      content:
        "Extraitre le texte d'un document PDF (scanné ou à base de texte) ou d'une image.",
    },
  ],
});
</script>
<template>
  <Container>
    <div class="text-extraction">
      <div class="text-extraction__headlines">
        <h1 class="text-extraction__headlines__title titles">
          Extraction de texte
        </h1>
        <h2 class="text-extraction__headlines__subtitle paragraphs">
          Extraitre le texte d'un document PDF (scanné ou à base de texte) ou
          d'une image.
        </h2>
      </div>
      <label
        v-if="!progress && !isProcessing"
        for="images"
        id="text-from-document"
        ref="dropcontainerRef"
        class="drop-zone"
        @dragover.prevent
        @dragenter.prevent="onDragEnter"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        @click="simulateClick"
      >
        <h1 class="drop-zone__title">Déposez un document</h1>
        <span class="drop-zone__subtitle"
          >Pour extraire le texte qu'il contient</span
        >
        <input
          type="file"
          ref="fileInputRef"
          class="drop-zone__input"
          accept=".pdf,.jpg,.jpeg,.png"
          @click="(e) => e.stopPropagation()"
          @change="
            (e) =>
              handleDocumentTextExtraction(
                (e.target as HTMLInputElement).files[0],
              )
          "
        />
        <span class="drop-zone__formats">.pdf, .jpg, .png</span>
      </label>
      <div class="wrapper">
        <StatusComponent v-if="status" :status />
        <UIPrimaryButton
          v-if="progress === 100 || error.length > 0"
          variant="accent-color"
          @click="reset"
        >
          Réessayer</UIPrimaryButton
        >
      </div>
      <div v-if="results?.result?.summary" class="summary">
        <div
          class="summary__page"
          v-for="page in results.result.summary"
          :key="page.number"
        >
          <div class="summary__page__header">
            <UITagComponent>Page {{ page.pageNumber }}</UITagComponent>
            <span class="summary__page__header__copy">
              <UIIconComponent
                icon="copy"
                size="1.5rem"
                @click="() => copyToClipboard(page.pageText)"
            /></span>
          </div>
          <p class="summary__page__text paragraphs">
            {{ page.pageText }}
          </p>
        </div>
      </div>
    </div>
  </Container>
  <HotjarTracking />
</template>
<style lang="scss" scoped>
.text-extraction {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    margin-top: 2rem;
    gap: 4rem;
    height: 100%;
    align-items: center;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__title {
      text-align: center;
      text-wrap: balance;
    }

    &__subtitle {
      text-align: center;
      text-wrap: balance;
    }
  }
}
.drop-zone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  height: fit-content;
  padding: 2rem 1rem;
  width: 100%;
  border: 1px dashed $secondary-color;
  color: $text-color;
  border-radius: calc($radius / 2);
  cursor: pointer;
  transition:
    background 0.2s ease,
    border 0.2s ease;

  &:hover {
    background: rgba($accent-color, 0.1);
    border: rgba($accent-color, 0.1) solid 2px;
  }

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
    margin-top: 2rem;
  }

  &__title {
    color: $text-color;
    font-size: 1.4rem;
    font-weight: $semi-bold;
    text-align: center;
    text-wrap: balance;
  }

  &__subtitle {
    text-align: center;
    text-wrap: balance;
    font-size: 1rem;
    font-weight: $regular;
    margin-top: -1rem;
  }

  &.drag-active {
    background: $primary-color;
  }

  &__formats {
    color: rgba($text-color, 0.7);
    font-size: $small-text;
    text-align: center;
    text-wrap: balance;
    margin-top: -1rem;
  }
}

input[type="file"] {
  width: 350px;
  max-width: 100%;
  color: $secondary-color;
  padding: 0.5rem;
  background-color: $primary-color;
  border: 1px solid $secondary-color;
  border-radius: calc($radius / 2);
  font-family: inherit;
}

input[type="file"]:focus {
  outline: 2px dashed $secondary-color;
  outline-offset: 2px;
}

input[type="file"]::file-selector-button {
  margin-right: 0.5rem;
  border: none;
  background: $secondary-color;
  padding: 1rem 1.75rem;
  color: $primary-color;
  cursor: pointer;
  font-family: inherit;
  border-radius: calc($radius / 2);
  transition: background-color 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
  background-color: darken($secondary-color, 3%);
}

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: fit-content;
  color: $text-color;

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
    padding: 4rem 2rem;
    margin-top: 2rem;
  }
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__page {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__copy {
        cursor: pointer;
        transition: transform 0.2s linear;

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>
