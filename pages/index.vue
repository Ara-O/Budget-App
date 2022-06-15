<template>
<main class="index-main" v-if="userIsSignedIn">
  <h3>Hello</h3>
</main>
</template>

<script lang="ts">
import {userIsSignedIn} from "../modules/firebaseServices.js";
import Vue from 'vue'
export default Vue.extend({
  head(){
    return {
      title: "Save Money!"
    }
  }, 
  data(){
    return {
      userIsSignedIn: false,
    }
  },
  mounted(){
      userIsSignedIn().then((res)=> {
        if(res){
          this.userIsSignedIn = true;
        }else {
          this.$router.push("/signup")
        }
      })
  }
})
</script>
