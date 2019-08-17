<template>
  <layout-default>
    <router-view />
  </layout-default>
</template>

<script>
import LayoutDefault from './layout/LayoutDefault.vue';
export default {
  name: 'App',
  components: {
    LayoutDefault,
  }
}
</script>

<style lang="scss" scoped>

</style>
