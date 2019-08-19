Vue.component('auth', {
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    swapForm() {// показываем либо форму авторизации либо регистрации
      this.$parent.isSignedUp = !this.$parent.isSignedUp;
    },
    setDefault() { // устанавливаем как для изначальной страницы
      this.$parent.isSignedUp = true;
      this.$parent.ifAuthorized = false;
      this.$parent.showTasks = false;
    },
    setAuthorized() { // даем права доступа к странице с задачами
      this.$parent.ifAuthorized = true;
      this.$parent.showTasks = true;
    },
    login() {
      const data = {
        username: this.username,
        password: this.password,
      };
      fetch(`/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
          .then((result) => result.json())
          .then((data) => {
            if (data.result === 'success') {
              const newToken = `JWT ${data.token}`;
              localStorage.setItem('userKey', newToken);
              this.setAuthorized();
              this.error = false;
              this.$parent.$refs.AllTasks.getAll();
            } else {
              this.setDefault();
              this.error = data.message;
            }
          })
          .catch((error) => console.log(error));
    },
  },
  template: `
  <form class="col-6 text-center border border-light p-5" @submit.prevent="login">
        <p class="h4 mb-4">Sign in</p>
        <input required v-model="username" type="text" id="defaultLoginFormEmail" class="form-control mb-4" placeholder="Login">
        <input required v-model="password" type="password" id="defaultLoginFormPassword" class="form-control mb-4" placeholder="Password">
        <h4 v-show="error" class="text-danger mb-3">{{error}}</h4>
        <button class="btn btn-info btn-block my-4" type="submit">Sign in</button>
         <p>Not a member?
              <span class="text-primary" style="cursor: pointer;" @click="swapForm()">Sing Up</span>
          </p>
  </form>
  `,
});
