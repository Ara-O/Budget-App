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
        <div class="all-available-data">
          <div class="available-data-button" @click="visibleData = 'income'" :class="{selected: visibleData === 'income'}">
            <h4>Income</h4>
          </div>
          <div class="available-data-button" @click="visibleData = 'bills'" :class="{selected: visibleData === 'bills'}">
            <h4>Bills</h4>
          </div>
          <div class="available-data-button" @click="visibleData = 'expenses'" :class="{selected: visibleData === 'expenses'}">
            <h4>Expenses</h4>
          </div>
          <div class="available-data-button" @click="visibleData = 'net'" :class="{selected: visibleData === 'net'}">
            <h4>Net</h4>
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
import { getDatabase, ref, onValue } from "firebase/database";
import { mapGetters } from "vuex";
export default {
  components: {
    income,
    bills
  },
  data() {
    return {
      visibleData: "bills",
      totalIncome: 0,
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

        console.log('this is the total - ', total)
        this.totalIncome = total;
      });
    },
  },

  mounted() {
    this.calculateTotalIncome();
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

.selected{
  color: white;
  background-color: #468c5f;
}

.available-data-button h4 {
  margin-top: 8.5px;
  font-weight: 400;
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