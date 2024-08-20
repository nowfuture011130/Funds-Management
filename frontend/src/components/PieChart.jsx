import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

function PieChart({ notes }) {
  let reverseNotes = [...notes].reverse();
  let nearestTime = reverseNotes[0] ? reverseNotes[0].created_at : null;

  let incomeSum = [0, 0, 0, 0, 0, 0, 0, 0];
  let expenseSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const expenseLabels = [
    "Entertainment",
    "Groceries",
    "Transportation",
    "Housing",
    "Healthcare",
    "Clothing",
    "Dining",
    "Education",
    "Travel",
    "Other",
  ];
  const incomeLabels = [
    "Salary",
    "Investment",
    "Bonus",
    "Sponsorship",
    "Rent",
    "Sales",
    "Interest",
    "Gift",
  ];
  function isTimeDifferenceGreaterThanAMonth(date1, date2) {
    const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    const timeDifference = Math.abs(date2.getTime() - date1.getTime());

    return timeDifference > oneMonthInMilliseconds;
  }

  notes.map((note) => {
    const transactionAmount = JSON.parse(note.content).transactionAmount;
    const transactionClass = JSON.parse(note.content).transactionClass.value;
    const transactionType = note.title;
    const createdAt = new Date(note.created_at);

    if (
      nearestTime &&
      createdAt &&
      !isTimeDifferenceGreaterThanAMonth(createdAt, new Date(nearestTime))
    ) {
      if (transactionType === "expense") {
        const index = expenseLabels.indexOf(transactionClass);
        if (index !== -1) {
          expenseSum[index] += Number(transactionAmount);
        }
      }
      if (transactionType === "income") {
        const index = incomeLabels.indexOf(transactionClass);
        if (index !== -1) {
          incomeSum[index] += Number(transactionAmount);
        }
      }
    }
  });
  const expenseData = {
    labels: [
      "Entertainment",
      "Groceries",
      "Transportation",
      "Housing",
      "Healthcare",
      "Clothing",
      "Dining",
      "Education",
      "Travel",
      "Other",
    ],
    datasets: [
      {
        data: expenseSum,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(74, 46, 229, 0.2)",
          "rgba(137, 148, 86, 0.2)",
          "rgba(77, 8, 35, 0.2)",
          "rgba(170, 170, 170, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(74, 46, 229, 1)",
          "rgba(137, 148, 86, 1)",
          "rgba(77, 8, 35, 1)",
          "rgba(170, 170, 170, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const incomeData = {
    labels: [
      "Salary",
      "Investment",
      "Bonus",
      "Sponsorship",
      "Rent",
      "Sales",
      "Interest",
      "Gift",
    ],
    datasets: [
      {
        data: incomeSum,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(74, 46, 229, 0.2)",
          "rgba(137, 148, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(74, 46, 229, 1)",
          "rgba(137, 148, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1 1 50%" }}>
        <Pie
          data={expenseData}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Expense Pie Chart",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    console.log(context);
                    const label = context.dataset.label || "";
                    if (context.parsed.y !== null) {
                      return `${label}: $${
                        context.dataset.data[context.dataIndex]
                      }`;
                    }
                    return label;
                  },
                },
              },
            },
          }}
        />
      </div>
      <div style={{ flex: "1 1 50%" }}>
        <Pie
          data={incomeData}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Income Pie Chart",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    console.log(context);
                    const label = context.dataset.label || "";
                    if (context.parsed.y !== null) {
                      return `${label}: $${
                        context.dataset.data[context.dataIndex]
                      }`;
                    }
                    return label;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default PieChart;
