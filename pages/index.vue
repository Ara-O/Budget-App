<template>
  <main class="index-main" v-if="userIsSignedIn">
    <section class="main-section_left">
      <income-section></income-section>
      <section class="bill-section">
        <h3 class="title">BILLS</h3>
      </section>
      <!-- <section class="total-income-section">
        <h3 class="title">TOTAL INCOME</h3>
      </section> -->
    </section>
    <section class="main-section_right">
      <section class="graph-section">
        <h3 class="title">GRAPH SECTION</h3>
      </section>
      <section class="expense-section">
        <h3 class="title">EXPENSE SECTION</h3>
      </section>
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
        this.$router.push("/signup")
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
  padding: 2vh 2vh;
  overflow: hidden;
}
</style> 