import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useStoreLibrary } from '../src/stores/storeLibrary';
import './tailwind.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import TheNav from './components/TheNav.vue';
import { createPinia } from 'pinia';

const app = createApp(App);
app.config.productionTip = false;
app.component('the-nav', TheNav);
app.use(Antd);
app.use(createPinia());

app.use(router).mount('#app');
