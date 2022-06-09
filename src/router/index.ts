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
        path: 'self-page/:userID',
        name: 'self-page',
        component: () => import('../views/SelfPage.vue')
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
        path: 'question-add',
        name: 'question-add',
        component: () => import('../views/QuestionAdd.vue')
      },
      {
        path: 'test-case',
        name: 'test-case',
        component: () => import('../views/TestCase.vue')
      },
      {
        path: 'test-case-add',
        name: 'test-case-add',
        component: () => import('../views/TestCaseAdd.vue')
      },
      {
        path: 'test-case-editor/:testcaseId',
        name: 'test-case-editor',
        component: () => import('../views/TestCaseEditor.vue')
      },
      {
        path: 'judge-server',
        name: 'judge-server',
        component: () => import('../views/JudgeServer.vue')
      },
      {
        path: 'knowledge-share',
        name: 'knowledge-share',
        component: () => import('../views/KnowledgeShare.vue')
      },
      {
        path: 'article-add',
        name: 'article-add',
        component: () => import('../views/ArticleAdd.vue')
      },
      {
        path: 'article-editor/:ArticleId',
        name: 'article-editor',
        component: () => import('../views/ArticleEditor.vue')
      },
      {
        path: 'article-page/:ArticleId',
        name: 'article-page',
        component: () => import('../views/ArticlePage.vue')
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
