import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function LineChart({ notes }) {
  let reverseNotes = [...notes].reverse();
  let nearestTime = reverseNotes[0] ? reverseNotes[0].created_at : null;
  const getTheTime = (data) => {
    if (data.created_at) {
      const createdAt = data.created_at;
      return (
        new Date(createdAt).getFullYear().toString() +
        "/" +
        (new Date(createdAt).getMonth() + 1).toString() +
        "/" +
        new Date(createdAt).getDate().toString()
      );
    }

    return "";
  };

  function isTimeDifferenceGreaterThanAMonth(date1, date2) {
    const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    const timeDifference = Math.abs(date2.getTime() - date1.getTime());

    return timeDifference > oneMonthInMilliseconds;
  }

  let incomeSum = [];
  let expenseSum = [];
  let monthLabels = [];
  notes.map((note, id) => {
    const transactionAmount = JSON.parse(note.content).transactionAmount;
    const transactionClass = JSON.parse(note.content).transactionClass.value;
    const transactionType = note.title;
    const createdAt = new Date(note.created_at);
    if (
      nearestTime &&
      createdAt &&
      !isTimeDifferenceGreaterThanAMonth(createdAt, new Date(nearestTime))
    ) {
      monthLabels.push(note);
      if (transactionType === "expense") {
        expenseSum.push({
          createdAt: createdAt,
          transactionAmount: {
            x: getTheTime(note),
            y: Number(transactionAmount),
            transactionClass: transactionClass,
          },
        });
      }
      if (transactionType === "income") {
        incomeSum.push({
          createdAt: createdAt,
          transactionAmount: {
            x: getTheTime(note),
            y: Number(transactionAmount),
            transactionClass: transactionClass,
          },
        });
      }
    }
    console.log(expenseSum);
    console.log(incomeSum);
  });

  const userData = {
    labels: monthLabels.map((data) => getTheTime(data)),
    datasets: [
      {
        label: "Month Income",
        data: incomeSum.map((data) => data.transactionAmount),
        borderColor: "green",
        borderWidth: 2,
      },
      {
        label: "Month Expense",
        data: expenseSum.map((data) => data.transactionAmount),
        borderColor: "red",
        borderWidth: 2,
      },
    ],
  };

  console.log(userData);

  return (
    <Line
      data={userData}
      options={{
        elements: {
          line: {
            tension: 0,
            fill: false,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                if (context.parsed.y !== null) {
                  return `${label}: $${context.parsed.y} - ${
                    context.dataset.data[context.dataIndex].transactionClass
                  }`;
                }
                return label;
              },
            },
          },
        },
      }}
    />
  );
}

export default LineChart;
