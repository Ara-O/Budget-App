<template>
  <section class="graph-section">
    <section class="graph-section-wrapper">
      <!-- Let this be custom component --- -->
      <Transition name="fade-in" mode="out-in">
        <component :is="visibleData"></component>
      </Transition>
      <!-- ----------- -->
      <section class="total-data-section">
        <div class="total-income" v-if="visibleData === 'income'">
          <h4>TOTAL INCOME</h4>
          <h3>${{ totalIncome }}</h3>
        </div>
        <div class="total-income" v-if="visibleData === 'bills'">
          <h4>TOTAL BILLS</h4>
          <h3>${{ totalBills }}</h3>
        </div>
        <div class="total-income" v-if="visibleData === 'expenses'">
          <h4>TOTAL EXPENSES</h4>
          <h3>${{ totalExpenses }}</h3>
        </div>
        <!-- Make tital expenses -->
        <div class="total-income" v-if="visibleData === 'combined'">
          <h4>NET INCOME</h4>
          <!-- Make tital expenses -->
          <h3>${{ netEarnings }}</h3>
        </div>
        <div class="all-available-data">
          <div
            class="available-data-button"
            @click="visibleData = 'income'"
            :class="{ selected: visibleData === 'income' }"
          >
            <h4>Income</h4>
          </div>
          <div
            class="available-data-button"
            @click="visibleData = 'bills'"
            :class="{ selected: visibleData === 'bills' }"
          >
            <h4>Bills</h4>
          </div>
          <div
            class="available-data-button"
            @click="visibleData = 'expenses'"
            :class="{ selected: visibleData === 'expenses' }"
          >
            <h4>Expenses</h4>
          </div>
          <div
            class="available-data-button"
            @click="visibleData = 'combined'"
            :class="{ selected: visibleData === 'combined' }"
          >
            <h4>Combined</h4>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
//lazy loading component
const income = () => import("./incomeGraph.vue");
const bills = () => import("./billGraph.vue");
const expenses = () => import("./expensesGraph.vue");
const combined = () => import("./combinedGraph.vue");
import { getDatabase, ref, onValue } from "firebase/database";
import { mapGetters } from "vuex";
export default {
  components: {
    income,
    bills,
    expenses,
    combined,
  },
  data() {
    return {
      visibleData: "combined",
      totalIncome: 0,
      totalBills: 0,
      totalExpenses: 0,
      netEarnings: 0,
    };
  },

  computed: {
    ...mapGetters(["getUserID"]),
  },

  methods: {
    calculateTotalIncome() {
      const db = getDatabase();
      const totalIncomeRef = ref(db, "users/" + this.getUserID + "/income");

      //Retrieve total income and add all of it
      onValue(totalIncomeRef, (snapshot) => {
        let total = 0;
        let data = snapshot.val();
        for (const key in data) {
          total += Number(data[key].incomeAmount);
        }

        this.totalIncome = total;
      });
    },

    calculateTotalBills() {
      const db = getDatabase();
      const totalBillsRef = ref(db, "users/" + this.getUserID + "/bills");

      //Retrieve total income and add all of it
      onValue(totalBillsRef, (snapshot) => {
        let total = 0;
        let data = snapshot.val();
        for (const key in data) {
          total += Number(data[key].amount);
        }

        this.totalBills = total;
      });
    },

    calculateTotalExpenes() {
      const db = getDatabase();
      const expensesRef = ref(db, "users/" + this.getUserID + "/expenses");

      //Retrieve total income and add all of it
      onValue(expensesRef, (snapshot) => {
        let total = 0;
        let data = snapshot.val();
        for (const key in data) {
          total += Number(data[key].expenseAmount);
        }
        this.totalExpenses = total;
      });
    },
    calculateNetIncome() {
      const db = getDatabase();
      const dataRef = ref(db, "users/" + this.getUserID);
      let _this = this;
      onValue(dataRef, (snapshot) => {
        _this.netEarnings = 0;
        let data = snapshot.val();
        for (const key in data) {
          if (key === "expenses") {
            for (const key2 in data[key]) {
              _this.netEarnings -= data[key][key2].expenseAmount;
            }
          }
          if (key === "income") {
            for (const key2 in data[key]) {
              _this.netEarnings += data[key][key2].incomeAmount;
            }
          }
        }
      });
    },
  },
  mounted() {
    this.calculateTotalIncome();
    this.calculateTotalBills();
    this.calculateTotalExpenes();
    this.calculateNetIncome();
  },
};
</script>


<style scoped>
.graph-section-wrapper {
  display: flex;
  align-items: flex-start;
  height: 100%;
  border-radius: 7px;
  column-gap: 14px;
}

.graph-section {
  flex: 5;

  height: 100%;
}

.total-data-section {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.total-income {
  background-color: #468c5f;
  margin-top: 8px;
  width: 155px;
  font-size: 11px;
  height: 99px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  box-sizing: border-box;
  color: white;
  padding-left: 24px;
  justify-content: center;
}

.total-income h3,
.total-income h4 {
  font-weight: 300;
}

.total-income h3 {
  margin-top: 0px;
  font-size: 16px;
  font-weight: 400;
}

.available-data-button {
  border: solid 2px #468c5f;
  display: inline-block;
  padding: 0px 15px;
  color: #468c5f;
  border-radius: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.5s ease;
}

.available-data-button:hover {
  color: white;
  background-color: #468c5f;
}

.selected {
  color: white;
  background-color: #468c5f;
}

.available-data-button h4 {
  margin-top: 8.5px;
  font-weight: 300;
}

.all-available-data {
  display: flex;
  flex-wrap: wrap;
  grid-column-gap: 8px;
  -moz-column-gap: 8px;
  column-gap: 8px;
  grid-row-gap: 13px;
  row-gap: 13px;
  width: 161px;
}

/* we will explain what these classes do next! */
.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.5s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}
</style>