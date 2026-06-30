import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExploreView from '../views/ExploreView.vue'
import PricingView from '../views/PricingView.vue'
import BuTCheck from "@/views/BuTCheck.vue";
import AuthView from "@/views/AuthView.vue";
import { supabase } from '@/lib/supabaseClient'

// @ts-ignore
// @ts-ignore
const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: AuthView
    },
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
        path: '/pricing',
        name: 'pricing',
        component: PricingView
    },
    {
        path: '/but',
        name: 'but',
        component: BuTCheck
    },
    {
        path: '/meine-buchungen',
        name: 'meine-buchungen',
        component: () => import('../views/MeineBuchungen.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
            next({ name: 'login' })
            return
        }
    }
    next()
})

export default router