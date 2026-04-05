import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import DashboardPreview from "../pages/DashboardPreview.vue";
import Insights from "../pages/Insights.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/dashboard", component: DashboardPreview },
  { path: "/insights", component: Insights }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;