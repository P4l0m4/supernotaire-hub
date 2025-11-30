<script setup lang="ts">
import { computed, ref } from "vue";
import { colors } from "@/utils/colors";
import { useIsDesktop } from "@/utils/otherFunctions";

type Step = {
  name: string;
  beforeHours: number; // sans Supernotaire
  afterHours: number; // avec Supernotaire
  description?: string;
};

const props = withDefaults(
  defineProps<{
    steps: Step[];
    title?: string;
    height?: string;
  }>(),
  { height: "27rem" }
);

const isDesktop = useIsDesktop(); // true = desktop, false = mobile
const isVertical = computed(() => !isDesktop.value); // vertical en mobile

const chartRef = ref();

const categoriesRich = computed(() =>
  props.steps.map((s) => `${s.name}\n${s.description ?? ""}`)
);

const categoriesCompact = computed(() => props.steps.map((s) => s.name));

const beforeData = computed(() => props.steps.map((s) => s.beforeHours));
const afterData = computed(() => props.steps.map((s) => s.afterHours));
const gainsData = computed(() =>
  props.steps.map((s) => s.beforeHours - s.afterHours)
);

const totalBefore = computed(() => beforeData.value.reduce((a, b) => a + b, 0));
const totalAfter = computed(() => afterData.value.reduce((a, b) => a + b, 0));
const totalGain = computed(() => totalBefore.value - totalAfter.value);
const pctGain = computed(() =>
  totalBefore.value > 0
    ? Math.round((totalGain.value / totalBefore.value) * 100)
    : 0
);

const option = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    valueFormatter: (v: number) => `${v} h`,
  },
  legend: {
    top: 0,
  },
  grid: isVertical.value
    ? { left: 8, right: 8, top: 64, bottom: 24, containLabel: true }
    : { left: 0, right: 0, top: 64, bottom: 0, containLabel: true },

  xAxis: isVertical.value
    ? {
        type: "category",
        data: categoriesCompact.value,
        axisLabel: {
          interval: 0,
          rotate: categoriesCompact.value.length > 4 ? 90 : 0,
        },
      }
    : {
        type: "value",
        name: "heures",
        axisLabel: { formatter: "{value} h" },
      },

  yAxis: isVertical.value
    ? {
        type: "value",
        name: "heures",
        axisLabel: { formatter: "{value} h" },
      }
    : {
        type: "category",
        data: categoriesRich.value,
        axisLabel: {
          formatter: (value: string) => {
            const [title, subtitle] = value.split("\n");
            return `{title|${title}}\n{subtitle|${subtitle || ""}}`;
          },
          rich: {
            title: {
              fontWeight: "600",
              fontSize: 18,
              lineHeight: 22,
              color: colors["text-color"],
            },
            subtitle: {
              fontWeight: "400",
              fontSize: 14,
              lineHeight: 18,
              color: colors["text-color-faded"],
            },
          },
        },
      },

  series: [
    {
      name: "Avec Supernotaire",
      type: "bar",
      stack: "temps",
      data: afterData.value,
      itemStyle: { color: colors["accent-color"] || "#3185FF" },
      label: {
        show: true,
        position: isVertical.value ? "insideTop" : "insideRight",
        formatter: ({ value }: any) => `${value} h`,
      },
      emphasis: { focus: "series" },
      barWidth: isVertical.value ? "60%" : undefined,
    },
    {
      name: `Temps gagné (${pctGain.value}%)`,
      type: "bar",
      stack: "temps",
      data: gainsData.value,
      itemStyle: {
        opacity: 0.4,
        color: colors["success-color"] || "#48D664",
      },
      label: {
        show: true,
        position: isVertical.value ? "top" : "right",
        formatter: ({ value }: any) => `-${value} h`,
      },
      barWidth: isVertical.value ? "60%" : undefined,
    },
  ],
}));
</script>

<template>
  <ClientOnly>
    <div class="comparative-time-chart">
      <VChart
        ref="chartRef"
        :option="option"
        :autoresize="true"
        :style="{ width: '100%', height: height }"
      />
      <div class="comparative-time-chart__header">
        <h3 v-if="title" class="comparative-time-chart__header__title">
          {{ title }}
        </h3>
        <!-- <div class="comparative-time-chart__header__summary">
          <strong>Total :</strong>
          <span
            >{{ Math.round(totalBefore) }} h →
            {{ Math.round(totalAfter) }} h</span
          >
          <span>Gain : {{ Math.round(totalGain) }} h (−{{ pctGain }}%)</span>
        </div> -->
      </div>
      <!-- Tableau texte accessibilité et SEO -->
      <div
        class="table-wrapper sr-only"
        aria-label="Tableau comparatif des étapes "
      >
        <table>
          <thead>
            <tr>
              <th>Étape</th>
              <th>Sans Supernotaire</th>
              <th>Avec Supernotaire</th>
              <th>Gain</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in steps" :key="s.name">
              <td>
                <div class="step-name">{{ s.name }}</div>
                <div v-if="s.description" class="step-desc">
                  {{ s.description }}
                </div>
              </td>
              <td>{{ s.beforeHours }} h</td>
              <td>{{ s.afterHours }} h</td>
              <td>{{ (s.beforeHours - s.afterHours).toFixed(1) }} h</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{{ totalBefore.toFixed(1) }} h</th>
              <th>{{ totalAfter.toFixed(1) }} h</th>
              <th>−{{ totalGain.toFixed(1) }} h (−{{ pctGain }}%)</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.comparative-time-chart {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__header {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.5rem;

    &__summary {
      display: flex;
      gap: 1rem;
      font-size: 1rem;
    }
  }
}

.table-wrapper {
  margin-top: 1rem;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 0.5rem 0.6rem;
  text-align: left;
}
.step-name {
  font-weight: 600;
}
.step-desc {
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>
