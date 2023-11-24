import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({    
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'main',
                    component: () => import('@/components/Dashboard.vue'),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/components/Dashboard.vue'),
                    meta: {
                        requiresAuth: true
                    }
                },                
                {
                    path: '/socios',
                    name: 'socios',
                    component: () => import('@/components/mantenimiento/Socio.vue'),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/servicios',
                    name: 'servicios',
                    component: () => import('@/components/mantenimiento/Servicio.vue'),
                    meta: {
                        requiresAuth: true
                    }
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/components/authentication/Login.vue'),
            beforeEnter: (to, from, next) => {
                if (helpers.isTokenValided()) {
                    if (helpers.isTokenActive()) { return next({name: 'main'})
                    } else { return next({name: 'expiredsession'}) }
                }

                next()
            }
        },
        {
            path: '/logout',
            name: 'logout',
            beforeEnter: async (to, from, next) => {
                if (helpers.isTokenValided()) {
                    if (!helpers.isTokenActive()) { return next({name: 'expiredsession'}) } 
                    await helpers.invalidateToken()
                }

                next({ name: 'login'})
            }
        },
        {
            path: '/expiredsession',
            name: 'expiredsession',
            component: () => import('@/components/authentication/ExpiredSession.vue'),
            beforeEnter: (to, from, next) => {
                if (!helpers.isTokenValided()) { return next({ name: 'login'}) }
                if (helpers.isTokenActive()) { return next({ name: 'main'}) }
                next()
            }
        },
        {
            path: '/pagenotfound',
            name: 'pagenotfound',
            component: () => import('@/components/authentication/PageNotFound.vue'),
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (!router.options.routes.find(route => route.path === to.path) && !router.options.routes[0].children.find(route => route.path === to.path)) { return next({name: 'pagenotfound'}) }

    if (to.meta.requiresAuth) {
        if (!helpers.isTokenValided()) { return next({ name: 'login'}) }
        if (!helpers.isTokenActive()) { return next({ name: 'expiredsession'}) }
    }
    
    next();
});

export default router;
