import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

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
    component: () => import('../views/MainView.vue'),
    children: [
      {
        path: '',
        name: 'StudentManage',
        component: () => import('../views/StudentManage.vue')
      },
      {
        path: 'QuestionManage',
        name: 'QuestionManage',
        component: () => import('../views/QuestionManage.vue')
      },
      {
        path: 'StudentManage',
        name: 'StudentManage',
        component: () => import('../views/StudentManage.vue')
      },
      {
        path: 'SelfInfo',
        name: 'SelfInfo',
        component: () => import('../views/SelfInfo.vue')
      }
    ]
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
