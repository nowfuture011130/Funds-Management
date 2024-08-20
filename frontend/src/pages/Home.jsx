import { useState, useEffect } from "react";
import api from "../api";
import Select from "react-select";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Transactions from "../components/Transactions";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";
import profilePhoto from "../assets/username.png";
function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || {};

  const [notes, setNotes] = useState([]);
  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionClass, setTransactionClass] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [activeTab, setActiveTab] = useState("transactions");

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const optionsForExpense = [
    { value: "Entertainment", label: "Entertainment" },
    { value: "Groceries", label: "Groceries" },
    { value: "Transportation", label: "Transportation" },
    { value: "Housing", label: "Housing" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Clothing", label: "Clothing" },
    { value: "Dining", label: "Dining" },
    { value: "Education", label: "Education" },
    { value: "Travel", label: "Travel" },
    { value: "Other", label: "Other" },
  ];
  const optionsForIncome = [
    { value: "Salary", label: "Salary" },
    { value: "Investment", label: "Investment" },
    { value: "Bonus", label: "Bonus" },
    { value: "Sponsorship", label: "Sponsorship" },
    { value: "Rent", label: "Rent" },
    { value: "Sales", label: "Sales" },
    { value: "Interest", label: "Interest" },
    { value: "Gift", label: "Gift" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    let data = getNotes();

    let totalIncome = 0;
    let totalExpenses = 0;
    for (var i = 0; i < data.length; ++i) {
      const transactionAmount = JSON.parse(data[i].content).transactionAmount;
      if (data[i].title === "expense") {
        totalExpenses += Number(transactionAmount);
      } else {
        totalIncome += Number(data.transactionAmount);
      }
    }

    setBalance(totalIncome - totalExpenses);
    setIncome(totalIncome);
    setExpenses(totalExpenses);
  }, []);

  useEffect(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    for (var i = 0; i < notes.length; ++i) {
      const transactionAmount = JSON.parse(notes[i].content).transactionAmount;
      if (notes[i].title === "expense") {
        totalExpenses += Number(transactionAmount);
      } else {
        totalIncome += Number(transactionAmount);
      }
    }

    setBalance(totalIncome - totalExpenses);
    setIncome(totalIncome);
    setExpenses(totalExpenses);
  }, [notes]);

  const getNotes = () => {
    let data = [];
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        data = data;
      })
      .catch((err) => alert(err));
    return data;
  };

  const createNote = (e) => {
    e.preventDefault();
    if (!transactionAmount) {
      alert("Amount should be greater than zero");
      return;
    }
    const jsonObject = {
      description: description,
      transactionAmount: transactionAmount,
      transactionClass: transactionClass,
    };
    api
      .post("/api/notes/", {
        content: JSON.stringify(jsonObject),
        title: transactionType,
      })
      .then((res) => {
        if (res.status === 201) alert("Note created!");
        else alert("Failed to make note.");
        getNotes();
        setDescription("");
        setTransactionClass("");
        setTransactionAmount(0);
      })
      .catch((err) => alert(err));
  };

  const signUserOut = async () => {
    try {
      localStorage.clear();
      navigate("/logout");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="expense-tracker">
        <div className="container">
          <h1> {username}'s Expense Tracker</h1>
          <div className="balance">
            <h3> Your Balance</h3>
            {balance >= 0 ? <h2>${balance}</h2> : <h2>-${balance * -1}</h2>}
          </div>
          <div className="summary">
            <div className="income">
              <h4> Income</h4>
              <p>${income}</p>
            </div>
            <div className="expenses">
              <h4> Expenses</h4>
              <p>${expenses}</p>
            </div>
          </div>
          <form className="add-transaction" onSubmit={createNote}>
            <input
              className="inputField"
              type="text"
              placeholder="Description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="inputField"
              type="number"
              placeholder="Amount"
              value={transactionAmount}
              required
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            <div
              style={{
                width: "200px",
              }}
            >
              <Select
                options={
                  transactionType === "expense"
                    ? optionsForExpense
                    : optionsForIncome
                }
                value={transactionClass}
                required
                onChange={setTransactionClass}
                menuPlacement="auto"
                menuPosition="fixed"
              />
            </div>
            <input
              type="radio"
              id="expense"
              value="expense"
              checked={transactionType === "expense"}
              onChange={(e) => {
                setTransactionType(e.target.value);
                setTransactionClass("");
              }}
            />
            <label htmlFor="expense">Expense</label>
            <input
              type="radio"
              id="income"
              value="income"
              checked={transactionType === "income"}
              onChange={(e) => {
                setTransactionType(e.target.value);
                setTransactionClass("");
              }}
            />
            <label htmlFor="income"> Income</label>

            <button type="submit" className="submitBtn">
              {" "}
              Add Transaction
            </button>
          </form>
        </div>

        <div className="profile">
          <img className="profile-photo" src={profilePhoto} />
          <button className="sign-out-button" onClick={signUserOut}>
            Sign Out
          </button>
        </div>
      </div>
      <div className="buttomContainer">
        <div className="sidebar">
          <button
            onClick={() => setActiveTab("transactions")}
            style={{
              backgroundColor: activeTab === "transactions" ? "#ccc" : "#ddd",
            }}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab("line chart")}
            style={{
              backgroundColor: activeTab === "line chart" ? "#ccc" : "#ddd",
            }}
          >
            Line chart
          </button>
          <button
            onClick={() => setActiveTab("pie chart")}
            style={{
              backgroundColor: activeTab === "pie chart" ? "#ccc" : "#ddd",
            }}
          >
            Pie chart
          </button>
        </div>

        <div className="transactions">
          <div className="content">
            {activeTab === "transactions" && <Transactions notes={notes} />}
            {activeTab === "line chart" && <LineChart notes={notes} />}
            {activeTab === "pie chart" && <PieChart notes={notes} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
