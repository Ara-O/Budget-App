<template>
  <div class="goals-section">
    <h3>Current Goal: ${{ userGoal }}</h3>
    <div class="progress-section">
      <div class="ticks">
        <div class="tick-25">
          <h4>25%</h4>
          <div class="tick-height"></div>
        </div>
        <div class="tick-25">
          <h4>50%</h4>
          <div class="tick-height"></div>
        </div>
        <div class="tick-25">
          <h4>75%</h4>
          <div class="tick-height"></div>
        </div>
      </div>
      <progress
        class="current-goal-progress"
        :value="percentageOfGoals"
        max="100"
      ></progress>
    </div>

    <!-- Divider -->
    <br /><br />
    <div class="divider"></div>
    <br /><br />

    <!-- Sign out -->
    <div class="set-goal">
      <span class="set-goal-text">
        <h3>Set Goal:</h3>
        <input type="number" class="input-set-goal" v-model.number="userGoal" />
      </span>
      <button class="set-goal-btn" @click="setUserGoal">Set</button>
      <br />
    </div>
    <div  class="sign-out-section">
      <h3 @click="signOut">Sign Out</h3>
      <img
        @click="signOut"
        src="../assets/images/sign-out-icon.png"
        alt="Sign out icon from icons8"
        class="sign-out-icon"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { signOutUser } from "../modules/firebaseServices";
import { getDatabase, ref, onValue, set } from "firebase/database";

export default {
  data() {
    return {
      userGoal: 0,
      percentageOfGoals: 0,
    };
  },

  computed: {
    ...mapGetters(["getUserID"]),
  },

  methods: {
    setUserGoal() {
      const db = getDatabase();
      set(ref(db, "users/" + this.getUserID + "/userGoals"), this.userGoal);
    },

    getUserGoal() {
      let _this = this;
      const db = getDatabase();
      const dataRef = ref(db, "users/" + this.getUserID + "/userGoals");
      onValue(dataRef, (snapshot) => {
        let data = snapshot.val();
        _this.userGoal = data;
      });
    },

    calculatePercentOfCurrentGoal() {
      const db = getDatabase();
      const dataRef = ref(db, "users/" + this.getUserID);
      let _this = this;
      onValue(dataRef, (snapshot) => {
        _this.percentageOfGoals = 0;
        let netIncome = 0;
        let data = snapshot.val();
        for (const key in data) {
          if (key === "expenses") {
            for (const key2 in data[key]) {
              netIncome -= data[key][key2].expenseAmount;
            }
          }
          if (key === "income") {
            for (const key2 in data[key]) {
              netIncome += data[key][key2].incomeAmount;
            }
          }
        }

        let percentage = (netIncome / this.userGoal) * 100;

        if (percentage < 25) {
          _this.percentageOfGoals = 0;
        } else if (percentage > 100) {
          _this.percentageOfGoals = 100;
        } else {
          _this.percentageOfGoals = percentage;
        }
      });
    },

    signOut() {
      let _this = this;
      signOutUser().then(() => {
        console.log("user signed out");
        _this.$router.push("/signup");
      });
    },
  },

  mounted() {
    this.getUserGoal();
    this.calculatePercentOfCurrentGoal();
  },
};
</script>


<style scoped>
@import url("../assets/styles/user-goals.css");
</style>
