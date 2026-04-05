<script setup>
import { ref, onMounted } from "vue";

const points = ref([]);

onMounted(() => {
  setInterval(() => {
    const val = Math.random() * 100;
    points.value.push(val);

    if (points.value.length > 30) {
      points.value.shift();
    }
  }, 700);
});
</script>

<template>
  <svg viewBox="0 0 300 100" class="wave">
    <polyline
      :points="points.map((p,i)=>`${i*10},${100-p}`).join(' ')"
      fill="none"
      stroke="#6366f1"
      stroke-width="3"
    />
  </svg>
</template>

<style scoped>
.wave {
  width: 100%;
  height: 100%;
}
</style>