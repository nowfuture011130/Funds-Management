import { useState } from "react";

export const useGetTransactions = (notes) => {
  const [transactionTotals, setTransactionTotals] = useState({
    balance: 0.0,
    income: 0.0,
    expenses: 0.0,
  });

  console.log(notes);

  let totalIncome = 0;
  let totalExpenses = 0;
  for (var i = 0; i < notes.length; ++i) {
    transactionAmount = JSON.parse(notes[i].content).transactionAmount;
    if (notes[i].title === "expense") {
      totalExpenses += Number(transactionAmount);
    } else {
      totalIncome += Number(data.transactionAmount);
    }
  }

  setTransactionTotals({
    balance: totalIncome - totalExpenses,
    income: totalIncome,
    expenses: totalExpenses,
  });

  console.log(transactionTotals);

  return { transactionTotals };
};
