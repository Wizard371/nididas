import Vue from "vue";
import VueRouter from "vue-router";

// Page Imports
import HomePage from "@/views/HomePage.vue";
import Login from "@/views/LoginPage.vue";
import Konto from "@/views/KontoPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/konto",
    name: "Konto",
    component: Konto,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
