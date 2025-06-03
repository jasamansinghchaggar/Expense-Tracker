// For feather icon

feather.replace();

// Expense tracker working

// Elements of the popup

let expensePopup = document.getElementById("expense-popup");
let crossIcon = document.getElementById("cross");
let expenseTitle = document.getElementById("title");
let expenseAmount = document.getElementById("amount");
let expenseDate = document.getElementById("date");
let submit = document.getElementById("submit");

// Elements of the landing page

let expenseContainer = document.getElementById("expense-container");
let entryButton = document.getElementById("expense-entry-button");
let totalAmount = document.getElementById("expense-total");
let expenseList = document.querySelector(".expense-list");


// Working of the popup view

entryButton.addEventListener("click", function() {
    expensePopup.classList.remove("hide");
    expenseContainer.style.opacity = "0.5";
})

crossIcon.addEventListener("click", function() {
    expensePopup.classList.add("hide");
    expenseContainer.style.opacity = "1";
})

// Form functionality

let expenseForm = document.querySelector("form");

// Add functionality to store data in localStorage
function saveToLocalStorage(expenses) {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadFromLocalStorage() {
    const storedExpenses = localStorage.getItem("expenses");
    return storedExpenses ? JSON.parse(storedExpenses) : [];
}

// Initialize expenses from localStorage
let expenses = loadFromLocalStorage();

// Update DOM on load
function updateDOMOnLoad() {
    expenses.forEach(expense => {
        addExpenseToDOM(expense);
    });
    updateTotalExpense();
}

function updateTotalExpense() {
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    totalAmount.innerText = "₹" + total.toFixed(2);
}

// Add expense to DOM
function addExpenseToDOM(expenseData) {
    let newExpenseItem = document.createElement("li");
    newExpenseItem.classList.add("expense");
    newExpenseItem.innerHTML = `
        <div class="expense-details">
            <p class="expense-title">${expenseData.title}</p>
            <p class="expense-date">Paid on ${expenseData.date}</p>
        </div>
        <p class="expense-amount">- ₹${expenseData.amount}</p>
        <button class="delete-expense">Delete</button>
    `;

    // Add event listener for delete with confirmation
    newExpenseItem.querySelector(".delete-expense").addEventListener("click", function() {
        if (confirm("Are you sure you want to delete this expense?")) {
            deleteExpense(expenseData);
        }
    });

    expenseList.appendChild(newExpenseItem);
}

// Delete expense
function deleteExpense(expenseData) {
    expenses = expenses.filter(expense => expense !== expenseData);
    saveToLocalStorage(expenses);
    expenseList.innerHTML = "";
    updateDOMOnLoad();
}

// Update form submission
expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let title = expenseTitle.value;
    let amount = expenseAmount.value;
    let rawDate = expenseDate.value;
    let formattedDate = moment(rawDate).format("MM/DD/YY");

    let expenseData = {
        title: title,
        amount: amount,
        date: formattedDate,
    };

    expenses.push(expenseData);
    saveToLocalStorage(expenses);
    addExpenseToDOM(expenseData);
    updateTotalExpense();

    expenseForm.reset();
    expensePopup.classList.add("hide");
    expenseContainer.style.opacity = "1";
});

// Load expenses and update DOM on page load
document.addEventListener("DOMContentLoaded", updateDOMOnLoad);

// Empty list Message

function emptyListMessage() {
    let message = "No expenses recorded!"
    let messageNode = document.createElement("li");
    messageNode.classList.add("list-info");
    messageNode.textContent = message;

    if(expenseList.children.length === 0 ){
        expenseList.appendChild(messageNode);
    }
    else {
        let existingMessage = expenseList.querySelector(".list-info");
        if(existingMessage) {
            expenseList.removeChild(existingMessage);
        }
    }
}

emptyListMessage();