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
        <h3 class="signup-section_title">Start saving money!</h3>
        <label for="email">Email Address: </label> <br />
        <input
          type="text"
          name=""
          id="email"
          ref="email"
          class="form-input"
          value="oladipoara@gmail.com"
        />
        <br />
        <label for="password">Password: </label> <br />
        <input
          type="password"
          id="password"
          ref="password"
          class="form-input"
          value="vrewepnqpwe"
        />
        <NuxtLink to="/login"
          ><h5 class="already-have-account">
            I already have an account
          </h5></NuxtLink
        >
        <button class="sign-up-btn" type="submit" @click="registerUser">
          Sign Up
        </button>
        <h5 v-if="missingField" style="font-weight: 300">
          There is one or more missing fields...
        </h5>
      </section>
    </section>
  </main>
</template>

<style>
@import url("../assets/styles/sign-up.css");
@import url("../assets/styles/styles.css");
</style>

<script>
import { registerUser as registerUserFirebase } from "../modules/firebaseServices";
import {validateEntries} from "../modules/utilities.js"
export default {
  // transition: "sign-up",
  head() {
    return {
      title: "Sign Up",
    };
  },

  data() {
    return {
      missingField: false,
    };
  },

  methods: {
    registerUser() {
      let email = this.$refs.email.value;
      let password = this.$refs.password.value;
      this.missingField = false;
      if (validateEntries(email, password)) {
        registerUserFirebase(email, password);
      }
    },
  },

  mounted() {
    this.$refs.email.focus();
  },
};
</script>
</script>