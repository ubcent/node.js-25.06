<template>
  <nav class="row navbar navbar-light blue lighten-4">
    <span class="col-4">
      <button v-if="token" class="btn btn-default btn-rounded" @click="logout">Log out
      <i class="fas fa-sign-out-alt ml-4"></i>
    </button>
    </span>
    <span class="col-4 text text-center font-weight-bold font-italic">TODO TASK MANAGER&ensp;
      <i class="fas fa-check-circle"></i>
    </span>
    <span class="col-4 text text-center font-weight-bold"> <span v-if="name"> Hello {{name}}! </span></span>
  </nav>
</template>

<script>
  export default {
    name: 'AppHeader',
    data() {
      return {
        token: null,
        name: null,
      };
    },
    mounted() {
      this.token = !!localStorage.getItem('userKey');
      if (localStorage.getItem('userName')) {
        this.name = localStorage.getItem('userName');
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('userKey');
        localStorage.removeItem('userName');
        window.location.href = '/auth';
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
