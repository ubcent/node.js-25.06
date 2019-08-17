import router from './router';

import App from './components/App.vue';

import Vue from 'vue';

new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app');
