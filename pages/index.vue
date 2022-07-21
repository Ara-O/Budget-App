<template>
  <main class="index-main" v-if="userIsSignedIn">
    <section class="main-section_left">
      <income-section></income-section>
      <bill-section></bill-section>
      <!-- <section class="total-income-section">
        <h3 class="title">TOTAL INCOME</h3>
      </section> -->
    </section>
    <section class="main-section_right">
      <graph></graph>
      <div class="expenses-and-goals-section">
        <expenses-section> </expenses-section>
        <user-goals></user-goals>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { userIsSignedIn } from "../modules/firebaseServices.js";
import Vue from "vue";
export default Vue.extend({
  head() {
    return {
      title: "Save Money!",
    };
  },
  data() {
    return {
      userIsSignedIn: false,
    };
  },
  mounted() {
    userIsSignedIn()
      .then((res) => {
        this.$store.commit("changeUserID", res);
        this.userIsSignedIn = true;
      })
      .catch((err) => {
        this.$router.push("/signup");
        console.log(err);
      });
  },
});
</script>

 <style scoped>
@import url("../assets/styles/main.css");
@import url("../assets/styles/styles.css");
/* @import url("../assets/styles/sign-up.css"); */
</style>

<style>
html {
  background-color: #f2f5f7 !important;
  padding: 1.4vh 2vh;
  overflow: auto;
}
</style> 