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
      expenseData: {},
      incomeData: {},
      graphLabelsIncome: [],
      graphLabelsExpense: [],
      graphLabelsReadable: [],
      graphDataExpense: [],
      graphDataIncome: [],
    };
  },

  computed: {
    ...mapGetters(["getUserID"]),
  },

  methods: {
    retrieveData() {
      console.log("retrieveign data");
      const db = getDatabase();
      const dataRef = ref(db, "users/" + this.getUserID);
      let totalIncomeData = {};
      let totalExpenseData = {};
      let _this = this;
      onValue(dataRef, (snapshot) => {
        let data = snapshot.val();
        for (const key in data) {
          console.log(key);
          // totalData[key] = data
          if (key === "income") {
            totalIncomeData = data[key];
          }
          if (key === "expenses") {
            totalExpenseData = data[key];
          }
        }
        console.log("TOTALY INCOME DATA - ", totalIncomeData);
        console.log("TOTALY EXPENSE DATA - ", totalExpenseData);
        this.incomeData = totalIncomeData;
        this.expenseData = totalExpenseData;
        _this.generateGraphData()
      });
    },

    generateGraphData() {
      this.graphDataIncome = [];
      this.graphDataExpense = [];
      this.graphLabelsIncome = [];
      this.graphLabelsExpense = [];
      for (const key in this.expenseData) {
        this.graphLabelsExpense.push(this.expenseData[key].dateAdded);
        this.graphDataExpense.push(Number(this.expenseData[key].expenseAmount));
      }
      for (const key in this.incomeData) {
        this.graphLabelsIncome.push(this.incomeData[key].dateAdded);
        this.graphDataIncome.push(Number(this.incomeData[key].incomeAmount));
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
      this.graphLabelsExpense.forEach((date, index) => {
        let dateMonth = date.split("/")[1];
        let dateNumber = date.split("/")[0];
        let dateMonthAltered = "";
        let graphLabelAltered = "";
        dateMonthAltered = months[dateMonth - 1];
        graphLabelAltered = `${dateMonthAltered} ${dateNumber}`;
        this.graphLabelsExpense[index] = graphLabelAltered;
      });
      this.graphLabelsIncome.forEach((date, index) => {
        let dateMonth = date.split("/")[1];
        let dateNumber = date.split("/")[0];
        let dateMonthAltered = "";
        let graphLabelAltered = "";
        dateMonthAltered = months[dateMonth - 1];
        graphLabelAltered = `${dateMonthAltered} ${dateNumber}`;
        this.graphLabelsIncome[index] = graphLabelAltered;
      });

      //destroy the current chart if one already exists, then load the graph
      this.myChart?.destroy();
      this.loadGraph();
    },

    loadGraph() {
      console.log("loading graph: ", this.graphDataExpense)
      Chart.defaults.font.size = 11;
      Chart.defaults.color = "rgb(0, 0, 0)";
      Chart.defaults.font.weight = "400";
      Chart.defaults.font.family = "Poppins";
      const ctx = document.getElementById("myChart");
      let _this = this;
        this.myChart = new Chart(ctx, {
          // labels: [..._this.graphLabelsIncome, ..._this.graphLabelsExpense],
          labels: ["May 13", "Jul 22", "Jul 22", "Jul 5","Jul 6","Jul 6","Jul 16"],
          data: {
            labels: _this.graphLabelsExpense,
            datasets: [
              {
                type: "line",
                label: "Total Income Over Time",
                // For the data, use the total user income as they add a data.
                data: _this.graphDataIncome,
                // data: [32, 4, 23, 12],
                backgroundColor: ["#468c5f"],
                borderColor: ["#468c5f"],
                borderJoinStyle: "round",
                borderWidth: 2,
                tension: 0.3,
              },
              {
                type: "line",
                label: "Total Expense Over Time",
                // For the data, use the total user income as they add a data.
                data: _this.graphDataExpense,
                // data: [32, 4, 23, 12],
                backgroundColor: ["#024200"],
                borderColor: ["#024200"],
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
      // this.myChart = new Chart(ctx, {
        // data: {
        //   datasets: [
        //     {
        //       type: "line",
        //       label: "Bar Dataset",
        //       borderColor: ["#468c5f"],
        //       data: [50, 20, 40, 40],
        //     },
        //     {
        //       type: "line",
        //       label: "Line Dataset",
        //       data: [50, 30, 50, 50],
        //     },
        //   ],
        //   labels: ["January", "February", "March", "April"],
        // },
        // options: options
      // });
    },
  mounted() {
    this.retrieveData();
  },
};
</script>