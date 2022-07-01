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
  
  computed: {
    ...mapGetters(['getUserID'])
  },
  methods: {
    loadTotalData(){
      const db = getDatabase();
      const incomeDataRef = ref(db, "users/" + this.getUserID + "/income");
      onValue(incomeDataRef, (snapshot) => {
        console.log(snapshot.val())
      });
    },
    loadGraph() {
      Chart.defaults.font.size = 11;
      Chart.defaults.color = "rgb(0, 0, 0)";
      Chart.defaults.font.weight = "400";
      Chart.defaults.font.family = "Poppins";
      const ctx = document.getElementById("myChart");
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: [
            "08/04/2022",
            "08/04/2022",
            "08/05/2022",
            "08/06/2022",
            "08/06/2022",
            "08/07/2022",
          ],
          datasets: [
            {
              label: "Total income Over Time",
              // For the data, use the total user income as they add a data.
              data: [12, 3, 5, 2, 3, 0],
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
    },
  },
  mounted() {
    this.loadTotalData()
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