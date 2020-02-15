<template>
     <div id="app">
          <app-header />
          <vue-page-transition name="fade">
               <router-view></router-view>
          </vue-page-transition>
     </div>
</template>

<script>
import Header from "./components/header/header.vue";

export default {
     name: "app",
     components: {
          "app-header": Header
     },
     created() {
          // app start - try sign user in.
          this.$store.dispatch("tryAutoLogin");
     }
};
</script>

<style>
body,
html {
     margin: 0;
     font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>