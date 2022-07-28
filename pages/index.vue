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

<script>
import { userIsSignedIn, setUpFirebase } from "../modules/firebaseServices.js";
export default{
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
    setUpFirebase(this)
    userIsSignedIn()
      .then((res) => { 
        this.$store.commit("changeUserID", res);
        this.userIsSignedIn = true;
      })
      .catch((err) => {
        this.$router.push("/signup");
      });
  },
};
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

body {
  margin: 0px !important
}
</style> 