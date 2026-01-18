<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type PropType,
} from "vue";
import { useRafFn, useResizeObserver } from "@vueuse/core";
import { colors } from "@/utils/colors";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

const props = defineProps({
  count: { type: Number, default: 120 },
  duration: { type: Number, default: 2000 },
  active: { type: Boolean, default: true },
  colors: {
    type: Array as PropType<string[]>,
    default: () => [
      colors["accent-color"],
      colors["gold-color"],
      colors["primary-color"],
      colors["purple-color"],
      colors["success-color"],
      colors["warning-color"],
    ],
  },
  size: { type: [String, Number], default: "10rem" },
  delay: { type: Number, default: 0 },
});

const emit = defineEmits<{ (e: "complete"): void }>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const ctx = computed(() => canvasRef.value?.getContext("2d") ?? null);
const particles = ref<Particle[]>([]);
const running = ref(false);
const startTime = ref(0);
const lastFrame = ref(0);
const size = ref({ width: 0, height: 0 });
const downwardBase = 140;
const downwardGain = 180;
const velocityDecayRate = 1.5; // higher = faster slowdown when far
const wrapperSize = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size,
);

let delayTimer: number | null = null;

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const setCanvasSize = () => {
  const rect = wrapperRef.value?.getBoundingClientRect();
  if (!rect || !canvasRef.value) return;
  size.value = { width: rect.width, height: rect.height };
  const dpr = window.devicePixelRatio || 1;
  canvasRef.value.width = rect.width * dpr;
  canvasRef.value.height = rect.height * dpr;
  canvasRef.value.style.width = `${rect.width}px`;
  canvasRef.value.style.height = `${rect.height}px`;
  ctx.value?.setTransform(1, 0, 0, 1, 0, 0);
  ctx.value?.scale(dpr, dpr);
};

const createParticle = (): Particle => {
  const color = props.colors[Math.floor(Math.random() * props.colors.length)];
  const originX = size.value.width / 2;
  const originY = size.value.height / 2;
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(160, 300);
  return {
    x: originX,
    y: originY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: randomBetween(2, 4), // 4-8 px diameter
    color,
  };
};

const resetParticleIfOut = (particle: Particle) => {
  const outOfBounds =
    particle.y > size.value.height + 60 ||
    particle.x < -60 ||
    particle.x > size.value.width + 60;
  if (!outOfBounds) return particle;
  const replacement = createParticle();
  return replacement;
};

const drawParticles = () => {
  if (!ctx.value) return;
  ctx.value.clearRect(0, 0, size.value.width, size.value.height);
  const originX = size.value.width / 2;
  const originY = size.value.height / 2;
  const maxDist = Math.hypot(originX, originY) || 1;

  particles.value.forEach((p) => {
    const dist = Math.hypot(p.x - originX, p.y - originY);
    const fade = Math.max(0, 1 - dist / maxDist);
    if (ctx.value) ctx.value.globalAlpha = fade;
    ctx.value?.beginPath();
    ctx.value?.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    if (ctx.value) ctx.value.fillStyle = p.color;
    ctx.value?.fill();
    if (ctx.value) ctx.value.globalAlpha = 1;
  });
};

const updateParticles = (delta: number) => {
  const originX = size.value.width / 2;
  const originY = size.value.height / 2;
  const maxDist = Math.hypot(originX, originY) || 1;

  particles.value = particles.value.map((p) => {
    const dist = Math.hypot(p.x - originX, p.y - originY);
    const progress = Math.min(dist / maxDist, 1);
    const downward = downwardBase + downwardGain * progress;
    const decay = Math.max(0.7, 1 - velocityDecayRate * progress * delta);

    p.vy += downward * delta;
    p.vx *= decay;
    p.vy *= decay;
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    return resetParticleIfOut(p);
  });
};

const restart = () => {
  if (!size.value.width || !size.value.height) setCanvasSize();
  particles.value = Array.from({ length: props.count }, createParticle);
  startTime.value = 0;
  lastFrame.value = 0;
  running.value = true;
  raf.resume();
};

const stop = () => {
  running.value = false;
  raf.pause();
  ctx.value?.clearRect(0, 0, size.value.width, size.value.height);
};

const clearDelay = () => {
  if (delayTimer) {
    window.clearTimeout(delayTimer);
    delayTimer = null;
  }
};

const startWithDelay = () => {
  clearDelay();
  if (!props.delay) {
    restart();
    return;
  }
  delayTimer = window.setTimeout(() => {
    restart();
  }, props.delay);
};

const raf = useRafFn(
  ({ delta, timestamp }) => {
    if (!running.value) return;
    if (!startTime.value) {
      startTime.value = timestamp;
      lastFrame.value = timestamp;
    }

    const deltaSeconds = delta / 1000;
    lastFrame.value = timestamp;

    updateParticles(deltaSeconds);
    drawParticles();

    if (timestamp - startTime.value >= props.duration) {
      stop();
      emit("complete");
    }
  },
  { immediate: false },
);

useResizeObserver(wrapperRef, () => {
  setCanvasSize();
  if (running.value) {
    particles.value = particles.value.map((p) => resetParticleIfOut(p));
  }
});

let mounted = false;

watch(
  () => props.active,
  (isActive) => {
    if (!mounted) return;
    if (isActive) startWithDelay();
    else {
      clearDelay();
      stop();
    }
  },
);

onMounted(() => {
  mounted = true;
  setCanvasSize();
  if (props.active) startWithDelay();
});
onBeforeUnmount(() => {
  clearDelay();
  stop();
});
</script>

<template>
  <div
    class="confetti-wrapper"
    ref="wrapperRef"
    :style="{ width: wrapperSize, height: wrapperSize }"
    aria-hidden="true"
  >
    <div class="confetti-center" />
    <canvas ref="canvasRef" class="confetti-canvas" />
  </div>
</template>

<style scoped lang="scss">
.confetti-wrapper {
  position: relative;
  pointer-events: none;
}

.confetti-canvas {
  position: absolute;
  inset: 0;
  display: block;
}

.confetti-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}
</style>
