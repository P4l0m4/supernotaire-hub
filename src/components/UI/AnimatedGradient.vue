<template>
  <div class="gradient-wrapper">
    <div class="circle circle_1"></div>
    <div class="circle circle_2"></div>
    <div class="circle circle_3"></div>
    <div class="circle circle_4"></div>
  </div>
</template>

<style scoped lang="scss">
.gradient-wrapper {
  position: absolute;
  inset: -12%; /* marge pour que le blur ne soit pas rogné */
  margin: auto;
  z-index: -1;
  pointer-events: none;
  filter: blur(120px) saturate(130%);
  overflow: hidden;
  background-color: $secondary-color;
  height: 100%;
  width: 100%;
}

.circle {
  position: absolute;
  width: 40vw;
  height: 40vw;
  border-radius: 50%;
  background: linear-gradient(
    270deg,
    $secondary-color,
    $purple-color,
    $accent-color,
    $secondary-color
  );
  background-size: 600% 600%;
  animation: move 5s ease-in-out infinite alternate,
    gradientShift 15s linear infinite;
  will-change: transform, background-position;
  mix-blend-mode: screen;

  /* bords diffus */
  -webkit-mask: radial-gradient(
    closest-side,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 42%,
    rgba(0, 0, 0, 0.5) 60%,
    rgba(0, 0, 0, 0) 78%
  );
  mask: radial-gradient(
    closest-side,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 42%,
    rgba(0, 0, 0, 0.5) 60%,
    rgba(0, 0, 0, 0) 78%
  );
}

.circle_1 {
  top: -10%;
  left: 20%;
  animation-delay: 0s, 0s;
}
.circle_2 {
  top: 30%;
  left: -20%;
  animation-delay: 3s, 5s;
}
.circle_3 {
  top: 50%;
  left: 40%;
  animation-delay: 6s, 10s;
}
.circle_4 {
  top: -20%;
  left: 60%;
  animation-delay: 9s, 15s;
}

@keyframes move {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  100% {
    transform: translate3d(30px, -30px, 0) scale(1.15);
  }
}
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
