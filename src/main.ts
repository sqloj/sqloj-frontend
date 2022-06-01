import { createApp } from 'vue';
import naive from 'naive-ui';
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';
import VueDOMPurifyHTML from 'vue-dompurify-html';
import App from './App.vue';
import router from './router';
import katex from './setting/katex';
import hljs from './setting/highlight';
import './setting/constructor';

if (process.env.NODE_ENV === 'mock') {
  import('./mock');
}
// import './useWorker';

createApp(App)
  .use(router)
  .use(VueDOMPurifyHTML)
  .use(naive)
  .use(hljs)
  .use(katex)
  .mount('#app');
