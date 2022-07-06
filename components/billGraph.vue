<template>
  <div style="width: 950px; height: 43vh">
    <canvas id="myChartPie" width="400" height="400"></canvas>
  </div>
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
      graphBgColor: []
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
      });
    },

    generateGraphData() {
      this.graphData = [];
      this.graphLabels = [];
      for (const key in this.billData) {
        this.graphLabels.push(this.billData[key].source);
        this.graphData.push(Number(this.billData[key].amount));
        this.graphBgColor.push( `rgb(70, 140, 95, ${Math.random() * 1})`)
      }

      this.myChart?.destroy();
      this.loadGraph()
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
          maintainAspectRatio: false,
        },
      });
    },
  },

  mounted() {
          this.retrieveBillData();
  },
};
</script>