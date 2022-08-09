<template>
  <section class="expense-section">
    <div class="expense-section-top">
      <h3 class="title">EXPENSE SECTION</h3>
      <img
        src="../assets/images/edit-icon.png"
        key="1"
        v-show="!hoveringOverEditIcon && !editingExpense"
        alt="Edit icon"
        class="edit-icon"
        title="Edit icon by icons8"
        @mouseover="hoveringOverEditIcon = true"
        @click="editingExpense = !editingExpense"
      />
      <img
        src="../assets/images/edit-icon2.png"
        key="2"
        v-show="hoveringOverEditIcon || editingExpense"
        alt="Edit icon"
        class="edit-icon"
        title="Edit icon by icons8"
        @mouseleave="hoveringOverEditIcon = false"
        @click="editingExpense = !editingExpense"
      />
    </div>
    <div class="expenses-section_title">
      <h4 class="expenses-section_title_date">Date</h4>
      <h4 class="expenses-section_title_descr">Description</h4>
      <h4 class="expenses-section_title_type">Type</h4>
      <h4 class="expenses-section_title_amount">Amount</h4>
    </div>
    <div class="expenses-section_line"></div>

    <section class="expenses-wrapper">
      <!--List of expenses -->
      <TransitionGroup tag="div" name="expense-list">
        <article v-for="expense in expensesList" :key="expense.key">
        <div class="expense-item-wrapper">
          <Transition name="slide-in" tag="div">
            <img
              src="../assets/images/remove-icon.png"
              alt="Remove icon"
              class="remove-expense-btn"
              v-show="editingExpense"
              @click="removeExpense(expense)"
            />
          </Transition>
          <h4
            class="expenses-item-date"
            :class="{ 'editing-expense-item': editingExpense }"
          >
            {{ expense.dateAdded }}
          </h4>
          <h4 class="expenses-item-descr">{{ expense.expenseSource }}</h4>
          <h4 class="expenses-item-type">
            <div
              class="type-color-background"
              :class="`expenseType${expense.expenseType}`"
            ></div>
            {{ expense.expenseType }}
          </h4>
          <h4 class="expenses-item-amount">${{ expense.expenseAmount }}</h4>
        </div>
        <div class="expenses-section_line"></div>
      </article>
      </TransitionGroup>
    </section>
    
    <Transition name="slide-out" mode="out-in">
    <!-- ADD expenses section -->
    <section class="add-expense" v-if="!editingExpense">
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
        <!-- <input type="text" name="" id="input-expense"> -->
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
        <br />
        <input
          type="text"
          name=""
          id="input-expense"
          v-model.number="inputExpenseAmount"
        />
      </div>
      <button class="add-expenses-changes" @click="addExpenses">Add</button>
      <!-- v-else here -->
    </section>
      <button class="save-expenses-changes" v-else @click="saveExpensesChanges">Save</button>
      </Transition>
  </section>
</template>

<script>
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
      editingExpense: false,
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

    
    expenseListFirebaseFormat(){
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
    }
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
      const incomeDataRef = ref(db, "users/" + this.getUserID + "/expenses");
      let _this = this;
      onValue(incomeDataRef, (snapshot) => {
        this.expensesList = [];
        const data = snapshot.val();
        for (const key in data) {
          data[key].key = key;
          _this.expensesList.unshift(data[key]);
        }
      });
    },

    saveExpensesChanges(){
        const db = getDatabase();
      let _this = this;
      set(ref(db, "users/" + _this.getUserID + "/expenses"), _this.expenseListFirebaseFormat);
      this.loadExpenses();
       this.editingExpense = false;
    },

    removeExpense(expense){
       this.expensesList = this.expensesList.filter((data) => data.key !== expense.key);
      //  this.saveExpensesChanges()
    }
  },

  mounted() {
    this.loadExpenses();
  },
};
</script>

<style scoped>
@import url("../assets/styles/expenses-section.css");

@media (max-width: 960px){
.expenses-section_title_date{
  display: none
}

.expenses-item-date{
  display: none
}
};
</style>