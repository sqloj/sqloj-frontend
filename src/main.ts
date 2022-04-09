import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import naive from 'naive-ui'
import './mock'

// createApp(App).use(router).mount('#app')
createApp(App).use(router).use(naive).mount("#app");
