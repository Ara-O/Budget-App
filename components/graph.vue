<template>
  <section class="graph-section">
    <div style="width: 750px">
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
    <div class="total-data-section"></div>
  </section>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { mapGetters } from "vuex";
import { getDatabase, ref,  onValue } from "firebase/database";
Chart.register(...registerables);
export default {
  data(){
    return {
      incomeData: {},
      graphLabels: [],
      graphData: []
    }    
  },
  computed: {
    ...mapGetters(['getUserID'])
  },
  methods: {
    retrieveIncomeData(){
      const db = getDatabase();
      const incomeDataRef = ref(db, "users/" + this.getUserID + "/income");
      let _this = this;
      onValue(incomeDataRef, (snapshot) => {
        console.log("loading income data for graph")
        _this.incomeData = snapshot.val();
        _this.generateGraphData()
      });
    },

    generateGraphData(){
      this.graphData = [];
      this.graphLabels = [];
      for(const key in this.incomeData){
        this.graphLabels.push(this.incomeData[key].dateAdded)
        this.graphData.push(Number(this.incomeData[key].incomeAmount))
      }

      this.myChart?.destroy()
      this.loadGraph()
    },

    loadGraph() {
      Chart.defaults.font.size = 11;
      Chart.defaults.color = "rgb(0, 0, 0)";
      Chart.defaults.font.weight = "400";
      Chart.defaults.font.family = "Poppins";
      const ctx = document.getElementById("myChart");
      let _this = this;
      this.myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: _this.graphLabels,
          datasets: [
            {
              label: "Total income Over Time",
              // For the data, use the total user income as they add a data.
              data: _this.graphData,
              // Randomize color
              backgroundColor: ["#468c5f"],
              borderColor: ["#468c5f"],
              borderJoinStyle: "round",
              borderWidth: 3,
              tension: 0.3,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              suggestedMin: 0,
              suggestedMax: 30,
              beginAtZero: true,
              grid: {
                tickLength: 15,
              },
            },
            x: {
              grid: {
                tickLength: 15,
                tickWidth: 15,
                color: "rgb(255,255,255)",
              },
            },
          },
        },
      });

      // myChart.destroy();
    },
  },
  mounted() {
    this.retrieveIncomeData()
  },
};
</script>


<style scoped>
canvas {
  height: 326px !important;
}
.graph-section {
  background: white;
  display: inline-block;
  height: 100%;
  border-radius: 7px;
  box-shadow: -1px 1px 1px #e3e3e3, 1px -1px 2px #e7e7e782;
  padding: 10px 24px;
}

.graph-section {
  height: 100%;
  flex: 5;
}

.total-data-section {
  display: flex;
}
</style>