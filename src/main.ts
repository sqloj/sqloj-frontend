import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import setupNaive from './plugins/naive'
import './mock'

// createApp(App).use(router).mount('#app')
const app = createApp(App);
setupNaive(app);
app.use(router);
app.mount("#app");