import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const PageHome = () => import(/* webpack-chunk-name: "PageHome" */ './components/pages/PageHome.vue');
const AuthPage = () => import(/* webpack-chunk-name: "AuthPage" */ './components/pages/AuthPage.vue');
const RegisterPage = () => import(/* webpack-chunk-name: "RegisterPage" */ './components/pages/RegisterPage.vue');


export default new VueRouter({
  routes: [
    {
      name: 'home',
      path: '/',
      component: PageHome,
    },
    {
      name: 'authorization',
      path: '/auth',
      component: AuthPage,
      props: true,
    },
    {
      name: 'register',
      path: '/register',
      component: RegisterPage,
      props: true,
    },
  ],
  mode: 'history',
})
