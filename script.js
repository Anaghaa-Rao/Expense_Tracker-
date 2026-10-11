  
// EXPENSE TRACKER - COMPLETE JAVASCRIPT
  

   // CONSTANTS    

const STORAGE_KEY = "expenseTrackerExpenses";
const BUDGET_KEY = "expenseTrackerBudget";

const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Education",
    "Entertainment",
    "Health",
    "Others"
];


    //DATA    

let expenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let monthlyBudget = Number(localStorage.getItem(BUDGET_KEY)) || 0;


    //DOM ELEMENTS    

const expenseForm = document.getElementById("expense-form");

const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const noteInput = document.getElementById("note");
const formMessage = document.getElementById("form-message");

const totalSpending = document.getElementById("total-spending");
const todaySpending = document.getElementById("today-spending");
const remainingBudget = document.getElementById("remaining-budget");

const recentTransactionsList =
    document.getElementById("recent-transactions-list");

const transactionList =
    document.getElementById("transaction-list");

const transactionSearch =
    document.getElementById("transaction-search");

const filterCategory =
    document.getElementById("filter-category");

const filterDate =
    document.getElementById("filter-date");

const filterPayment =
    document.getElementById("filter-payment");

const categoryTableBody =
    document.getElementById("category-table-body");

const monthlyBudgetInput =
    document.getElementById("monthly-budget");

const saveBudgetButton =
    document.getElementById("save-budget");

const budgetAmount =
    document.getElementById("budget-amount");

const budgetSpent =
    document.getElementById("budget-spent");

const budgetRemaining =
    document.getElementById("budget-remaining");

const budgetPercentage =
    document.getElementById("budget-percentage");

const budgetProgressBar =
    document.getElementById("budget-progress-bar");

const budgetStatusMessage =
    document.getElementById("budget-status-message");

const monthlyReport =
    document.getElementById("monthly-report");

const categoryReport =
    document.getElementById("category-report");

const reportChart =
    document.getElementById("report-chart");

const currentMonthName =
    document.getElementById("current-month-name");

const currentMonthSpending =
    document.getElementById("current-month-spending");

const previousMonthName =
    document.getElementById("previous-month-name");

const previousMonthSpending =
    document.getElementById("previous-month-spending");

const spendingDifference =
    document.getElementById("spending-difference");

const spendingChangePercentage =
    document.getElementById("spending-change-percentage");

const exportDataButton =
    document.getElementById("export-data");

const clearDataButton =
    document.getElementById("clear-data");

const menuButton =
    document.getElementById("menuButton");

const menu =
    document.getElementById("menu");


  
// GENERAL FUNCTIONS
  

function formatCurrency(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getCurrentMonth() {
    const today = new Date();

    return `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;
}


function getPreviousMonth() {
    const today = new Date();

    today.setMonth(today.getMonth() - 1);

    return `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;
}


function getMonthName(monthString) {
    const [year, month] = monthString.split("-");

    const date = new Date(
        Number(year),
        Number(month) - 1,
        1
    );

    return date.toLocaleString("en-IN", {
        month: "long",
        year: "numeric"
    });
}


function isCurrentMonth(date) {
    return date.startsWith(getCurrentMonth());
}


function isToday(date) {
    return date === getTodayDate();
}


function calculateTotal(list) {
    return list.reduce(
        (total, expense) => total + Number(expense.amount),
        0
    );
}


  
// LOCAL STORAGE
  

function saveExpenses() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(expenses)
    );
}


function saveBudget() {
    localStorage.setItem(
        BUDGET_KEY,
        monthlyBudget.toString()
    );
}


  
// FORM - ADD / EDIT EXPENSE
  

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    const paymentMethodElement =
        document.querySelector(
            'input[name="payment-method"]:checked'
        );

    const paymentMethod =
        paymentMethodElement
            ? paymentMethodElement.value
            : "";

    const note = noteInput.value.trim();

    // Validation

    if (!amount || amount <= 0) {
        showFormMessage(
            "Please enter a valid amount.",
            "error"
        );
        return;
    }

    if (!category) {
        showFormMessage(
            "Please select a category.",
            "error"
        );
        return;
    }

    if (!date) {
        showFormMessage(
            "Please select a date.",
            "error"
        );
        return;
    }

    if (!paymentMethod) {
        showFormMessage(
            "Please select a payment method.",
            "error"
        );
        return;
    }


    // Check whether we are editing

    const editingId =
        expenseForm.dataset.editingId;


    if (editingId) {

        const expenseIndex =
            expenses.findIndex(
                expense =>
                    expense.id === Number(editingId)
            );

        if (expenseIndex !== -1) {

            expenses[expenseIndex] = {
                ...expenses[expenseIndex],
                amount,
                category,
                date,
                paymentMethod,
                note
            };

            showFormMessage(
                "Expense updated successfully.",
                "success"
            );
        }

        delete expenseForm.dataset.editingId;

        resetSubmitButton();

    } else {

        const newExpense = {

            id: Date.now(),

            amount,

            category,

            date,

            paymentMethod,

            note

        };

        expenses.push(newExpense);

        showFormMessage(
            "Expense added successfully.",
            "success"
        );
    }


    saveExpenses();

    expenseForm.reset();

    dateInput.value = getTodayDate();

    updateEverything();

});


  
// FORM MESSAGE
  

function showFormMessage(message, type) {

    if (!formMessage) return;

    formMessage.textContent = message;

    formMessage.className =
        "form-message " + type;

    setTimeout(() => {

        formMessage.textContent = "";
        formMessage.className = "form-message";

    }, 3000);
}


  
// DASHBOARD CALCULATIONS
  

function updateDashboard() {

    const currentMonthExpenses =
        expenses.filter(expense =>
            isCurrentMonth(expense.date)
        );

    const todayExpenses =
        expenses.filter(expense =>
            isToday(expense.date)
        );

    const total =
        calculateTotal(currentMonthExpenses);

    const todayTotal =
        calculateTotal(todayExpenses);


    // Total spending

    totalSpending.textContent =
        formatCurrency(total);


    // Today's spending

    todaySpending.textContent =
        formatCurrency(todayTotal);


    // Remaining budget

    if (monthlyBudget > 0) {

        const remaining =
            monthlyBudget - total;

        remainingBudget.textContent =
            formatCurrency(remaining);

    } else {

        remainingBudget.textContent =
            "Not set";
    }

}


  
// RECENT TRANSACTIONS
  

function updateRecentTransactions() {

    const recentExpenses =
        [...expenses]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )
            .slice(0, 5);


    recentTransactionsList.innerHTML = "";


    if (recentExpenses.length === 0) {

        recentTransactionsList.innerHTML = `
            <tr>
                <td colspan="4">
                    No transactions yet.
                </td>
            </tr>
        `;

        return;
    }


    recentExpenses.forEach(expense => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(expense.date)}</td>

            <td>${escapeHTML(expense.category)}</td>

            <td>${escapeHTML(expense.note || "-")}</td>

            <td>${formatCurrency(expense.amount)}</td>
        `;

        recentTransactionsList.appendChild(row);

    });

}


  
// TRANSACTIONS TABLE
  

function updateTransactionsTable() {

    const filteredExpenses =
        getFilteredExpenses();

    transactionList.innerHTML = "";


    if (filteredExpenses.length === 0) {

        transactionList.innerHTML = `
            <tr>
                <td colspan="6">
                    No transactions found.
                </td>
            </tr>
        `;

        return;
    }


    filteredExpenses.forEach(expense => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

    <td>${escapeHTML(expense.date)}</td>

    <td>${escapeHTML(expense.note || "-")}</td>

    <td>${escapeHTML(expense.category)}</td>

    <td>${escapeHTML(expense.paymentMethod)}</td>

    <td>${formatCurrency(expense.amount)}</td>

    <td>
        <div class="action-buttons">

            <button
                class="edit-button"
                onclick="editExpense(${expense.id})"
            >
                Edit
            </button>

            <button
                class="delete-button"
                onclick="deleteExpense(${expense.id})"
            >
                Delete
            </button>

        </div>
    </td>

`;

        transactionList.appendChild(row);

    });

}


  
// SEARCH + FILTER
  

function getFilteredExpenses() {

    const searchText =
        transactionSearch
            ? transactionSearch.value
                .trim()
                .toLowerCase()
            : "";

    const selectedCategory =
        filterCategory
            ? filterCategory.value
            : "";

    const selectedDate =
        filterDate
            ? filterDate.value
            : "";

    const selectedPayment =
        filterPayment
            ? filterPayment.value
            : "";


    return expenses.filter(expense => {

        const searchableText = `

            ${expense.note}

            ${expense.category}

            ${expense.paymentMethod}

            ${expense.amount}

            ${expense.date}

        `.toLowerCase();


        const matchesSearch =
            !searchText ||
            searchableText.includes(searchText);


        const matchesCategory =
            !selectedCategory ||
            expense.category === selectedCategory;


        const matchesDate =
            !selectedDate ||
            expense.date === selectedDate ||
            expense.date.startsWith(selectedDate);


        const matchesPayment =
            !selectedPayment ||
            expense.paymentMethod === selectedPayment;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesDate &&
            matchesPayment
        );

    });

}


// Add automatic filtering

if (transactionSearch) {

    transactionSearch.addEventListener(
        "input",
        updateTransactionsTable
    );

}


if (filterCategory) {

    filterCategory.addEventListener(
        "change",
        updateTransactionsTable
    );

}


if (filterDate) {

    filterDate.addEventListener(
        "change",
        updateTransactionsTable
    );

}


if (filterPayment) {

    filterPayment.addEventListener(
        "change",
        updateTransactionsTable
    );

}


  
// EDIT EXPENSE
  

function editExpense(id) {

    const expense =
        expenses.find(
            item => item.id === id
        );

    if (!expense) return;


    amountInput.value =
        expense.amount;

    categoryInput.value =
        expense.category;

    dateInput.value =
        expense.date;

    noteInput.value =
        expense.note;


    const paymentRadio =
        document.querySelector(
            `input[name="payment-method"][value="${expense.paymentMethod}"]`
        );

    if (paymentRadio) {

        paymentRadio.checked = true;

    }


    expenseForm.dataset.editingId =
        id;


    const submitButton =
        expenseForm.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.textContent =
            "Update Expense";

    }


    // Scroll to form

    expenseForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


  
// DELETE EXPENSE
  

function deleteExpense(id) {

    const expense =
        expenses.find(
            item => item.id === id
        );

    if (!expense) return;


    const confirmation =
        confirm(
            `Delete this ${expense.category} expense of ${formatCurrency(expense.amount)}?`
        );


    if (!confirmation) return;


    expenses =
        expenses.filter(
            item => item.id !== id
        );


    saveExpenses();

    updateEverything();

}


  
// RESET SUBMIT BUTTON
  

function resetSubmitButton() {

    const submitButton =
        expenseForm.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.textContent =
            "Add Expense";

    }

}


  
// CATEGORY TABLE
  

function updateCategoryTable() {

    categoryTableBody.innerHTML = "";


    const currentMonthExpenses =
        expenses.filter(expense =>
            isCurrentMonth(expense.date)
        );


    const totalSpending =
        calculateTotal(currentMonthExpenses);


    categories.forEach(category => {

        const categoryExpenses =
            currentMonthExpenses.filter(
                expense =>
                    expense.category === category
            );


        const categoryTotal =
            calculateTotal(categoryExpenses);


        const percentage =
            totalSpending > 0
                ? (categoryTotal / totalSpending) * 100
                : 0;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${category}</td>

            <td>${categoryExpenses.length}</td>

            <td>${formatCurrency(categoryTotal)}</td>

            <td>${percentage.toFixed(1)}%</td>

        `;


        categoryTableBody.appendChild(row);

    });

}


  
// BUDGET
  

saveBudgetButton.addEventListener(
    "click",
    function () {

        const value =
            Number(monthlyBudgetInput.value);


        if (!value || value <= 0) {

            alert(
                "Please enter a valid monthly budget."
            );

            return;
        }


        monthlyBudget = value;

        saveBudget();

        updateBudget();

        monthlyBudgetInput.value = "";

        alert(
            "Monthly budget saved successfully."
        );

    }
);


function updateBudget() {

    const currentMonthExpenses =
        expenses.filter(expense =>
            isCurrentMonth(expense.date)
        );


    const spent =
        calculateTotal(currentMonthExpenses);


    budgetAmount.textContent =
        formatCurrency(monthlyBudget);


    budgetSpent.textContent =
        formatCurrency(spent);


    if (monthlyBudget <= 0) {

        budgetRemaining.textContent =
            "Not set";

        budgetPercentage.textContent =
            "0%";

        budgetProgressBar.style.width =
            "0%";

        budgetStatusMessage.textContent =
            "Set a monthly budget to track your spending.";

        return;
    }


    const remaining =
        monthlyBudget - spent;


    budgetRemaining.textContent =
        formatCurrency(remaining);


    const percentage =
        (spent / monthlyBudget) * 100;


    budgetPercentage.textContent =
        percentage.toFixed(1) + "%";


    const progressWidth =
        Math.min(percentage, 100);


    budgetProgressBar.style.width =
        progressWidth + "%";


    if (percentage < 80) {

        budgetStatusMessage.textContent =
            "You are within your budget.";

    } else if (percentage < 100) {

        budgetStatusMessage.textContent =
            "You are approaching your budget limit.";

    } else {

        budgetStatusMessage.textContent =
            "Your spending has exceeded the budget.";

    }

}

/*   
   CATEGORY CHARTS - DASHBOARD AND REPORTS
   */

const chartColors = [
    "#2563eb",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#bfdbfe",
    "#1d4ed8",
    "#1e40af",
    "#38bdf8"
];

function renderPieChart(container, categoryTotals, emptyMessage) {
    if (!container) return;

    container.innerHTML = "";

    const data = Object.entries(categoryTotals)
        .filter(([, amount]) => Number(amount) > 0);

    if (data.length === 0) {
        const message = document.createElement("p");
        message.textContent = emptyMessage;
        container.appendChild(message);
        return;
    }

    const total = data.reduce(
        (sum, [, amount]) => sum + Number(amount),
        0
    );

    if (total <= 0) return;

    // SVG chart dimensions
    const ns = "http://www.w3.org/2000/svg";
    const width = 1000;
    const height = 400;
    const cx = 500;
    const cy = 240;
    const radius = 180;

    function makeSvgElement(tag, attributes = {}) {
        const element = document.createElementNS(ns, tag);

        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });

        return element;
    }

    function polarPoint(angle, distance = radius) {
        const radians = angle * Math.PI / 180;

        return {
            x: cx + distance * Math.cos(radians),
            y: cy + distance * Math.sin(radians)
        };
    }

    const svg = makeSvgElement("svg", {
        viewBox: `0 0 ${width} ${height}`,
        class: "pie-callout-chart",
        role: "img",
        "aria-label": "Spending breakdown by category"
    });

    let currentAngle = -90;

    const slices = data.map(([category, amount], index) => {
        const value = Number(amount);
        const percentage = (value / total) * 100;

        const startAngle = currentAngle;
        const endAngle = startAngle + percentage * 3.6;
        const middleAngle = (startAngle + endAngle) / 2;

        currentAngle = endAngle;

        return {
            category,
            amount: value,
            percentage,
            startAngle,
            endAngle,
            middleAngle,
            color: chartColors[index % chartColors.length]
        };
    });

    // Draw pie slices with subtle white separators.
    slices.forEach(slice => {
        if (slice.percentage >= 99.999) {
            svg.appendChild(makeSvgElement("circle", {
                cx,
                cy,
                r: radius,
                fill: slice.color,
                stroke: "#ffffff",
                "stroke-width": 2
            }));

            return;
        }

        const start = polarPoint(slice.startAngle);
        const end = polarPoint(slice.endAngle);
        const largeArc = slice.percentage > 50 ? 1 : 0;

        const pathData = [
            `M ${cx} ${cy}`,
            `L ${start.x} ${start.y}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
            "Z"
        ].join(" ");

        svg.appendChild(makeSvgElement("path", {
            d: pathData,
            fill: slice.color,
            stroke: "#ffffff",
            "stroke-width": 2,
            "stroke-linejoin": "round"
        }));
    });

    // Divide labels between the left and right sides.
    const leftSlices = [];
    const rightSlices = [];

    slices.forEach(slice => {
        const edge = polarPoint(slice.middleAngle, radius);

        slice.side =
            Math.cos(slice.middleAngle * Math.PI / 180) < 0
                ? "left"
                : "right";

        slice.edgeX = edge.x;
        slice.edgeY = edge.y;

        if (slice.side === "left") {
            leftSlices.push(slice);
        } else {
            rightSlices.push(slice);
        }
    });

    // Space labels evenly so they do not overlap vertically.
    function positionLabels(items) {
        items.sort((a, b) => a.edgeY - b.edgeY);

        const top = 35;
        const bottom = height - 35;

        items.forEach((slice, index) => {
            slice.labelY = items.length === 1
                ? height / 2
                : top + index * (bottom - top) / (items.length - 1);
        });
    }

    positionLabels(leftSlices);
    positionLabels(rightSlices);

    // Draw curved connectors, colored dots and readable labels.
    slices.forEach(slice => {
        const isLeft = slice.side === "left";

        const dotX = isLeft ? 240 : 760;
        const labelX = isLeft ? 220 : 780;
        const anchor = isLeft ? "end" : "start";
        const direction = isLeft ? -1 : 1;

        const connector = [
            `M ${slice.edgeX} ${slice.edgeY}`,
            `C ${slice.edgeX + direction * 35} ${slice.edgeY},`,
            `${dotX - direction * 35} ${slice.labelY},`,
            `${dotX} ${slice.labelY}`
        ].join(" ");

        svg.appendChild(makeSvgElement("path", {
            d: connector,
            fill: "none",
            stroke: slice.color,
            "stroke-width": 1.6,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: "pie-connector"
        }));

        svg.appendChild(makeSvgElement("circle", {
            cx: dotX,
            cy: slice.labelY,
            r: 5,
            fill: slice.color,
            class: "pie-callout-dot"
        }));

        const label = makeSvgElement("text", {
            x: labelX,
            y: slice.labelY,
            "text-anchor": anchor,
            "dominant-baseline": "middle",
            class: "pie-callout-label"
        });

        label.textContent =
            `${slice.category} · ${formatCurrency(slice.amount)} · ${slice.percentage.toFixed(1)}%`;

        svg.appendChild(label);
    });

    container.appendChild(svg);
}


/*   
   DASHBOARD CATEGORY CHART
   */

function updateCategoryChart() {
    const chartContainer =
        document.getElementById("category-chart");

    const currentMonthExpenses = expenses.filter(expense =>
        isCurrentMonth(expense.date)
    );

    const categoryTotals = {};

    currentMonthExpenses.forEach(expense => {
        categoryTotals[expense.category] =
            (categoryTotals[expense.category] || 0) +
            Number(expense.amount);
    });

    renderPieChart(
        chartContainer,
        categoryTotals,
        "No spending data available."
    );
}


/*   
   REPORT CHART
   */

function updateReportChart(currentExpenses) {
    if (!reportChart) return;

    const categoryTotals = {};

    currentExpenses.forEach(expense => {
        categoryTotals[expense.category] =
            (categoryTotals[expense.category] || 0) +
            Number(expense.amount);
    });

    renderPieChart(
        reportChart,
        categoryTotals,
        "No report data available."
    );
}


/*   
   REPORTS
   */

function updateReports() {
    const currentMonth = getCurrentMonth();
    const previousMonth = getPreviousMonth();

    const currentExpenses = expenses.filter(expense =>
        expense.date.startsWith(currentMonth)
    );

    const previousExpenses = expenses.filter(expense =>
        expense.date.startsWith(previousMonth)
    );

    const currentTotal = calculateTotal(currentExpenses);
    const previousTotal = calculateTotal(previousExpenses);
    const difference = currentTotal - previousTotal;

    let percentageChange = 0;

    if (previousTotal > 0) {
        percentageChange =
            (difference / previousTotal) * 100;
    }

    currentMonthName.textContent = getMonthName(currentMonth);
    previousMonthName.textContent = getMonthName(previousMonth);

    currentMonthSpending.textContent = formatCurrency(currentTotal);
    previousMonthSpending.textContent = formatCurrency(previousTotal);

    spendingDifference.textContent =
        formatCurrency(Math.abs(difference));

    if (previousTotal === 0) {
        spendingChangePercentage.textContent =
            "No previous month data";
    } else if (difference > 0) {
        spendingChangePercentage.textContent =
            `${percentageChange.toFixed(1)}% increase`;
    } else if (difference < 0) {
        spendingChangePercentage.textContent =
            `${Math.abs(percentageChange).toFixed(1)}% decrease`;
    } else {
        spendingChangePercentage.textContent = "No change";
    }

    // Monthly summary
    if (monthlyReport) {
        monthlyReport.textContent =
            `You spent ${formatCurrency(currentTotal)} this month.`;
    }

    // Highest-spending category
    if (categoryReport) {
        const categoryTotals = {};

        currentExpenses.forEach(expense => {
            categoryTotals[expense.category] =
                (categoryTotals[expense.category] || 0) +
                Number(expense.amount);
        });

        const sortedCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1]);

        if (sortedCategories.length === 0) {
            categoryReport.textContent =
                "No category spending data available.";
        } else {
            const [category, amount] = sortedCategories[0];

            categoryReport.textContent =
                `Highest spending category: ${category} (${formatCurrency(amount)}).`;
        }
    }

    // Report chart uses this month's category totals.
    updateReportChart(currentExpenses);
}

  
// EXPORT DATA
  

if (exportDataButton) {

    exportDataButton.addEventListener(
        "click",
        function () {

            const data = {

                expenses: expenses,

                monthlyBudget: monthlyBudget,

                exportedAt:
                    new Date().toISOString()

            };


            const json =
                JSON.stringify(
                    data,
                    null,
                    2
                );


            const blob =
                new Blob(
                    [json],
                    {
                        type: "application/json"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "expense-tracker-data.json";


            link.click();


            URL.revokeObjectURL(url);

        }
    );

}


  
// CLEAR ALL DATA
  

if (clearDataButton) {

    clearDataButton.addEventListener(
        "click",
        function () {

            if (expenses.length === 0 &&
                monthlyBudget === 0) {

                alert(
                    "There is no data to clear."
                );

                return;
            }


            const confirmation =
                confirm(
                    "Are you sure you want to delete all expense and budget data?"
                );


            if (!confirmation) return;


            expenses = [];

            monthlyBudget = 0;


            localStorage.removeItem(
                STORAGE_KEY
            );

            localStorage.removeItem(
                BUDGET_KEY
            );


            updateEverything();

            alert(
                "All data has been cleared."
            );

        }
    );

}


  
// MOBILE MENU
  

if (menuButton && menu) {

    menuButton.addEventListener(
        "click",
        function () {

            menu.classList.toggle(
                "active"
            );

        }
    );


    // Close menu after clicking a link

    const menuLinks =
        menu.querySelectorAll("a");


    menuLinks.forEach(link => {

        link.addEventListener(
            "click",
            function () {

                menu.classList.remove(
                    "active"
                );

            }
        );

    });

}


  
// BASIC SECURITY
  

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


  
// UPDATE EVERYTHING
  

function updateEverything() {

    updateDashboard();

    updateRecentTransactions();

    updateTransactionsTable();

    updateCategoryTable();

    updateBudget();

    updateCategoryChart();

    updateReports();

}


  
// INITIAL SETUP
  

dateInput.value = getTodayDate();

updateEverything();
