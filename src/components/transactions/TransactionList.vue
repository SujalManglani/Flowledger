<script setup>
const props = defineProps({
  transactions: Array,
  role: String
});
</script>

<template>
<div class="list">
  <div 
    v-for="tx in transactions" 
    :key="tx.id" 
    class="tx"
  >
    <!-- LEFT -->
    <div class="tx-info">
      <p class="title">{{ tx.title }}</p>
      <span class="category">{{ tx.category }}</span>
      <p class="date">{{ tx.date }}</p>
    </div>

    <!-- RIGHT -->
    <div class="tx-right">
      <p class="amount">₹{{ tx.amount }}</p>

      <button 
        v-if="role === 'admin'" 
        @click="$emit('delete', tx.id)"
        class="delete-btn"
      >
        ✕
      </button>
    </div>
  </div>

  <!-- EMPTY STATE -->
  <p v-if="transactions.length === 0" class="empty">
    No transactions found
  </p>
</div>
</template>

<style scoped>

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* TRANSACTION CARD */
.tx {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  transition: 0.2s;
}

.tx:hover {
  background: rgba(255,255,255,0.08);
}

/* LEFT SIDE */
.tx-info {
  display: flex;
  flex-direction: column;
}

.title {
  font-weight: 600;
}

.category {
  font-size: 12px;
  color: #94a3b8;
}

.date {
  font-size: 11px;
  color: #64748b;
}

/* RIGHT SIDE */
.tx-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.amount {
  font-weight: 600;
}

/* DELETE BUTTON */
.delete-btn {
  background: #ef4444;
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.delete-btn:hover {
  background: #dc2626;
}

/* EMPTY */
.empty {
  text-align: center;
  color: #64748b;
  padding: 10px;
}

</style>