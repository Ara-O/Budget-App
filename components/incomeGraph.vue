<template>
  <div style="width: 100%; height: 43vh">
    <canvas id="myChart" width="400" height="400"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { mapGetters } from "vuex";
import { getDatabase, ref, onValue } from "firebase/database";
Chart.register(...registerables);
export default {
  data() {
    return {
      incomeData: {},
      graphLabels: [],
      graphLabelsReadable: [],
      graphData: [],
    };
  },

  computed: {
    ...mapGetters(["getUserID"]),
  },

  methods: {
    retrieveIncomeData() {
      const db = getDatabase();
      const incomeDataRef = ref(db, "users/" + this.getUserID + "/income");
      let _this = this;
      onValue(incomeDataRef, (snapshot) => {
        console.log("loading income data for graph");
        _this.incomeData = snapshot.val();
        _this.generateGraphData();
      });
    },

    generateGraphData() {
      this.graphData = [];
      this.graphLabels = [];
      for (const key in this.incomeData) {
        this.graphLabels.push(this.incomeData[key].dateAdded);
        this.graphData.push(Number(this.incomeData[key].incomeAmount));
      }

      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];

      //format the graph labels
      this.graphLabels.forEach((date, index) => {
        let dateMonth = date.split("/")[1];
        let dateNumber = date.split("/")[0];
        let dateMonthAltered = "";
        let graphLabelAltered = "";
        dateMonthAltered = months[dateMonth - 1];
        graphLabelAltered = `${dateMonthAltered} ${dateNumber}`;
        this.graphLabels[index] = graphLabelAltered;
      });

      //destroy the current chart if one already exists, then load the graph
      this.myChart?.destroy();
      this.loadGraph();
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
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        },
        options: {
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                return data.labels[tooltipItem.index];
              },
            },
          },
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
    this.retrieveIncomeData();
  },
};
</script>