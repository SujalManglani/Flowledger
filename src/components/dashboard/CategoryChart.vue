<script setup>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { computed } from "vue";

ChartJS.register(ArcElement, Tooltip);

const props = defineProps({ transactions: Array });

const chartData = computed(() => {
  const categories = {};
  props.transactions.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });

  return {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: ["#6366f1","#ec4899","#22c55e","#f59e0b"],
      hoverOffset: 30
    }]
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: true
};
</script>

<template>
<div class="pie-box">
  <Pie :data="chartData" :options="options" />
</div>
</template>

<style scoped>
.pie-box {
  width: 100%;
  max-width: 220px;
  aspect-ratio: 1/1;
  margin: auto;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>