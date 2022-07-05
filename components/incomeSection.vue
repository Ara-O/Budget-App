<template>
  <section class="income-section">
    <div class="income-section_title">
      <h3 class="title">INCOME</h3>
      <img
        src="../assets/images/edit-icon.png"
        key="1"
        v-show="!hoveringOverEditIcon && !editingIncome"
        alt="Edit icon"
        class="edit-icon"
        title="Edit icon by icons8"
        @mouseover="hoveringOverEditIcon = true"
        @click="editingIncome = !editingIncome"
      />
      <img
        src="../assets/images/edit-icon2.png"
        key="2"
        v-show="hoveringOverEditIcon || editingIncome"
        alt="Edit icon"
        class="edit-icon"
        title="Edit icon by icons8"
        @mouseleave="hoveringOverEditIcon = false"
        @click="editingIncome = !editingIncome"
      />
    </div>
    <article class="income-section_header_title">
      <h4>From</h4>
      <h4>Amount</h4>
    </article>

    <!-- LIST INCOME SOURCES -->
    <div class="income-section_line"></div>
    <TransitionGroup tag="div" name="income-list" class="income-list-wrapper">
      <div v-for="(income, index) in incomeList" :key="income.key">
        <article class="income-section_header">
          <Transition name="slide-in">
            <img
              src="../assets/images/remove-icon.png"
              alt="Remove icon"
              class="remove-income-btn"
              v-show="editingIncome"
              @click="removeIncome(income)"
            />
          </Transition>
          <h4
            :class="{ 'editing-income-transform': editingIncome }"
            class="income-source"
          >
            {{ income.incomeSource }}
          </h4>
          <h4>{{ income.incomeAmount }}</h4>
        </article>
        <div class="income-section_line"></div>
      </div>
    </TransitionGroup>

    <!-- ADD INCOME  -->
    <Transition name="slide-out" mode="out-in">
      <article class="add-income" v-if="!editingIncome">
        <div>
          <label for="income-source">From: </label>
          <br />
          <input type="text" id="income-source" v-model="inputIncomeSource" />
        </div>
        <div>
          <label for="income-amount">Amount: </label>
          <br />
          <input
            type="number"
            id="income-amount"
            v-model.number="inputIncomeAmount"
            min="0"
          />
        </div>
        <button class="add-income-btn" @click="addIncome">
          <img src="~/assets/images/plus-icon.png" alt="Plus icon" />
        </button>
      </article>
      <div v-else>
        <button class="save-income-changes" @click="saveIncomeChanges">
          Save
        </button>
      </div>
    </Transition>
  </section>
</template>

<script lang="ts">
import { validateEntries } from "../modules/utilities";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  update,
} from "firebase/database";
import Vue from "vue";
import { mapGetters } from "vuex";
export default Vue.extend({
  data() {
    return {
      incomeList: [],
      inputIncomeSource: "test" as string,
      inputIncomeAmount: 40 as number,
      hoveringOverEditIcon: false,
      editingIncome: false as boolean,
    };
  },

  computed: {
    ...mapGetters(["getUserID"]),

    // Revert the income list ( which goes in newest-latest order ) to latest-newest order
    incomeListRevertedToFirebaseOrder() {
      let incomeListFormatted = [];
      this.incomeList.forEach((data) => {
        incomeListFormatted.unshift(data);
      });
      console.log(incomeListFormatted);
      return incomeListFormatted;
    },

    // Converting the array format used to show incomeList back to object format with the key of the array objects as the key
    incomeListFirebaseFormat() {
      let firebaseFormat = {};
      let incomeList = this.incomeListRevertedToFirebaseOrder;
      incomeList.forEach((data) => {
        firebaseFormat[data.key] = {
          dateAdded: data.dateAdded,
          incomeAmount: data.incomeAmount,
          incomeSource: data.incomeSource,
        };
      });

      return firebaseFormat;
    },

    getDate() {
      let currentDate = new Date();
      let cDay = currentDate.getDate();
      let cMonth = currentDate.getMonth() + 1;
      let cYear = currentDate.getFullYear();
      return `${cDay}/${cMonth}/${cYear}`;
    },
  },

  methods: {
    addIncome() {
      if (validateEntries(this.inputIncomeSource, this.inputIncomeSource)) {
        console.log("successful yay!");
        let _this = this;
        const db = getDatabase();
        push(ref(db, "users/" + _this.getUserID + "/income"), {
          incomeSource: _this.inputIncomeSource,
          incomeAmount: Number(_this.inputIncomeAmount),
          dateAdded: this.getDate,
        });
        this.loadIncomeData();
        // this.inputIncomeAmount = 0;
        // this.inputIncomeSource = ''
      } else {
        // !Handle inccomplete input
        console.log("Unsuccessful yay");
      }
    },

    loadIncomeData() {
      console.log("loading income data");
      const db = getDatabase();
      const incomeDataRef = ref(db, "users/" + this.getUserID + "/income");
      let _this = this;
      onValue(incomeDataRef, (snapshot) => {
        this.incomeList = [];
        const data = snapshot.val();
        for (const key in data) {
          data[key].key = key;
          _this.incomeList.unshift(data[key]);
        }
      });
      this.$store.commit("storeIncomeData", this.incomeList);
    },

    removeIncome(income) {
      console.log(income);
      this.incomeList = this.incomeList.filter(
        (data) => data.key !== income.key
      );
    },

    saveIncomeChanges() {
      const db = getDatabase();
      let _this = this;
      set(
        ref(db, "users/" + _this.getUserID + "/income/"),
        this.incomeListFirebaseFormat
      );
      this.loadIncomeData();
      this.editingIncome = false;
    },
  },

  mounted() {
    this.loadIncomeData();
  },
});
</script>

<style scoped>
@import url("../assets/styles/income-section.css");
</style>