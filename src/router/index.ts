import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/About',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/Login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/Main',
    name: 'Main',
    component: () => import('../views/MainView.vue')
  },
  {
    path: '/Student',
    name: 'Student',
    component: () => import('../views/StudentMain.vue')
  },
  {
    path: '/Teacher',
    name: 'Teacher',
    component: () => import('../views/TeacherMain.vue')
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
