<script setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
} from "chart.js";
import { computed, onMounted, ref } from "vue";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
);

const props = defineProps({ transactions: Array });

/* ANIMATION STATE */
const animatedData = ref([]);

/* PREPARE DATA */
const baseData = computed(() => props.transactions.map(t => t.amount));

/* FLOWING EFFECT */
onMounted(() => {
  animatedData.value = [...baseData.value];

  setInterval(() => {
    if (baseData.value.length > 0) {
      const newData = [...animatedData.value];
      newData.push(baseData.value[Math.floor(Math.random() * baseData.value.length)]);
      newData.shift(); // remove first → creates flowing motion
      animatedData.value = newData;
    }
  }, 1200); // speed (lower = faster)
});

/* CHART DATA */
const chartData = computed(() => ({
  labels: animatedData.value.map((_, i) => i),
  datasets: [
    {
      data: animatedData.value,

      /* 🔥 PREMIUM COLOR */
      borderColor: "#8b5cf6", // purple-blue gradient vibe

      /* 🔥 SMOOTH CURVE */
      tension: 0.45,

      /* 🔥 CLEAN LOOK */
      fill: false,
      borderWidth: 3,
      pointRadius: 0,

      /* 🔥 GLOW EFFECT */
      segment: {
        borderColor: ctx => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 600, 0);
          gradient.addColorStop(0, "#6366f1");
          gradient.addColorStop(1, "#a78bfa");
          return gradient;
        }
      }
    }
  ]
}));

/* OPTIONS */
const options = {
  responsive: true,
  animation: {
    duration: 800,
    easing: "easeInOutQuad"
  },
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { display: false },
    y: { display: false }
  }
};
</script>

<template>
  <Line :data="chartData" :options="options" />
</template>