Vue.component('logout', {
  data() {
    return {
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('userKey');
      window.location.href = '/';
    },
  },
  template: `
    <button class="btn btn-default btn-rounded" @click="logout">Log out <i class="fas fa-sign-out-alt ml-4"></i></button>
  `,
});
