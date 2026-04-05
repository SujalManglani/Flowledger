<script setup>
import { onMounted, ref } from "vue";

const canvasRef = ref(null);

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  let width, height;
  let phase = 0;

  const resize = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  };

  resize();
  window.addEventListener("resize", resize);

  const drawWave = (amplitude, frequency, speed, color, offset) => {
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      const y =
        height / 2 +
        amplitude *
          Math.sin((x * frequency) + phase * speed + offset);

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    // 🔥 MULTIPLE FLOWING WAVES
    drawWave(20, 0.02, 1, "#6366f1", 0);       // main
    drawWave(15, 0.025, 1.5, "#22c55e", 2);    // green
    drawWave(10, 0.03, 2, "#ec4899", 4);       // pink

    phase += 0.05; // 👉 THIS MAKES IT FLOW HORIZONTALLY

    requestAnimationFrame(animate);
  };

  animate();
});
</script>

<template>
  <div class="wave-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.wave-container {
  width: 100%;
  height: 200px;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>