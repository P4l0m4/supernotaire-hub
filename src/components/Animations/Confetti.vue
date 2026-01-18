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

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
};

const props = defineProps({
  count: { type: Number, default: 120 },
  duration: { type: Number, default: 4500 },
  active: { type: Boolean, default: true },
  colors: {
    type: Array as PropType<string[]>,
    default: () => [
      "#3185ff",
      "#9035ff",
      "#ff91af",
      "#ffe492",
      "#48d664",
      "#00065c",
    ],
  },
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
const gravity = 320; // px/s²

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
  ctx.value?.scale(dpr, dpr);
};

const createParticle = (): Particle => {
  const baseSize = randomBetween(6, 14);
  const color = props.colors[Math.floor(Math.random() * props.colors.length)];
  const originX = size.value.width / 2;
  const originY = size.value.height / 2;
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(140, 280);
  return {
    x: originX,
    y: originY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed + 60,
    w: baseSize * randomBetween(0.8, 1.4),
    h: baseSize * randomBetween(1.2, 1.8),
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-3, 3),
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
  particles.value.forEach((p) => {
    ctx.value?.save();
    ctx.value?.translate(p.x, p.y);
    ctx.value?.rotate(p.rotation);
    if (ctx.value) ctx.value.fillStyle = p.color;
    const radius = Math.min(p.w, p.h) * 0.35;
    if (ctx.value?.roundRect) {
      ctx.value.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, radius);
      ctx.value.fill();
    } else {
      const r = radius;
      const x = -p.w / 2;
      const y = -p.h / 2;
      const w = p.w;
      const h = p.h;
      ctx.value?.beginPath();
      ctx.value?.moveTo(x + r, y);
      ctx.value?.lineTo(x + w - r, y);
      ctx.value?.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.value?.lineTo(x + w, y + h - r);
      ctx.value?.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.value?.lineTo(x + r, y + h);
      ctx.value?.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.value?.lineTo(x, y + r);
      ctx.value?.quadraticCurveTo(x, y, x + r, y);
      ctx.value?.closePath();
      ctx.value?.fill();
    }
    ctx.value?.restore();
  });
};

const updateParticles = (delta: number) => {
  particles.value = particles.value.map((p) => {
    p.vy += gravity * delta;
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.rotation += p.rotationSpeed * delta;
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
  { immediate: false }
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
    if (isActive) restart();
    else stop();
  }
);

onMounted(() => {
  mounted = true;
  setCanvasSize();
  if (props.active) restart();
});
onBeforeUnmount(stop);
</script>

<template>
  <div class="confetti-wrapper" ref="wrapperRef" aria-hidden="true">
    hello
    <canvas ref="canvasRef" class="confetti-canvas" />
  </div>
</template>

<style scoped lang="scss">
.confetti-wrapper {
  position: relative;
  width: 2rem;
  height: 2rem;
  pointer-events: none;
  // overflow: hidden;
}

.confetti-canvas {
  position: absolute;
  inset: 0;
  width: 2rem;
  height: 2rem;
  display: block;
}
</style>
