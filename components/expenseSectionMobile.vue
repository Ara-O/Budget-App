<template>
  <section class="add-expense_mobile_wrapper">
    <section class="add-expense_mobile">
      <article class="add-expense">
        <div>
          <label for="input-expense">Source: </label>
          <br />
          <input
            type="text"
            name=""
            id="input-expense"
            v-model="inputExpenseSource"
          />
        </div>
        <div>
          <label for="input-expense">Type: </label>
          <br />
          <select
            name=""
            id="expense-type"
            class="expense-type"
            v-model="inputExpenseType"
          >
            <option value="Entertainment">Entertainment</option>
            <option value="Food">Food</option>
            <option value="College">College</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label for="input-expense">Amount: </label>
          <input
            type="text"
            name=""
            id="input-expense"
            v-model.number="inputExpenseAmount"
          />
        </div>
        <br />
        <button class="add-expense-btn" @click="addExpenses">
          <img src="~/assets/images/plus-icon.png" alt="Plus icon" />
        </button>
      </article>
    </section>
    <br /><br />
    <section class="expense_mobile_list">
      <br />
      <h3 class="expense_mobile_list_title">EXPENSE</h3>
      <article class="expense-section_mobile_header_title">
        <h4>From</h4>
        <h4>Amount</h4>
      </article>
      <div class="expense-section_line"></div>

      <!-- LIST EXPENSE SOURCES -->

      <!-- <TransitionGroup tag="div" name="expense-list" class="expense-list-wrapper"> -->
      <div v-for="(expense, index) in expensesList" :key="expense.key">
        <div class="expense-section_line"></div>
        <article class="expense-section_header">
            <!-- <div class="expense-item-wrapper"> -->
              <h4 class="expenses-item-descr">{{ expense.expenseSource }}</h4>
              <h4 class="expenses-item-amount">${{ expense.expenseAmount }}</h4>
            <!-- </div> -->
        </article>
          <div class="expense-section_line"></div>
      </div>

      <br /><br />
      <!-- </TransitionGroup> -->
    </section>
  </section>
</template>


<script lang="ts">
import { getDatabase, push, ref, set } from "@firebase/database";
import { onValue } from "@firebase/database";
import { mapGetters } from "vuex";
// import { set } from '@firebase/database';
export default {
  data() {
    return {
      inputExpenseSource: "",
      inputExpenseType: "",
      inputExpenseAmount: 0,
      expensesList: [],
      hoveringOverEditIcon: false,
    };
  },

  computed: {
    ...mapGetters(["getUserID"]),
    getDate() {
      let currentDate = new Date();
      let cDay = currentDate.getDate();
      let cMonth = currentDate.getMonth() + 1;
      let cYear = currentDate.getFullYear();
      return `${cDay}/${cMonth}/${cYear}`;
    },

    expenseListFirebaseFormat() {
      let firebaseFormat = {};

      let expensesList = this.expensesList.reverse();
      expensesList.forEach((data) => {
        firebaseFormat[data.key] = {
          expenseSource: data.expenseSource,
          expenseAmount: data.expenseAmount,
          expenseType: data.expenseType,
          dateAdded: data.dateAdded,
        };
      });

      return firebaseFormat;
    },
  },

  methods: {
    addExpenses() {
      const db = getDatabase();
      let _this = this;
      push(ref(db, "users/" + _this.getUserID + "/expenses/"), {
        expenseSource: _this.inputExpenseSource,
        expenseType: _this.inputExpenseType,
        expenseAmount: _this.inputExpenseAmount,
        dateAdded: _this.getDate,
      });

      this.loadExpenses();
    },

    loadExpenses() {
      const db = getDatabase();
      const expenseDataRef = ref(db, "users/" + this.getUserID + "/expenses");
      let _this = this;
      onValue(expenseDataRef, (snapshot) => {
        this.expensesList = [];
        const data = snapshot.val();
        for (const key in data) {
          data[key].key = key;
          _this.expensesList.unshift(data[key]);
        }
      });
    },

    saveExpensesChanges() {
      const db = getDatabase();
      let _this = this;
      set(
        ref(db, "users/" + _this.getUserID + "/expenses"),
        _this.expenseListFirebaseFormat
      );
      this.loadExpenses();
      this.editingExpense = false;
    },

    removeExpense(expense) {
      this.expensesList = this.expensesList.filter(
        (data) => data.key !== expense.key
      );
      //  this.saveExpensesChanges()
    },
  },

  mounted() {
    this.loadExpenses();
  },
};
</script>


<style>
@import url("../assets/styles/main.css");
@import url("../assets/styles/styles.css");
</style>
<style scoped>
.expense-type {
  border: 0px;
  border-bottom: solid 1px gray;
  width: 87px;
  font-size: 12px
}

.add-expense_mobile_wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 78vh;
}

.expense_mobile_list_title {
  text-align: center;
  font-weight: 500;
  font-size: 15px;
}

.expense-section_mobile_header_title {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.expense-section_mobile_header_title h4 {
  font-weight: 500;
}

.expense-section_line {
  height: 0.1px;
  background: lightgray;
}

.expense_mobile_list {
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

.add-expense_mobile {
  background-color: white;
  box-shadow: -1px 1px 1px #e3e3e3, 1px -1px 2px #e7e7e782;
  border-radius: 7px;
  width: 62vw;
  min-width: 410px;
  margin-top: 33px
}

.add-expense {
  height: 140px;
  display: flex;
  /* padding: 14px 0px 0px 0px; */
  column-gap: 16px;
  align-items: center;
  /* overflow: auto; */
  row-gap: 14px;
  flex-wrap: wrap;
  padding: 20px 11px;
  justify-content: center;
}

.add-expense div {
  margin-top: -8px;
}

.add-expense label {
  font-size: 12px;
}

.add-expense input {
  width: 70px;
  height: 21px;
  border-width: 0px;
  border-bottom-width: 1px;
  font-size: 12px;
}

.add-expense input:focus {
  outline: 0;
  border-width: 0px;
  border-bottom-width: 1px;
}

.add-expense-btn {
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
.add-expense-btn h4{
    font-weight: 500;
    font-family: 'Poppins';
} */

.add-expense-btn:hover {
  background-color: #468c5f;
  color: white;
}

.add-expense-btn:hover img {
  filter: brightness(3.5);
}

.add-expense-btn img {
  width: 15px;
}

article.expense-section_header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

article.expense-section_header h4 {
  font-weight: 400;
}

@media (max-width: 450px) {
  .add-expense_mobile,
  .expense_mobile_list {
    width: 330px;
    min-width: 330px;
  }
}
</style>