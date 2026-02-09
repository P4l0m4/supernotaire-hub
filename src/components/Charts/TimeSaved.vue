<script setup lang="ts">
import { computed } from "vue";
import SegmentProgressBar from "./SegmentProgressBar.vue";
import { colors } from "@/utils/colors";

type Item = {
  name: string;
  beforeHours: number;
  afterHours: number;
};

const props = defineProps<{
  items: Item[];
  title?: string;
}>();

const normalizedItems = computed(() =>
  props.items.map((item) => {
    const before = Math.max(item.beforeHours, 0);
    const after = Math.max(item.afterHours, 0);
    const gain = Math.max(before - after, 0);
    const total = before || 1;

    return {
      ...item,
      gain,
      total,
      segments: [
        {
          value: after,
          color: colors["accent-color"],
          label: "Temps passé",
          ariaLabel: `${item.name} temps après: ${after} heures`,
        },
        {
          value: gain,
          color: `${colors["success-color"]}70`,
          label: "Temps gagné",
          ariaLabel: `${item.name} temps gagné: ${gain} heures`,
        },
      ],
    };
  }),
);

const totals = computed(() => {
  const before = props.items.reduce(
    (sum, item) => sum + Math.max(item.beforeHours, 0),
    0,
  );
  const after = props.items.reduce(
    (sum, item) => sum + Math.max(item.afterHours, 0),
    0,
  );
  const gain = Math.max(before - after, 0);
  const pct = before > 0 ? Math.round((gain / before) * 100) : 0;
  return { before, after, gain, pct };
});
</script>

<template>
  <div class="time-saved">
    <div class="time-saved__legend">
      <div class="time-saved__legend__item">
        <span
          class="dot"
          :style="{ backgroundColor: colors['accent-color'] }"
        />
        <span>Temps passé</span>
      </div>
      <div class="time-saved__legend__item">
        <span
          class="dot"
          :style="{ backgroundColor: `${colors['success-color']}70` }"
        />
        <span>Temps gagné ({{ totals.pct }}%)</span>
      </div>
    </div>

    <div class="time-saved__list">
      <div
        v-for="item in normalizedItems"
        :key="item.name"
        class="time-saved__row"
      >
        <div class="time-saved__row__label">
          <span class="time-saved__row__label__title">{{ item.name }}</span>
          <span class="time-saved__row__label__value"
            >-{{ item.gain.toFixed(1) }} h</span
          >
        </div>
        <SegmentProgressBar
          class="time-saved__row__bar"
          :segments="item.segments"
          :total="item.total"
          :height="24"
          :radius="12"
          :track-color="`${colors['text-color']}10`"
          :aria-label="`Répartition du temps pour ${item.name}`"
        />
      </div>
    </div>
    <div class="time-saved__total">
      <span>Total :</span>
      {{ Math.round(totals.before) }} H → {{ Math.round(totals.after) }} H
      <span>(Gain : {{ totals.gain.toFixed(1) }} H)</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.time-saved {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  border-radius: calc($radius/2);
  background-color: $primary-color;
  box-shadow: $shadow-black;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
  }

  &__legend {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;

    &__item {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: $bold;
      font-size: 1rem;
      color: $text-color;
      text-transform: uppercase;
    }

    .dot {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      display: inline-block;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__row {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    &__label {
      display: flex;
      width: 100%;
      gap: 1rem;
      justify-content: space-between;
      font-weight: $semi-bold;
      color: $text-color;

      &__title {
        font-weight: $semi-bold;
        text-wrap: balance;
      }

      &__value {
        font-weight: $semi-bold;
        color: $success-color;
        text-align: right;
        white-space: nowrap;
      }
    }

    &__bar {
      width: 100%;
      grid-row: span 2;
    }
  }

  &__total {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 1.25rem;
    padding: 1.5rem 0 0 0;
    color: $accent-color;
    font-weight: $bold;
    justify-content: center;
    border-top: 1px solid rgba($text-color, 0.1);
  }
}
</style>
