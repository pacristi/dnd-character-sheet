import { createRouter, createWebHistory } from 'vue-router'
import CharacterSheet from '@/views/CharacterSheet.vue'

const routes = [
    {
        path: '/',
        name: 'CharacterSheet',
        component: CharacterSheet
    },
    {
        path: '/session-notes',
        name: 'SessionNotes',
        // Route level code-splitting - generates a separate chunk for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "session" */ '@/views/SessionNotes.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router