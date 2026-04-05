<script setup>
const props = defineProps({
  transactions: Array,
  role: String
});
</script><template>
<div>
  <div v-for="tx in transactions" :key="tx.id" class="tx"><div>
  <p>{{ tx.title }}</p>
  <span>{{ tx.category }}</span>

  <!-- ✅ DATE DISPLAY -->
  <p class="date">{{ tx.date }}</p>
</div>

<div>
  ₹{{ tx.amount }}

  <!-- ✅ ONLY ADMIN CAN DELETE -->
  <button v-if="role === 'admin'" @click="$emit('delete', tx.id)">
    ✕
  </button>
</div>

  </div>
</div>
</template><style scoped>
.tx {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.date {
  font-size: 12px;
  color: gray;
}
</style>