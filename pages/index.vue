<template>
  <main class="index-main" v-if="userIsSignedIn">
    <section class="main-section_left">
      <section class="income-section">
        <h3>Income</h3>
      </section>
      <section class="bill-section">
        <h3>Bills</h3>
      </section>
      <section class="total-income-section">
        <h3>Total Income</h3>
      </section>
    </section>
    <section class="main-section_right">
      <section class="graph-section">
        <h3>Graph section</h3>
      </section>
      <section class="expense-section">
        <h3>Expense section</h3>
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
    userIsSignedIn().then((res) => {
      if (res) {
        this.userIsSignedIn = true;
      } else {
        this.$router.push("/signup");
      }
    });
  },
});
</script>

<style>
@import url("../assets/styles/styles.css");
@import url("../assets/styles/main.css");
</style>