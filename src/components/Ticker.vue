<script setup>
defineProps({ transactions: Array });
</script>

<template>
<div class="ticker">
  <div class="track">
    <span v-for="t in transactions" :key="t.id">
      💸 {{ t.title }} ₹{{ t.amount }} •
    </span>
    <span v-for="t in transactions" :key="'dup'+t.id">
      💸 {{ t.title }} ₹{{ t.amount }} •
    </span>
  </div>
</div>
</template>

<style scoped>
.ticker {
  overflow: hidden;
  white-space: nowrap;
  padding: 6px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
}

.track {
  display: inline-block;
  animation: scroll 15s linear infinite;
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>