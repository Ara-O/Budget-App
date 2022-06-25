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
          <input type="number" id="income-amount" v-model="inputIncomeAmount" />
        </div>
        <button class="add-income-btn" @click="addIncome">
          <img src="~/assets/images/plus-icon.png" alt="Plus icon" />
        </button>
      </article>
      <div v-else>
        <button class="save-income-changes" @click="saveIncomeChanges">Save</button>
      </div>
    </Transition>
  </section>
</template>

<script lang="ts">
import { validateEntries } from "../modules/utilities";
import { getDatabase, ref, push, onValue, set } from "firebase/database";
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
    incomeListArranged(){
      let incomeListAscending = [];
      this.incomeList.forEach((data)=> {
        incomeListAscending.unshift(data)
      })
      console.log(incomeListAscending)
      return incomeListAscending;
    }
  },

  methods: {
    addIncome() {
      if (validateEntries(this.inputIncomeSource, this.inputIncomeSource)) {
        console.log("successful yay!");
        let _this = this;
        const db = getDatabase();
        push(ref(db, "users/" + _this.getUserID + "/income"), {
          incomeSource: _this.inputIncomeSource,
          incomeAmount: _this.inputIncomeAmount,
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
      this.incomeList = [];
      onValue(incomeDataRef, (snapshot) => {
        const data = snapshot.val();
        for (const key in data) {
          data[key].key = key;
          _this.incomeList.unshift(data[key]);
        }
      });
    },

    removeIncome(income) {
      console.log(income);
      this.incomeList = this.incomeList.filter(
        (data) => data.key !== income.key
      );
    },

    saveIncomeChanges(){
      const db = getDatabase();
      let _this = this;
      set(ref(db, "users/" + _this.getUserID + "/income"), _this.incomeListArranged);
      this.loadIncomeData();
      this.editingIncome = false;
    }
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
  align-items: center;
  position: relative
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
  padding: 14px 0px 0px 0px;
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

.edit-icon {
  width: 20px;
  cursor: pointer;
}

.income-section_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slide-in-leave-active,
.slide-in-enter-active {
  transition: all 0.5s ease;
}

.slide-in-enter,
.slide-in-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-out-leave-active,
.slide-out-enter-active {
  transition: all 0.5s ease;
}

.slide-out-enter,
.slide-out-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.income-list-enter-active,
.income-list-leave-active,
.income-list-move {
  transition: all 0.5s ease;
}
.income-list-enter-from,
.income-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.remove-income-btn {
  width: 12px;
  cursor: pointer;
  position: absolute;
}

.editing-income-transform {
  transform: translateX(50px);
}

.income-source {
  transition: all 0.6s ease;
}

.save-income-changes {
  margin-left: 163.5px;
    margin-top: 24px;
    background: #42865a;
    height: 33px;
    color: white;
    width: 70px;
    border: 0px;
    border-radius: 5px;
    font-family: 'Poppins';
    font-size: 12px;
    box-shadow: 0px 0px 2px lightgrey;
    cursor: pointer
}

.income-list-wrapper {
  overflow: auto;
  height: 152px;
}

.income-list-wrapper::-webkit-scrollbar {
  display: none;
}
</style>