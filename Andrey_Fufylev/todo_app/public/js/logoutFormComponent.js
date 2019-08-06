Vue.component('logout', {
  data() {
    return {
    };
  },
  methods: {
    logout() {
      fetch(`/logout`)
          .then((result) => result.json())
          .then((data) => {
            if (data.result === 'success') {
              this.$parent.isSignedUp = true;
              this.$parent.ifAuthorized = false;
              this.$parent.showTasks = false;
            }
          })
          .catch((error) => console.log(error));
    },
  },
  template: `
    <button class="btn btn-default btn-rounded" @click="logout">Log out <i class="fas fa-sign-out-alt ml-4"></i></button>
  `,
});
