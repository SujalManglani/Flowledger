<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goDashboard = () => router.push("/dashboard");
</script>

<template>
  <div class="home">

    <h1 class="title">Flowledger</h1>
    <p class="subtitle">Smart Finance Dashboard</p>

    <button @click="goDashboard" class="btn">
      Go to Dashboard →
    </button>

  </div>
</template>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background:
    radial-gradient(circle at 20% 30%, rgba(99,102,241,0.3), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(236,72,153,0.25), transparent 40%),
    linear-gradient(135deg, #020617, #0f172a);

  color: white;
  text-align: center;
}

.title {
  font-size: 40px;
  font-weight: bold;
}

.subtitle {
  margin: 10px 0 30px;
  color: #9ca3af;
}

.btn {
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  background: #6366f1;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  background: #4f46e5;
}
</style>