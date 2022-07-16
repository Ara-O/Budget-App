<template>
  <section class="bill-section">
    <div class="bill-section-top">
      <h3 class="title">BILLS</h3>
      <img
        src="../assets/images/edit-icon.png"
        key="1"
        v-show="!hoveringOverEditIcon && !editingBill"
        alt="Edit icon"
        class="edit-icon"
        title="Edit icon by icons8"
        @mouseover="hoveringOverEditIcon = true"
        @click="editingBill = !editingBill"
      />
      <img
        src="../assets/images/edit-icon2.png"
        key="2"
        v-show="hoveringOverEditIcon || editingBill"
        alt="Edit icon"
        class="edit-icon"
        title="Edit icon by icons8"
        @mouseleave="hoveringOverEditIcon = false"
        @click="editingBill = !editingBill"
      />
    </div>
    <article class="bill-section-title">
      <h4>Item</h4>
      <h4>Schedule</h4>
    </article>
    <div class="bill-section_line"></div>

    <!-- LIST BILLS -->

    <TransitionGroup tag="div" name="bill-list">
      <div v-for="(bill, index) in billList" :key="index"  class="bill-list-wrapper">
        <article class="bill-section_header">
          <Transition name="slide-in">
            <img
              src="../assets/images/remove-icon.png"
              alt="Remove icon"
              class="remove-bill-btn"
              v-show="editingBill"
              @click="removeBill(bill)"
            />
          </Transition>
          <h4 :class="{ 'editing-bill-item': editingBill }" class="bill-source">
            {{ bill.source }}
          </h4>
          <h4>
            ${{ bill.amount }}/{{ getBillFrequencySuffix(bill.frequency) }}
          </h4>
        </article>
        <div class="bill-section_line"></div>
      </div>
    </TransitionGroup>

    <!-- ADD BILL -->
    <!-- <article> -->
    <Transition name="bill-progress" mode="out-in">
      <section v-if="!editingBill" class="add-bill" >
        <Transition name="bill-progress" mode="out-in">
          <article class="add-bill" v-if="!billBasicsAdded" key="Basics">
            <div>
              <label for="bill-source">Source: </label>
              <br />
              <input type="text" id="bill-source" v-model="inputBillSource" />
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
            <button class="add-bill-btn" @click="progressBill">
              <img src="~/assets/images/plus-icon.png" alt="Plus icon" />
            </button>
          </article>
          <article v-else key="Frequency " class="add-bill">
            <div>
              <label for="bill-frequency">Frequency: </label>
              <br />
              <select
                name="billFrequency"
                id="bill-frequency"
                v-model="inputBillFrequency"
                class="bill-frequency"
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
              <button class="add-bill-btn add-bill"  @click="addBill" >
                <img src="~/assets/images/plus-icon.png" alt="Plus icon" />
              </button>
            </div>
          </article>
        </Transition>
      </section>
      <section v-else key="2" class="add-bill">
        <button class="save-bill-changes" @click="saveBillChanges">Save</button>
      </section>
    </Transition>
    <!-- </article> -->
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
      inputBillSource: "Test" as string,
      inputBillAmount: 40 as number,
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

    billListFirebaseFormat(){
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
    }
  },

  methods: {
    progressBill() {
      if (validateEntries(this.inputBillSource, this.inputBillAmount)) {
        this.billBasicsAdded = !this.billBasicsAdded;
      }
    },

    removeBill(bill) {
      console.log(bill);
      this.billList = this.billList.filter((data) => data.key !== bill.key);
    },

    saveBillChanges() {
      const db = getDatabase();
      let _this = this;
      set(ref(db, "users/" + _this.getUserID + "/bills"), _this.billListFirebaseFormat);
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
      console.log("Loading bill data");
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

<style scoped>
@import url("../assets/styles/bill-section.css");
</style>