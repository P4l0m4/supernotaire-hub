<script setup lang="ts">
import { ref } from "vue";
import { copyToClipboard } from "@/utils/otherFunctions";

const status = ref("not started");
const statusResponse = ref();
const taskId = ref("");
const results = ref();
const isProcessing = ref(false);
const progress = ref(0);
const error = ref("");

const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://document-text-extractor-production.up.railway.app/api/documents/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  return result.taskId;
};

const checkStatus = async (taskId: string) => {
  try {
    const response = await fetch(
      `https://document-text-extractor-production.up.railway.app/api/tasks/${taskId}/status`
    );
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }
    const result = await response.json();
    progress.value = result.progress;
    console.log("Status response:", result);
    return result;
  } catch (error) {
    console.error("Status check error:", error);
    error.value = "Une erreur est survenue lors de la vérification du statut.";
    throw error;
  }
};

const getResults = async (taskId: string) => {
  try {
    const response = await fetch(
      `https://document-text-extractor-production.up.railway.app/api/tasks/${taskId}/result`
    );
    if (!response.ok) {
      throw new Error(`Result fetch failed: ${response.status}`);
    }
    const result = await response.json();
    console.log("Result response:", result);
    return result;
  } catch (err) {
    console.error("Result fetch error:", err);
    error.value =
      "Une erreur est survenue lors de la récupération des résultats.";
    throw error;
  }
};

const processDocument = async (file: File) => {
  try {
    isProcessing.value = true;
    error.value = "";
    results.value = null;

    console.log("Uploading document...");
    taskId.value = await uploadDocument(file);
    console.log("Task ID:", taskId.value);

    status.value = "processing";
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}`);

      statusResponse.value = await checkStatus(taskId.value);
      status.value = statusResponse.value.status;

      if (status.value === "completed") {
        console.log("Task completed! Getting results...");
        results.value = await getResults(taskId.value);
        console.log("Final results:", results.value);
        break;
      } else if (status.value === "failed") {
        error.value = statusResponse.value.error || "Processing failed";
        console.error("Processing failed:", statusResponse.value);
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    if (attempts >= maxAttempts && status.value !== "completed") {
      error.value = "Processing timeout - please try again";
      console.log("Processing timeout");
    }
  } catch (err) {
    error.value = "Une erreur est survenue lors du traitement.";
    console.error("Error:", err);
  } finally {
    isProcessing.value = false;
  }
};

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
  taskId.value = "";
  results.value = null;
  isProcessing.value = false;
  progress.value = 0;
  error.value = "";
}
</script>
<template>
  <Container>
    <label
      v-if="!progress && !isProcessing"
      for="images"
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
        @change="(e) => processDocument((e.target as HTMLInputElement).files[0])"
      />
      <span class="drop-zone__formats">.pdf, .jpg, .png</span>
    </label>
    <div class="wrapper">
      <StatusComponent v-if="status" :status />
      <PrimaryButton
        v-if="progress === 100 || error.length > 0"
        variant="accent-color"
        @click="reset"
      >
        Réessayer</PrimaryButton
      >
    </div>
    <div v-if="results?.result?.summary" class="summary">
      <div
        class="summary__page"
        v-for="page in results.result.summary"
        :key="page.number"
      >
        <span class="summary__page__number"
          >Page: {{ page.pageNumber }}
          <span class="summary__page__number__copy">
            <IconComponent
              icon="copy"
              size="1.5rem"
              @click="() => copyToClipboard(page.pageText)" /></span
        ></span>
        <p class="summary__page__text paragraphs">
          {{ page.pageText }}
        </p>
      </div>
    </div>
  </Container>
</template>
<style lang="scss" scoped>
.drop-zone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  height: fit-content;
  padding: 2rem 1rem;
  border: 1px dashed $secondary-color;
  color: $text-color;
  border-radius: calc($radius / 2);
  cursor: pointer;
  transition: background 0.2s ease, border 0.2s ease;

  &:hover {
    background: rgba($accent-color, 0.1);
    border: rgba($accent-color, 0.1) solid 2px;
  }

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
    margin-top: 4rem;
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
    color: $text-color-faded;
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
    margin-top: 4rem;
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

    &__number {
      font-weight: $semi-bold;
      font-size: 1.25rem;
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
