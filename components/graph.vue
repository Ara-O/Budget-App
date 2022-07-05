<template>
  <section class="graph-section">
    <section class="graph-section-wrapper">
      <div style="width: 950px; height: 43vh">
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>
      <section class="total-data-section">
        <div class="total-income">
          <h4>TOTAL INCOME</h4>
          <h3>${{ totalIncome }}</h3>
        </div>
        <div class="all-available-data">
          <div class="available-data-button">
            <h4>Income</h4>
          </div>
            <div class="available-data-button">
              <h4>Bills</h4>
            </div>
          <div class="available-data-button">
            <h4>Expenses</h4>
          </div>
          <div class="available-data-button">
            <h4>Total</h4>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
//Chart js - bills data
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
      totalIncome: 0,
    };
  },

  computed: {
    ...mapGetters(["getUserID"]),
  },

  methods: {
    calculateTotalIncome() {
      const db = getDatabase();
      const totalIncomeRef = ref(db, "users/" + this.getUserID + "/income");
      let total = 0;

      //Retrieve total income and add all of it
      onValue(totalIncomeRef, (snapshot) => {
        let data = snapshot.val();
        for (const key in data) {
          total += Number(data[key].incomeAmount);
        }
        this.totalIncome = total;
      });
    },

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
    this.calculateTotalIncome();
  },
};
</script>


<style scoped>
.graph-section-wrapper {
  display: flex;
  align-items: flex-start;
  height: 100%;
  border-radius: 7px;
  column-gap: 14px
}

.graph-section {
  flex: 5;

  height: 100%;
}

.total-data-section {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.total-income {
  background-color: #468c5f;
  margin-top: 8px;
  width: 155px;
  font-size: 11px;
  height: 99px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  box-sizing: border-box;
  color: white;
  padding-left: 24px;
  justify-content: center;
}

.total-income h3,
.total-income h4 {
  font-weight: 300;
}

.total-income h3 {
  margin-top: 0px;
  font-size: 16px;
  font-weight: 400;
}

.available-data-button {
  border: solid 2px #468c5f;
  display: inline-block;
  padding: 0px 15px;
  color: #468c5f;
  border-radius: 32px;
  height: 32px;
  cursor: pointer;
}

.available-data-button h4 {
  margin-top: 8.5px;
  font-weight: 400;
}

.all-available-data{
   display: flex;
    flex-wrap: wrap;
    grid-column-gap: 8px;
    -moz-column-gap: 8px;
    column-gap: 8px;
    grid-row-gap: 13px;
    row-gap: 13px;
    width: 161px;
}
</style>