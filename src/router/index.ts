import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExploreView from '../views/ExploreView.vue'
import PricingView from '../views/PricingView.vue'
import BuTCheck from "@/views/BuTCheck.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/explore',
        name: 'explore',
        component: ExploreView
    },
    {
        path: '/pricing', // <-- NEU
        name: 'pricing',
        component: PricingView
    },
    { path: '/but',
        name: 'but',
        component: BuTCheck }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router