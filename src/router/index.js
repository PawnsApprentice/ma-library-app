import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AdminViewBooks from '../views/AdminViewBooks.vue';
import AdminViewRequests from '../views/AdminViewRequests.vue';
import NormalViewBooks from '../views/NormalViewBooks.vue';
import NormalViewRequests from '../views/NormalViewRequests.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/admin-view-book',
        name: 'adminbook',
        component: AdminViewBooks,
    },
    {
        path: '/admin-view-requests',
        name: 'adminreview',
        component: AdminViewRequests,
    },
    {
        path: '/normal-view-book',
        name: 'normalbook',
        component: NormalViewBooks,
    },
    {
        path: '/normal-view-requests',
        name: 'normalreview',
        component: NormalViewRequests,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
