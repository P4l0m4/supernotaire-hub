<script setup lang="ts">
import { ref } from "vue";

const status = ref("not started");
const statusResponse = ref();
const taskId = ref("");
const results = ref();

const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:3000/api/documents/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  return result.taskId;
};

const checkStatus = async (taskId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/tasks/${taskId}/status`
    );

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Status response:", result);
    results.value = result;
    return result;
  } catch (error) {
    console.error("Status check error:", error);
    throw error;
  }
};

const getResults = async (taskId: string) => {
  const response = await fetch(
    `http://localhost:3000/api/tasks/${taskId}/result`
  );
  return await response.json();
};

const processDocument = async (file: File) => {
  try {
    taskId.value = await uploadDocument(file);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    status.value = "pending";
    let attempts = 0;
    const maxAttempts = 3;

    while (
      (status.value === "pending" || status.value === "processing") &&
      attempts < maxAttempts
    ) {
      statusResponse.value = await checkStatus(taskId.value);
      status.value = statusResponse.value.status;

      if (status.value === "failed") {
        console.error("Processing failed:", statusResponse.value);
        return;
      }

      if (status.value === "completed") {
        results.value = await getResults(taskId.value);
        return results.value;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    console.log("Processing timeout or unknown status");
  } catch (error) {
    console.error("Error:", error);
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
</script>
<template>
  <Container>
    <label
      for="images"
      ref="dropcontainerRef"
      class="drop-zone"
      @dragover.prevent
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="simulateClick"
    >
      <h1 class="drop-zone__title">Déposez un PV d'Assemblée Générale</h1>
      <span class="drop-zone__subtitle">Pour générer votre pré-état daté</span>
      <input
        type="file"
        ref="fileInputRef"
        class="drop-zone__input"
        accept=".pdf,.jpg,.jpeg,.png"
        @click="(e) => e.stopPropagation()"
        @change="(e) => processDocument((e.target as HTMLInputElement).files[0])"
      />
      <span class="drop-zone__formats">.pdf, .jpg, .jpeg, .png</span>
    </label>
    <span v-if="status === 'failed'" class="status">Statut: {{ status }}</span>

    <p v-if="results" class="results">Results: {{ results.result }}</p>
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
  border: 2px dashed $secondary-color;
  color: $text-color;
  border-radius: calc($radius / 2);
  cursor: pointer;
  transition: background 0.2s ease, border 0.2s ease;

  &:hover {
    background: rgba($secondary-color, 0.1);
    border-color: $secondary-color-faded;
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
</style>
