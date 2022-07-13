<template>
  <section class="bill-graph-section-items">
    <section class="bill-graph-section-items_block_wrappper">
      <div class="bill-graph-section-items_block">
        <h4>Weekly</h4>
        <h5>${{this.billFrequency.weekly}}</h5>
        
      </div>
      <div class="bill-graph-section-items_block">
        <h4>Bi-Weekly</h4>
        <h5>${{this.billFrequency.biweekly}}</h5>
      </div>
    </section>
    <div style="width: 300; height: 43vh">
      <canvas id="myChartPie" width="300" height="400"></canvas>
    </div>
    <section class="bill-graph-section-items_block_wrappper">
      <div class="bill-graph-section-items_block">
        <h4>Bi-Monthly</h4>
        <h5>${{this.billFrequency.bimonthly}}</h5>
      </div>
      <div class="bill-graph-section-items_block">
        <h4>Monthly</h4>
        <h5>${{this.billFrequency.monthly}}</h5>
      </div>
    </section>
  </section>
</template>

<script>
import { getDatabase, ref, onValue } from "firebase/database";
import { Chart, registerables } from "chart.js";
import { mapGetters } from "vuex";
Chart.register(...registerables);
export default {
  data() {
    return {
      billData: {},
      graphLabels: [],
      graphLabelsReadable: [],
      graphData: [],
      graphBgColor: [],
      billFrequency: 
        {
          weekly: 0,
          biweekly: 0,
          monthly: 0,
          bimonthly: 0,
        },
    };
  },

  computed: {
    ...mapGetters(["getUserID"]),
  },

  methods: {

    retrieveBillData() {
      const db = getDatabase();
      const billDataRef = ref(db, "users/" + this.getUserID + "/bills");
      let _this = this;
      onValue(billDataRef, (snapshot) => {
        console.log("loading bill data for graph");
        _this.billData = snapshot.val();
        _this.generateGraphData();
        _this.calculateBillFrequency()
      });
    },

    generateGraphData() {
      this.graphData = [];
      this.graphLabels = [];
      for (const key in this.billData) {
        this.graphLabels.push(this.billData[key].source);
        this.graphData.push(Number(this.billData[key].amount));
        this.graphBgColor.push(`rgb(70, 140, 95, ${Math.random() * 1 + 0.2})`);
      }

      this.myChart?.destroy();
      this.loadGraph();
    },

    loadGraph() {
      Chart.defaults.font.size = 11;
      Chart.defaults.color = "rgb(0, 0, 0)";
      Chart.defaults.font.weight = "400";
      Chart.defaults.font.family = "Poppins";
      const ctx = document.getElementById("myChartPie");
      let _this = this;

      const data = {
        // Get all data from bills
        labels: _this.graphLabels,
        datasets: [
          {
            label: "Graph of Bills",
            data: _this.graphData,
            backgroundColor: _this.graphBgColor,
            hoverOffset: 4,
          },
        ],
      };

      this.myChart = new Chart(ctx, {
        type: "pie",
        data: data,
        options: {
          // legend: {
          //   display: false
          // },
          maintainAspectRatio: false,
        },
      });
    },

    calculateBillFrequency(){
      console.log(this.billData)
      for(const key in this.billData){
        console.log(this.billData[key].frequency)
        console.log(this.billData[key].amount)
         if(this.billData[key].frequency === "Weekly"){
          this.billFrequency.weekly += this.billData[key].amount
         }
         if(this.billData[key].frequency === "Bi-Weekly"){
          this.billFrequency.biweekly += this.billData[key].amount
         }
         if(this.billData[key].frequency === "Bi-Monthly"){
          this.billFrequency.bimonthly += this.billData[key].amount
         }
         if(this.billData[key].frequency === "Monthly"){
          console.log('yas')
          this.billFrequency.monthly += this.billData[key].amount
         }
      }
    console.log(this.billFrequency)
    }
  },

  mounted() {
    this.retrieveBillData();
  },
};
</script>

<style scoped>
.bill-graph-section-items {
  display: flex;
  grid-column-gap: 33px;
  -moz-column-gap: 33px;
  column-gap: 33px;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.bill-graph-section-items_block {
  height: 117px;
  width: 159px;
  background: pink;
  border-radius: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: -1px 1px 1px #e3e3e3, 1px -1px 2px rgb(231 231 231 / 51%);
  flex-direction: column;
  margin-top: 9px;
}

.bill-graph-section-items_block h5{
  margin-top: 0px;
  font-weight: 300;
  font-size:13px
}
.bill-graph-section-items_block h4{
  font-weight: 400;
  font-size: 13px
}

.bill-graph-section-items_block_wrappper {
  width: 173px;
  flex-wrap: wrap;

  display: flex;
  justify-content: center;
  column-gap: 19px;
  align-items: center;
}
</style>