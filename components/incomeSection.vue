<template>
  <section class="income-section">
    <h3 class="title">INCOME</h3>
    <article class="income-section_header_title">
      <h4>From</h4>
      <h4>Amount</h4>
    </article>
    <div class="income-section_line"></div>
    <div v-for="income in incomeList" :key="income">
      <article class="income-section_header" >
        <h4>{{ income.incomeSource }}</h4>
        <h4>{{ income.incomeAmount }}</h4>
      </article>
      <div class="income-section_line"></div>
    </div>
    <div>
      <article class="add-income">
        <div>
          <label for="income-source">From: </label>
          <br />
          <input type="text" id="income-source" v-model="incomeSource" />
        </div>
        <div>
          <label for="income-amount">Amount: </label>
          <br />
          <input type="number" id="income-amount" v-model="incomeAmount" />
        </div>
        <button class="add-income-btn" @click="addIncome">
          <img src="~/assets/images/plus-icon.png" alt="Plus icon" />
        </button>
      </article>
    </div>
  </section>
</template>

<script lang="ts">
import { validateEntries } from "../modules/utilities";
import { getDatabase, ref, push, onValue } from "firebase/database";
import Vue from "vue";
import { mapGetters } from "vuex";
export default Vue.extend({
  data() {
    return {
      incomeList: [],
      incomeSource: "" as string,
      incomeAmount: 0 as number,
    };
  },

  computed: {
    ...mapGetters(["getUserID"]),
  },

  methods: {
    addIncome() {
      if (validateEntries(this.incomeSource, this.incomeAmount)) {
        console.log("successful yay!");
        let _this = this;
        const db = getDatabase();
        push(ref(db, "users/" + _this.getUserID + "/income"), {
          incomeSource: _this.incomeSource,
          incomeAmount: _this.incomeAmount,
        });
      } else {
        // !Handle inccomplete input
        console.log("Unsuccessful yay");
      }
    },

    loadIncomeData() {
      const db = getDatabase();
      const incomeDataRef = ref(db, "users/" + this.getUserID + "/income");
      let _this = this;
      onValue(incomeDataRef, (snapshot) => {
        const data = snapshot.val();
        for (const key in data) {
          _this.incomeList.push(data[key]);
        }
      });
    },
  },

  mounted() {
    this.loadIncomeData();
  },
});
</script>

<style scoped>
.income-section_header,
.income-section_header_title {
  display: flex;
  justify-content: space-between;
}

.income-section_header h4 {
  font-weight: 400;
  font-size: 12px;
}

.income-section_header_title h4 {
  font-weight: 500;
  font-size: 12px;
}
.income-section_line {
  height: 0.5px;
  background: lightgray;
}

.add-income {
  display: flex;
  padding: 27px 0px 0px 0px;
  column-gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.add-income label {
  font-size: 12px;
}

.add-income input {
  width: 80px;
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

.title {
  font-weight: 500;
}

#income-source,
#income-amount {
  font-family: "Poppins";
}
</style>