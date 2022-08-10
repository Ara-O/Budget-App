<template>
  <main class="index-main" v-if="userIsSignedIn">
    <section class="main-section_left">
      <income-section class="income-section-responsive"></income-section>
      <bill-section class="bills-section-responsive"></bill-section>
      <expenses-section class="expense-section-responsive"></expenses-section>
      <!-- <section class="total-income-section">
        <h3 class="title">TOTAL INCOME</h3>
      </section> -->
    </section>
    <section class="main-section_right">
      <graph class="graph-block"></graph>
      <div class="expenses-and-goals-section">
        <expenses-section> </expenses-section>
        <user-goals></user-goals>
      </div>
    </section>
    <section class="main-section_mobile">
      <component :is="mobileComponent"></component>
      <!-- <income-section-mobile></income-section-mobile>      -->
      <footer class="main-section_mobile_footer">
        <h4 @click="mobileComponent = 'income_mobile'">Income</h4>
        <h4 @click="mobileComponent = 'expense_mobile'">Expenses</h4>
        <h4 @click="mobileComponent = 'bill_mobile'">Bills</h4>
      </footer>
    </section>
  </main>
  
</template>

<script>
import { userIsSignedIn, setUpFirebase } from "../modules/firebaseServices.js";
import incomeMobile from "../components/incomeSectionMobile.vue"
import expenseMobile from "../components/expenseSectionMobile.vue"
import billMobile from "../components/billSectionMobile.vue"
export default{
  components: {
      income_mobile: incomeMobile,
      bill_mobile: billMobile,
      expense_mobile: expenseMobile,
  },
  head() {
    return {
      title: "Save Money!",
    };
  },
  data() {
    return {
      userIsSignedIn: false,
      mobileComponent: 'income_mobile'
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

@media (max-width: 750px) {
    html{
        padding: 0px;
    }
}
</style> 