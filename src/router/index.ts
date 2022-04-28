import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue')
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
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/404.vue')
  },
  {
    path: '/:pathMatch(.*)*', 
    redirect: '/404'
  }
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
