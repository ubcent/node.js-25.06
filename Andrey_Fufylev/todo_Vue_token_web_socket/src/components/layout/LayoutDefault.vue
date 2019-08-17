<template>
  <div>
    <app-header></app-header>
    <main class="container">
      <slot></slot>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from '../app/AppHeader.vue';
import AppFooter from '../app/AppFooter.vue';

export default {
  name: 'LayoutDefault',
  components: {
    AppHeader,
    AppFooter,
  }
}
</script>

<style lang="sass" scoped>

</style>

