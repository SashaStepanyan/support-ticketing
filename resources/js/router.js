import { createRouter, createWebHistory } from "vue-router";
import store from './store';
import auth from "./middlewares/auth.js";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("./Pages/HomePage.vue"),
        meta: { middlewares: [auth] }
    },
    {
        path: "/login",
        name: "login",
        component: () => import("./Pages/LoginPage.vue"),
    },
    {
        path: "/register",
        name: "register",
        component: () => import("./Pages/RegisterPage.vue"),
    },
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

// Global Middleware
router.beforeEach((to, from, next) => {
    if (to.meta.middlewares && to.meta.middlewares.length > 0) {
        to.meta.middlewares.forEach((middleware) => {
            middleware({ next, store });
        })
    } else {
        next();
    }
});

export default router;
