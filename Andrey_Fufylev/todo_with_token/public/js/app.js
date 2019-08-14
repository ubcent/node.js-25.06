new Vue({
  el: '#app',
  data: {
    isSignedUp: true,
    ifAuthorized: false,
    showTasks: false,
    showUpdateForm: false,
  },
  mounted() {
    if (localStorage.getItem('userKey')) {
      this.ifAuthorized = true;
      this.showTasks = true;
    }
  },
  methods: {
  },
});
