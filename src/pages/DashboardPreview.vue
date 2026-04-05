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

  <div class="dashboard">

    <div class="parallax-bg"></div>

    <!-- 🔥 HEADER -->
    <div class="header glass">

      <!-- LEFT -->
      <div class="header-left">
        <h2>Flowledger</h2>
      </div>

      <!-- CENTER -->
      <div class="header-center">
        <img :src="logo" class="logo-img" />
      </div>

      <!-- RIGHT -->
      <div class="header-right">
        <button>Home</button>
        <button>Reports</button>
        <button>Settings</button>

        <!-- ROLE HERE -->
        <select v-model="role" class="role-select">
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

    </div>

    <div class="ticker">
      <Ticker :transactions="transactions" />
    </div>

    <div class="topbar">
      <div class="stat glass">₹{{ animatedTotal }}<p>Total</p></div>
      <div class="stat glass">{{ transactions.length }}<p>Transactions</p></div>
      <div class="stat glass">Active<p>Status</p></div>
    </div>

    <div class="card glass filter-bar">
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
        <div class="card glass strong">
          <h3>📊 Insights</h3>
          <p>Top Category: {{ topCategory }}</p>
          <p>Total Spent: ₹{{ total }}</p>
        </div>

        <div class="card glass strong">
          <h3>🔥 Highlights</h3>
          <p>Most Active Category: {{ topCategory }}</p>
        </div>
      </div>

      <div class="center">
        <div class="card glass">
          <WaveChart :transactions="transactions" />
        </div>

        <div class="card glass">
          <TransactionList
            :transactions="filteredTransactions"
            :role="role"
            @delete="deleteTransaction"
          />
        </div>
      </div>

      <div class="right">
        <div class="card glass">
          <CategoryChart :transactions="transactions" />
        </div>

        <div class="card glass" v-show="role === 'admin'">
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
  background: radial-gradient(circle at 20% 20%, #0f172a, #020617);
  color: #e5e7eb;
}

/* DASHBOARD */
.dashboard {
  padding: 15px;
  height: 100vh;
  overflow-y: auto;
}

/* HEADER */
.header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 8px 15px;
  margin-bottom: 10px;
}

.header-left { justify-self: start; }
.header-center { justify-self: center; }
.header-right {
  justify-self: end;
  display: flex;
  gap: 10px;
  align-items: center;
}

/* LOGO */
.logo-img {
  width: 45px;
}

/* ROLE */
.role-select {
  padding: 5px;
  border-radius: 6px;
  background: #020617;
  color: white;
  border: 1px solid #334155;
}

/* NAV */
.header-right button {
  background: rgba(255,255,255,0.05);
  border: 1px solid #334155;
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
}

/* GLASS */
.glass {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
}

/* GRID */
.topbar {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 12px;
}

/* CARD */
.card {
  padding: 12px;
  border-radius: 14px;
  transition: all 0.3s ease;
}

/* LEFT */
.strong {
  box-shadow: 0 0 25px rgba(99,102,241,0.25);
}

/* BLUR EFFECT */
.content:hover .card {
  filter: blur(2px);
  opacity: 0.6;
}

.content .card:hover {
  filter: blur(0);
  opacity: 1;
  transform: scale(1.03);
  box-shadow: 0 0 30px rgba(99,102,241,0.5);
}

/* FILTER */
.filter-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 10px 0;
}

/* INPUT */
input, select {
  padding: 5px;
  border-radius: 6px;
  background: #020617;
  color: white;
  border: 1px solid #334155;
}

/* BACKGROUND */
.parallax-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 20% 30%, rgba(99,102,241,0.3), transparent),
    linear-gradient(135deg, #020617, #0f172a);
}

/* CURSOR */
.cursor-glow {
  position: fixed;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(99,102,241,0.3), transparent);
  filter: blur(60px);
}
</style>