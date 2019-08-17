<template>
  <form class="col-6 text-center border border-light p-5 my-5" @submit.prevent="login">
    <p class="h4 mb-4">Sign in</p>
    <input required v-model="username" type="text" id="defaultLoginFormEmail" class="form-control mb-4"
      placeholder="Login">
    <input required v-model="password" type="password" id="defaultLoginFormPassword" class="form-control mb-4"
      placeholder="Password">
    <h4 v-show="error" class="text-danger mb-3">{{error}}</h4>
    <button class="btn btn-info btn-block my-4" type="submit">Sign in</button>
    <p>Not a member?
      <router-link :to="{ name: 'register' }"> Sign Up </router-link>
    </p>
  </form>
</template>

<script>
  export default {
    name: 'AuthPage',
    data() {
      return {
        username: '',
        password: '',
        error: null,
      }
    },
    /*sockets: {
      connect() {
        console.log('socket connected');
      },
      addTask(data) {
        console.log(`task was added`);
        if (data.result === 'success') {
          this.getAll();
        }
      }
    },*/
    mounted() {
      /*if (localStorage.getItem('userKey')) {
        window.location.href = '/';
      }*/
    },
    methods: {
      login() {
        const data = {
          username: this.username,
          password: this.password,
        };
        fetch(`http://localhost:3000/auth`, {
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
              const userName = `${data.firstName} ${data.lastName}`;
              localStorage.setItem('userKey', newToken);
              localStorage.setItem('userName', userName);
              this.error = false;
              window.location.href = '/';
              this.$parent.$refs.AllTasks.getAll();
            } else {
              this.error = data.message;
            }
          })
          .catch((error) => console.log(error));
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
