new Vue({
  el: '#app',
  data: {
    isSignedUp: true,
    ifAuthorized: false,
    showTasks: false,
    showUpdateForm: false,
  },
  mounted() {
    fetch(`/auth`)
        .then((result) => result.json())
        .then((data) => {
          if (data.result === 'success') {
            this.ifAuthorized = true;
            this.showTasks = true;
          }
        })
        .catch((error) => console.log(error));
  },
  methods: {
  },
});
