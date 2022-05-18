import { createApp } from 'vue';
import naive from 'naive-ui';
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';

import App from './App.vue';
import router from './router';

import './mock';
// import './useWorker';

createApp(App).use(router).use(naive).mount('#app');
