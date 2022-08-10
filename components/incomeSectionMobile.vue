<template>
  <section class="add-income_mobile_wrapper">
    <section class="add-income_mobile">
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
    </section>
    <br /><br />
    <section class="income_mobile_list">
      <br />
      <h3 class="income_mobile_list_title">INCOME</h3>
      <article class="income-section_mobile_header_title">
        <h4>From</h4>
        <h4>Amount</h4>
      </article>

      <!-- LIST INCOME SOURCES -->

      <!-- <TransitionGroup tag="div" name="income-list" class="income-list-wrapper"> -->
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
          <h4>${{ income.incomeAmount }}</h4>
        </article>
      </div>
      <br /><br />
      <!-- </TransitionGroup> -->
    </section>
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
      inputIncomeSource: "" as string,
      inputIncomeAmount: 0 as number,
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
        let _this = this;
        const db = getDatabase();
        push(ref(db, "users/" + _this.getUserID + "/income"), {
          incomeSource: _this.inputIncomeSource,
          incomeAmount: Number(_this.inputIncomeAmount),
          dateAdded: this.getDate,
        });
        this.loadIncomeData();
      } else {
        // !Handle inccomplete input
      }
    },

    loadIncomeData() {
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


<style>
@import url("../assets/styles/main.css");
@import url("../assets/styles/styles.css");
</style>
<style scoped>
.add-income_mobile_wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 78vh;
}

.income_mobile_list_title {
  text-align: center;
  font-weight: 500;
  font-size: 15px;
}

.income-section_mobile_header_title {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.income-section_mobile_header_title h4 {
  font-weight: 500;
}
.income_mobile_list {
  width: 62vw;
  min-width: 410px;
  background: white;
  box-shadow: -1px 1px 1px #e3e3e3, 1px -1px 2px rgb(231 231 231 / 51%);
  border-radius: 7px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 0px 7vw;
}

.add-income_mobile {
  background-color: white;
  box-shadow: -1px 1px 1px #e3e3e3, 1px -1px 2px #e7e7e782;
  border-radius: 7px;
  width: 62vw;
  min-width: 410px;
}

.add-income {
  height: 96px;
  display: flex;
  /* padding: 14px 0px 0px 0px; */
  grid-column-gap: 16px;
  column-gap: 16px;
  align-items: center;
  justify-content: space-evenly;
}

.add-income div {
  margin-top: -8px;
}

.add-income label {
  font-size: 12px;
}

.add-income input {
  width: 70px;
  height: 21px;
  border-width: 0px;
  border-bottom-width: 1px;
  font-size: 12px;
}

.add-income input:focus {
  outline: 0;
  border-width: 0px;
  border-bottom-width: 1px;
}

.add-income-btn {
  background-color: white;
  height: 31px;
  width: 34px;
  border-color: #468c5f;
  border-style: solid;
  border-width: 2.5px;
  font-weight: 500;
  color: #468c5f;
  justify-content: center;
  border-radius: 6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 250ms linear, color 250ms linear;
}
/* 
.add-income-btn h4{
    font-weight: 500;
    font-family: 'Poppins';
} */

.add-income-btn:hover {
  background-color: #468c5f;
  color: white;
}

.add-income-btn:hover img {
  filter: brightness(3.5);
}

.add-income-btn img {
  width: 15px;
}

article.income-section_header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

article.income-section_header h4 {
  font-weight: 400;
}

@media (max-width: 450px) {
    .add-income_mobile, .income_mobile_list{
        width: 330px;
        min-width: 330px;
    }
}
</style>