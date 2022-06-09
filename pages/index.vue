<template>
<h3>Bah</h3>
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
  mounted(){
      userIsSignedIn().then((res)=> {
        if(res){
          alert("user is signed in")
        }else {
          this.$router.push("/signup")
        }
      })
  }
})
</script>
