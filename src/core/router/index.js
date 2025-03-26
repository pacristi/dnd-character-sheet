/**
 * Router Configuration
 * Defines application routes
 */
import { createRouter, createWebHistory } from 'vue-router';

// Import views
import { CharacterSheet } from '@/features/character-sheet';
import { SessionNotes } from '@/features/session-notes';

/**
 * Route definitions
 */
const routes = [
    {
        path: '/',
        name: 'CharacterSheet',
        component: CharacterSheet
    },
    {
        path: '/session-notes',
        name: 'SessionNotes',
        component: SessionNotes
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'CharacterSheet' }
    }
];

/**
 * Router instance
 */
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;