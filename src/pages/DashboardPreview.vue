<script setup>
import { ref, computed, onMounted, watch } from "vue";

import CategoryChart from "../components/dashboard/CategoryChart.vue";
import WaveChart from "../components/dashboard/WaveChart.vue";
import AddTransactionForm from "../components/transactions/AddTransactionForm.vue";
import TransactionList from "../components/transactions/TransactionList.vue";
import Ticker from "../components/Ticker.vue";
import logo from "../assets/logo.png";

/* LOCAL STORAGE */
const saved = localStorage.getItem("transactions");

const transactions = ref(
  saved
    ? JSON.parse(saved)
    : [
        { id: 1, title: "Groceries", amount: 500, category: "Food", date: "2026-04-05" },
        { id: 2, title: "Taxi", amount: 200, category: "Travel", date: "2026-04-04" }
      ]
);

watch(transactions, (val) => {
  localStorage.setItem("transactions", JSON.stringify(val));
}, { deep: true });

const addTransaction = (tx) => transactions.value.push(tx);
const deleteTransaction = (id) => {
  transactions.value = transactions.value.filter(t => t.id !== id);
};

const total = computed(() =>
  transactions.value.reduce((s, t) => s + t.amount, 0)
);

/* ROLE */
const role = ref("admin");

/* FILTERS */
const selectedCategory = ref("All");
const searchQuery = ref("");
const sortOption = ref("latest");
const fromDate = ref("");
const toDate = ref("");

const filteredTransactions = computed(() => {
  let data = [...transactions.value];

  if (selectedCategory.value !== "All") {
    data = data.filter(t => t.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    data = data.filter(t =>
      t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (fromDate.value) {
    data = data.filter(t => new Date(t.date) >= new Date(fromDate.value));
  }

  if (toDate.value) {
    data = data.filter(t => new Date(t.date) <= new Date(toDate.value));
  }

  if (sortOption.value === "amount") {
    data.sort((a, b) => b.amount - a.amount);
  } else {
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return data;
});

const categories = computed(() => [
  "All",
  ...new Set(transactions.value.map(t => t.category))
]);

const topCategory = computed(() => {
  const map = {};
  transactions.value.forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.keys(map).reduce((a, b) => (map[a] > map[b] ? a : b), "None");
});

/* COUNTER */
const animatedTotal = ref(0);

onMounted(() => {
  let start = 0;
  const end = total.value;

  const interval = setInterval(() => {
    start += Math.ceil(end / 40);
    if (start >= end) {
      animatedTotal.value = end;
      clearInterval(interval);
    } else {
      animatedTotal.value = start;
    }
  }, 25);

  /* CURSOR GLOW */
  window.addEventListener("mousemove", (e) => {
    const glow = document.querySelector(".cursor-glow");
    if (glow) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }
  });
});
</script>

<template>
<div class="app">

  <div class="cursor-glow"></div>

  <!-- SIDEBAR -->
  <div class="sidebar glass">
    <div class="logo">F</div>

    <select v-model="role" class="role-select">
      <option value="admin">Admin</option>
      <option value="viewer">Viewer</option>
    </select>
  </div>

  <div class="dashboard">

    <!-- BACKGROUND -->
    <div class="parallax-bg"></div>

    <!-- HEADER -->
    <div class="header glass fade-in">
      <div class="title">
        <img :src="logo" class="logo-img" />
        <h1>Flowledger</h1>
      </div>

      <div class="nav-buttons">
        <button>Home</button>
        <button>Reports</button>
        <button>Settings</button>
      </div>
    </div>

    <div class="ticker fade-in">
      <Ticker :transactions="transactions" />
    </div>

    <div class="topbar fade-in">
      <div class="stat glass">₹{{ animatedTotal }}<p>Total</p></div>
      <div class="stat glass">{{ transactions.length }}<p>Transactions</p></div>
      <div class="stat glass">Active<p>Status</p></div>
    </div>

    <!-- FILTER -->
    <div class="card glass filter-bar fade-in">
      <input v-model="searchQuery" placeholder="Search..." />
      <select v-model="selectedCategory">
        <option v-for="cat in categories" :key="cat">{{ cat }}</option>
      </select>
      <select v-model="sortOption">
        <option value="latest">Latest</option>
        <option value="amount">Highest Amount</option>
      </select>
      <input type="date" v-model="fromDate" />
      <input type="date" v-model="toDate" />
    </div>

    <div class="content">

      <div class="left">
        <div class="card glass fade-in">
          <h3>📊 Insights</h3>
          <p>Top Category: {{ topCategory }}</p>
          <p>Total Spent: ₹{{ total }}</p>
        </div>
      </div>

      <div class="center">
        <div class="card glass fade-in">
          <WaveChart :transactions="transactions" />
        </div>

        <div class="card glass fade-in">
          <TransactionList
            :transactions="filteredTransactions"
            :role="role"
            @delete="deleteTransaction"
          />
        </div>
      </div>

      <div class="right">
        <div class="card glass fade-in">
          <CategoryChart :transactions="transactions" />
        </div>

        <div class="card glass fade-in" v-show="role === 'admin'">
          <AddTransactionForm @add="addTransaction" />
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  background: #020617;
  color: #e5e7eb;
}

/* LAYOUT */
.app {
  display: flex;
  height: 100vh;
}

/* SIDEBAR */
.sidebar {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

/* GLASS */
.glass {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
}

/* DASHBOARD */
.dashboard {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

/* BACKGROUND */
.parallax-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 20% 30%, rgba(99,102,241,0.25), transparent),
    linear-gradient(135deg, #020617, #0f172a);
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* NAV */
.nav-buttons button {
  background: transparent;
  border: 1px solid #334155;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
}

/* LOGO */
.logo-img {
  width: 24px;
}

/* GRID */
.topbar {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 10px;
}

/* CARD */
.card {
  padding: 10px;
  border-radius: 14px;
  transition: all 0.3s ease;
}

/* 🔥 FOCUS BLUR EFFECT */
.content:hover .card {
  filter: blur(2px);
  opacity: 0.6;
  transform: scale(0.98);
}

.content .card:hover {
  filter: blur(0);
  opacity: 1;
  transform: scale(1.02);
  backdrop-filter: blur(22px);
  box-shadow: 0 0 25px rgba(99,102,241,0.4);
  z-index: 2;
}

/* FILTER */
.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

input, select {
  padding: 6px;
  border-radius: 6px;
  background: #0f172a;
  color: white;
  border: none;
}

/* FADE */
.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* CURSOR GLOW */
.cursor-glow {
  position: fixed;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(99,102,241,0.3), transparent);
  filter: blur(60px);
  pointer-events: none;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .sidebar { display: none; }
  .content {
    display: flex;
    flex-direction: column;
  }
}
</style>