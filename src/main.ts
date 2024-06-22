import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';

const app = createApp(App);

if (import.meta.env.PROD) {
  console.log('애널리틱스 로깅 시작');
  logEvent(analytics, 'notification_received');
}
app.use(createPinia());
app.use(router);

app.mount('#app');
