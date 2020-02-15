<template>
     <div id="dashboard">
          <h1>That's the dashboard!</h1>
          <p>You should only get here if you're authenticated!</p>
          <p>Your email address: {{ user.email }}</p>
          <p>working in : {{ user.country }}</p>
     </div>
</template>

<script>
import axios from "axios";

export default {
     data() {
          return {};
     },
     computed: {
          user() {
               return !this.$store.getters.user
                    ? false
                    : this.$store.getters.user;
          }
     },
     created() {
          this.$store.dispatch("getUser");
     }
};
</script>
<style scoped>
h1,
p {
     text-align: center;
}

p {
     color: red;
}
</style>