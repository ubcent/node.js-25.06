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
      fetch(`/isAuthorized`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('userKey'),
        },
      })
          .then((result) => result.json())
          .then((data) => {
            if (data.result === 'success') {
              this.ifAuthorized = true;
              this.showTasks = true;
            } else {
              console.log(data.result);
            }
          })
          .catch((error) => console.log(error));
    }
  },
  methods: {
  },
});
