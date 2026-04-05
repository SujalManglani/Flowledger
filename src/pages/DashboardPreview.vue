<script setup>
import { ref, computed, onMounted } from "vue";

import CategoryChart from "../components/dashboard/CategoryChart.vue";
import WaveChart from "../components/dashboard/WaveChart.vue";
import AddTransactionForm from "../components/transactions/AddTransactionForm.vue";
import TransactionList from "../components/transactions/TransactionList.vue";
import Ticker from "../components/Ticker.vue";
import logo from "../assets/logo.png";

/* DATA */
const transactions = ref([
  { id: 1, title: "Groceries", amount: 500, category: "Food", date: "2026-04-05" },
  { id: 2, title: "Taxi", amount: 200, category: "Travel", date: "2026-04-04" }
]);

const addTransaction = (tx) => transactions.value.push(tx);
const deleteTransaction = (id) => {
  transactions.value = transactions.value.filter(t => t.id !== id);
};

const total = computed(() =>
  transactions.value.reduce((s, t) => s + t.amount, 0)
);

/* ROLE */
const role = ref("admin");

/* COUNTER */
const animatedTotal = ref(0);

/* PARALLAX */
const offset = ref(0);

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

  const dashboard = document.querySelector(".dashboard");

  if (dashboard) {
    dashboard.addEventListener("scroll", () => {
      offset.value = dashboard.scrollTop;
    });
  }

  const cards = document.querySelectorAll(".card");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  });

  cards.forEach((c) => observer.observe(c));

  window.addEventListener("mousemove", (e) => {
    const glow = document.querySelector(".cursor-glow");
    if (glow) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }
  });
});
</script><template>
<div class="app">  <div class="cursor-glow"></div>  <div class="sidebar glass">
    <div class="logo">F</div><select v-model="role" class="role-select">
  <option value="admin">Admin</option>
  <option value="viewer">Viewer</option>
</select>

  </div>  <div class="dashboard"><div
  class="parallax-bg"
  :style="{ transform: `translateY(${offset * 0.2}px)` }"
></div>

<div class="header glass">
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

<div class="ticker">
  <Ticker :transactions="transactions" />
</div>

<div class="topbar">
  <div class="stat big">₹{{ animatedTotal }}<p>Total</p></div>
  <div class="stat">{{ transactions.length }}<p>Transactions</p></div>
  <div class="stat">Active<p>Status</p></div>
</div>

<div class="content">

  <div class="left">
    <div class="card glow-card">
      <h3>📊 Market</h3>
      <p>📈 NIFTY +1.2%</p>
      <p>📈 SENSEX +0.8%</p>
      <p>🪙 BTC ₹58L</p>
    </div>

    <div class="card glow-card">
      <h3>🔥 Top Movers</h3>
      <p>🚀 HDFC ▲</p>
      <p>🚀 INFY ▲</p>
    </div>
  </div>

  <div class="center">
    <div class="card hero">
      <WaveChart :transactions="transactions" />
    </div>

    <div class="card list">
      <TransactionList
        :transactions="transactions"
        :role="role"
        @delete="deleteTransaction"
      />
    </div>
  </div>

  <div class="right">
    <div class="card pie">
      <CategoryChart :transactions="transactions" />
    </div>

    <!-- ✅ FIXED HERE -->
    <div class="card form" v-show="role === 'admin'">
      <AddTransactionForm @add="addTransaction" />
    </div>
  </div>

</div>

  </div>
</div>
</template><style scoped>

/* SAME CSS — UNCHANGED */

:global(body) {
  margin: 0;
  background: #020617;
  color: #e5e7eb;
  font-family: "Inter", sans-serif;
}

.app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  gap: 20px;
}

.role-select {
  width: 70px;
  padding: 4px;
  border-radius: 6px;
  background: #0f172a;
  color: white;
  border: 1px solid #334155;
}

.dashboard {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  min-height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.parallax-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(99,102,241,0.25), transparent),
    linear-gradient(135deg, #020617, #0f172a);
}

.dashboard > * {
  position: relative;
  z-index: 1;
}

.glass {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(18px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.nav-buttons button {
  background: transparent;
  border: 1px solid #334155;
  color: #e5e7eb;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.nav-buttons button:hover {
  background: #1e293b;
}

.topbar {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;
}

.stat {
  background: rgba(255,255,255,0.05);
  padding: 10px;
  border-radius: 12px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 10px;
  align-items: start;
}

.left, .center, .right {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero { height: 200px; }
.list { max-height: 300px; overflow-y: auto; }

.pie {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}

.pie canvas {
  animation: spin 10s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.form { max-height: 300px; overflow-y: auto; }

.card {
  background: rgba(255,255,255,0.05);
  padding: 10px;
  border-radius: 14px;
  opacity: 0;
  transform: translateY(30px);
  transition: 0.4s;
}

.card.show {
  opacity: 1;
  transform: translateY(0);
}

.glow-card:hover {
  box-shadow: 0 0 20px rgba(99,102,241,0.4);
}

.content:hover .card:not(:hover) {
  filter: blur(3px);
}

.cursor-glow {
  position: fixed;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(99,102,241,0.3), transparent);
  filter: blur(60px);
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.ticker {
  position: relative;
  z-index: 2;
  margin: 8px 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 32px;
}

@media (max-width: 900px) {
  .sidebar { display: none; }
  .content {
    display: flex;
    flex-direction: column;
  }
}

</style>