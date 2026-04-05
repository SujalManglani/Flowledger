import { ref } from "vue";

export function useTransactions() {
  const transactions = ref([]);

  const addTransaction = (tx) => {
    transactions.value.push(tx);
  };

 const deleteTransaction = (id) => {
  transactions.value = transactions.value.filter(
    (t) => t.id !== id
  );
};

  return {
    transactions,
    addTransaction,
    deleteTransaction,
  };
}