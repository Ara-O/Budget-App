<template>
  <main class="sign-up-main">
    <section class="main-section">
      <img
        src="~/assets/images/stacked-coin.png"
        class="stacked-coin"
        alt="Stacked coin"
      />
      <img src="~/assets/images/coin.png" class="coin-1" alt="Stacked coin" />
      <img src="~/assets/images/coin.png" class="coin-2" alt="Stacked coin 2" />
      <section class="signup-section">
        <h3 class="signup-section_title">Log in!</h3>
        <label for="email">Email Address: </label> <br />
        <input type="text" name="" id="email" ref="email" class="form-input" value="oladipoara@gmail.com"/>
        <br />
        <label for="password">Password: </label> <br />
        <input
          type="password"
          id="password"
          ref="password"
          class="form-input"
          value="vrewepnqpwe"
        />
       <NuxtLink to="/signup"><h5 class="already-have-account">I don't have an account</h5></NuxtLink> 
        <button class="sign-up-btn" type="submit" @click="logInUser">
          Log In
        </button>
        <h5 v-if="missingField" style="font-weight: 300">There is one or more missing fields...</h5>
      </section>
    </section>
  </main>
</template>

<style>
@import url("../assets/styles/sign-up.css");
@import url("../assets/styles/styles.css");
</style>

<script>
import { logInUser as logInUserFirebase } from '../modules/firebaseServices';
export default {
  head() {
    return {
      title: "Log In",
    };
  },

  data(){
    return {
      missingField: false,
    }
  },

  methods: {
    validateEntry(...allFields){
      allFields.forEach((el)=> {
        if(el.trim()=== ''){
          console.log("emtpy")
          this.missingField = true;
        } 
      });

     return this.missingField === true ? false : true;
    },

    logInUser() {
      let email = this.$refs.email.value;
      let password = this.$refs.password.value;
      this.missingField = false;
      if(this.validateEntry(email, password)){
        logInUserFirebase(email, password).then((user)=> {
          this.$router.push("/")
        }).catch((err) => alert(err))
      }
    },
  },

  mounted() {
    this.$refs.email.focus();
  },
};
</script>
</script>