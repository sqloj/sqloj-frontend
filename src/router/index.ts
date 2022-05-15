import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/MainView.vue'),
    children: [
      {
        path: 'question-manage',
        name: 'question-manage',
        component: () => import('../views/QuestionManage.vue')
      },
      {
        path: 'student-manage',
        name: 'student-manage',
        component: () => import('../views/StudentManage.vue')
      },
      {
        path: 'self-info',
        name: 'self-info',
        component: () => import('../views/SelfInfo.vue')
      },
      {
        path: 'admin-accoun-manage',
        name: 'admin-accoun-manage',
        component: () => import('../views/AdminAccountManage.vue')
      },
      {
        path: 'submit-record',
        name: 'submit-record',
        component: () => import('../views/SubmitRecord.vue')
      },
      {
        path: 'question/:QuestionId',
        name: 'question',
        component: () => import('../views/QuestionPage.vue')
      },
      {
        path: 'question-editor/:QuestionId',
        name: 'question-editor',
        component: () => import('../views/QuestionEditor.vue')
      },
      {
        path: 'test-case',
        name: 'test-case',
        component: () => import('../views/TestCase.vue')
      },
      {
        path: 'test-case-editor:testcaseId',
        name: 'test-case-editor',
        component: () => import('../views/TestCaseEditor.vue')
      }
    ]
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('../views/404Page.vue')
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
