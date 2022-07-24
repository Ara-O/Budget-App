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
        <h5 v-if="loading" style="font-weight: 300">Signing Up...</h5>
        <h5 v-if="loadingError" style="font-weight: 300">
          There has been an error
        </h5>
      </section>
    </section>
  </main>
</template>

<script>
import { registerUser as registerUserFirebase } from "../modules/firebaseServices";
import { validateEntries } from "../modules/utilities.js";
export default {
  // transition: "sign-up",
  head() {
    return {
      title: "Sign Up",
      // bodyAttrs: {
      //   class: "reset-body",
      // },
    };
  },

  data() {
    return {
      missingField: false,
      loading: false,
      loadingError: false,
    };
  },

  methods: {
    registerUser() {
      let email = this.$refs.email.value;
      let password = this.$refs.password.value;
      this.missingField = this.loadingError = false;

      if (validateEntries(email, password)) {
        this.loading = true;
        registerUserFirebase(email, password, this).then((uid)=> {
          this.$store.commit("changeUserID", uid);
          this.$router.push("/");
        }).catch((err)=> {
          this.loading = false;
          this.loadingError = true;
        });
      } else {
        this.missingField = false;
      }
    },
  },

  mounted() {
    this.$refs.email.focus();
  },
};
</script>

  
<style scoped>
@import url("../assets/styles/sign-up.css");
@import url("../assets/styles/styles.css");
</style>
  
<style>
body {
  margin: 0px;
}
</style>