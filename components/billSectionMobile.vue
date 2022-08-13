<template>
  <section class="add-bill_mobile_wrapper">
    <section class="add-bill_mobile">
      <!-- ADD BILL -->
      <!-- <article> -->
      <article class="add-bill" key="Basics">
        <div>
          <label for="bill-source">Source: </label>
          <br />
          <input
            type="text"
            id="bill-source input-bill"
            v-model="inputBillSource"
          />
        </div>
        <div>
          <label for="bill-amount">Amount: </label>
          <br />
          <input
            type="number"
            id="bill-amount"
            v-model="inputBillAmount"
            min="0"
          />
        </div>
        <div>
          <label for="bill-frequency">Frequency: </label>
          <br />
          <select
            name="billFrequency"
            id="bill-frequency"
            v-model="inputBillFrequency"
            class="bill-type"
          >
            <option value="One time">One time</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Bi-Monthly">Bi-Monthly</option>
            <option value="Yearly">Yearly</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <button class="add-bill-btn" @click="addBill">
            <img src="~/assets/images/plus-icon.png" alt="Plus icon" />
          </button>
        </div>
      </article>
    </section>
    <!-- LIST BILLS -->
    <br /><br />
    <section class="bill_mobile_list">
      <br />
      <h3 class="bill_mobile_list_title">BILLS</h3>

      <article class="bill-section_mobile_header_title">
        <h4>Item</h4>
        <h4>Schedule</h4>
      </article>
      <div class="bill-section_line"></div>

      <div
        v-for="(bill, index) in billList"
        :key="index"
        class="bill-list-wrapper"
      >
        <article class="bill-section_header">
          <h4 class="bills-item-descr">
            {{ bill.source }}
          </h4>
          <h4 class="bills-item-amount">
            ${{ bill.amount }}/{{ getBillFrequencySuffix(bill.frequency) }}
          </h4>
        </article>
        <div class="bill-section_line"></div>
      </div>

      <!-- </article> -->
    </section>
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
      hoveringOverEditIcon: false,
      editingBill: false,
      billList: [],
      inputBillSource: "" as string,
      inputBillAmount: 0 as number,
      inputBillFrequency: "" as string,
      billBasicsAdded: false as boolean,
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

    billListFirebaseFormat() {
      let firebaseFormat = {};

      let billList = this.billList.reverse();
      billList.forEach((data) => {
        firebaseFormat[data.key] = {
          source: data.source,
          amount: data.amount,
          frequency: data.frequency,
          dateAdded: data.dateAdded,
        };
      });

      return firebaseFormat;
    },
  },

  methods: {
    progressBill() {
      if (validateEntries(this.inputBillSource, this.inputBillAmount)) {
        this.billBasicsAdded = !this.billBasicsAdded;
      }
    },

    removeBill(bill) {
      this.billList = this.billList.filter((data) => data.key !== bill.key);
    },

    saveBillChanges() {
      const db = getDatabase();
      let _this = this;
      set(
        ref(db, "users/" + _this.getUserID + "/bills"),
        _this.billListFirebaseFormat
      );
      this.loadBillData();
      this.editingBill = false;
    },

    getBillFrequencySuffix(billFreq) {
      let billFrequencySuffix: string;
      switch (billFreq) {
        case "One time":
          billFrequencySuffix = "once";
          break;
        case "Weekly":
          billFrequencySuffix = "wk";
          break;
        case "Bi-Weekly":
          billFrequencySuffix = "2wk";
          break;
        case "Monthly":
          billFrequencySuffix = "m";
          break;
        case "Bi-Monthly":
          billFrequencySuffix = "2m";
          break;
        case "Yearly":
          billFrequencySuffix = "yr";
          break;
        default:
          billFrequencySuffix = "x";
          break;
      }

      return billFrequencySuffix;
    },

    addBill() {
      if (validateEntries(this.inputBillFrequency)) {
        let _this = this;
        const db = getDatabase();
        push(ref(db, "users/" + _this.getUserID + "/bills"), {
          source: this.inputBillSource,
          amount: Number(this.inputBillAmount),
          frequency: this.inputBillFrequency,
          dateAdded: this.getDate,
        });
        this.inputBillAmount = 0;
        this.inputBillSource = this.inputBillFrequency = "";

        this.billBasicsAdded = false;
        this.loadBillData();
      }
    },

    loadBillData() {
      const db = getDatabase();
      const billDataRef = ref(db, "users/" + this.getUserID + "/bills");
      let _this = this;
      onValue(billDataRef, (snapshot) => {
        this.billList = [];
        const data = snapshot.val();
        for (const key in data) {
          data[key].key = key;
          _this.billList.unshift(data[key]);
        }
      });
    },
  },

  mounted() {
    this.loadBillData();
  },
});
</script>

<style>
@import url("../assets/styles/main.css");
@import url("../assets/styles/styles.css");
</style>
<style scoped>
.bill-type {
  border: 0px;
  border-bottom: solid 1px gray;
  width: 87px;
  font-size: 12px;
}
.add-bill_mobile_wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 78vh;
}

.bill_mobile_list_title {
  text-align: center;
  font-weight: 500;
  font-size: 15px;
}

.bill-section_mobile_header_title {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.bill-section_mobile_header_title h4 {
  font-weight: 500;
}

.bill-section_line {
  height: 0.1px;
  background: lightgray;
}

.bill_mobile_list {
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

.add-bill_mobile {
  background-color: white;
  box-shadow: -1px 1px 1px #e3e3e3, 1px -1px 2px #e7e7e782;
  border-radius: 7px;
  width: 62vw;
  min-width: 410px;
  margin-top: 33px;
}

.add-bill {
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

.add-bill div {
  margin-top: -8px;
}

.add-bill label {
  font-size: 12px;
}

.add-bill input {
  width: 70px;
  height: 21px;
  border-width: 0px;
  border-bottom-width: 1px;
  font-size: 12px;
}

.add-bill input:focus {
  outline: 0;
  border-width: 0px;
  border-bottom-width: 1px;
}

.add-bill-btn {
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
.add-bill-btn h4{
    font-weight: 500;
    font-family: 'Poppins';
} */

.add-bill-btn:hover {
  background-color: #468c5f;
  color: white;
}

.add-bill-btn:hover img {
  filter: brightness(3.5);
}

.add-bill-btn img {
  width: 15px;
}

article.bill-section_header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

article.bill-section_header h4 {
  font-weight: 400;
}

@media (max-width: 450px) {
  .add-bill_mobile,
  .bill_mobile_list {
    width: 330px;
    min-width: 330px;
  }
}
</style>