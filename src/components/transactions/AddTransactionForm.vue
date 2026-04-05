<script setup>
import { ref } from "vue";

const emit = defineEmits(["add"]);

const title = ref("");
const amount = ref("");
const category = ref("Food");
const date = ref("");

const handleSubmit = () => {
  if (!title.value || !amount.value || !date.value) return;

  emit("add", {
    id: Date.now(),
    title: title.value,
    amount: Number(amount.value),
    category: category.value,
    date: date.value
  });

  // reset
  title.value = "";
  amount.value = "";
  category.value = "Food";
  date.value = "";
};
</script><template>
<form @submit.prevent="handleSubmit" class="form">  <!-- TITLE -->  <div class="row">
    <input 
      v-model="title" 
      placeholder="Title" 
      class="input" 
    />
  </div>  <!-- AMOUNT + DATE -->  <div class="row">
    <input 
      v-model="amount" 
      type="number" 
      placeholder="Amount" 
      class="input" 
    /><input 
  v-model="date" 
  type="date" 
  class="input date" 
/>

  </div>  <!-- CATEGORY + BUTTON -->  <div class="row">
    <select v-model="category" class="input">
      <option>Food</option>
      <option>Travel</option>
      <option>Bills</option>
      <option>Shopping</option>
    </select><button type="submit" class="btn">
  Add
</button>

  </div></form>
</template><style scoped>

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* each line */
.row {
  display: flex;
  gap: 10px;
}

/* inputs */
.input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  outline: none;
}

/* fix date size */
.date {
  max-width: 150px;
}

/* button */
.btn {
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #6366f1;
  color: white;
}

</style>