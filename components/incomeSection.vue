<template>
  <section class="income-section">
    <h3 class="title">INCOME</h3>
    <article class="income-section_header_title">
      <h4>From</h4>
      <h4>Amount</h4>
    </article>
    <div class="income-section_line"></div>
    <div>
      <article class="income-section_header">
        <h4>Salary</h4>
        <h4>$500</h4>
      </article>
      <div class="income-section_line"></div>
    </div>
    <div>
      <article class="add-income">
        <div>
          <label for="income-source">From: </label>
          <br />
          <input type="text" class="income-source" v-model="incomeSource" />
        </div>
        <div>
          <label for="income-amount">Amount: </label>
          <br />
          <input type="number" id="income-amount" v-model="incomeAmount"/>
        </div>
        <button class="add-income-btn" @click="addIncome">
          <img src="~/assets/images/plus-icon.png" alt="Plus icon" />
          Add
        </button>
      </article>
    </div>
  </section>
</template>

<script lang="ts">
import {validateEntries} from "../modules/utilities"
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      incomeSource: "Bob gave me money",
      incomeAmount: 500
    };
  },

  methods: {
    addIncome(){
      if(validateEntries(this.incomeSource, this.incomeAmount)){
        console.log("successful yay!")
      } else {
        console.log("Unsuccessful yay")
      }
    }
  }
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
  height: 1px;
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
  width: 69px;
  border-color: #468c5f;
  border-style: solid;
  border-width: 2.5px;
  font-weight: 500;
  color: #468c5f;
  column-gap: 4px;
  justify-content: center;
  border-radius: 6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 250ms linear, color 250ms linear;
}
.add-income-btn:hover {
  background-color: #468c5f;
  color: white;
}

.add-income-btn:hover img {
  filter: brightness(3.5);
}

.add-income-btn img {
  width: 14px;
}
</style>