document.getElementById('expense-form').addEventListener('submit', addTransaction);

// Load transactions from localStorage when the page loads
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
let totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;

function addTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const account = document.getElementById('account').value;
    const transactionType = document.getElementById('transaction-type').value;

    if (!description || isNaN(amount) || !category || !date || !account || !transactionType) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const transaction = {
        id: new Date().getTime(),
        description,
        amount,
        category,
        date,
        account,
        transactionType
    };

    transactions.push(transaction);

    // Update total income and expenses based on transaction type
    if (transactionType === 'Income') {
        totalIncome += amount;
    } else {
        totalExpenses += amount;
    }

    // Update localStorage with the new transactions and totals
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('totalIncome', totalIncome.toFixed(2));
    localStorage.setItem('totalExpenses', totalExpenses.toFixed(2));

    updateTransactions();
    resetForm();
}

function updateTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    const totalIncomeDisplay = document.getElementById('total-income');
    const totalExpensesDisplay = document.getElementById('total-expenses');
    const netBalanceDisplay = document.getElementById('net-balance');

    transactionsList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${transaction.description} - $${transaction.amount.toFixed(2)} (${transaction.category}) on ${transaction.date} from ${transaction.account} (${transaction.transactionType})</span>
            <button onclick="removeTransaction(${index})">Remove</button>
        `;
        transactionsList.appendChild(li);
    });

    totalIncomeDisplay.textContent = totalIncome.toFixed(2);
    totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
    netBalanceDisplay.textContent = (totalIncome - totalExpenses).toFixed(2);
}

function removeTransaction(index) {
    const removedTransaction = transactions[index];
    const removedAmount = removedTransaction.amount;

    if (removedTransaction.transactionType === 'Income') {
        totalIncome -= removedAmount;
    } else {
        totalExpenses -= removedAmount;
    }

    transactions.splice(index, 1); // Remove the transaction at the specified index

    // Update localStorage after removing the transaction
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('totalIncome', totalIncome.toFixed(2));
    localStorage.setItem('totalExpenses', totalExpenses.toFixed(2));

    updateTransactions();
}

function resetForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value = '';
    document.getElementById('date').value = '';
    document.getElementById('account').value = '';
    document.getElementById('transaction-type').value = '';
}

// Load transactions when the page loads
window.onload = function() {
    updateTransactions();
}
