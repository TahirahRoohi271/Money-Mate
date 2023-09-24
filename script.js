document.addEventListener("DOMContentLoaded", () => {

  const expenseDate = document.getElementById("expense-date");
  const expenseItem = document.getElementById("expense-item");
  const expenseAmount = document.getElementById("expense-amount");
  const addExpenseButton = document.getElementById("add-expense");
  const expenseList = document.getElementById("expense-list");
  const totalAmount = document.getElementById("total-amount");

  let editMode = false; // Flag to indicate whether we're in edit mode
  let editIndex = -1;  // Index of the expense being edited

  // Function to load expenses from Local Storage
  function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    updateExpenseList(expenses);
  }

  // Function to update the expense list on the page
  // Function to update the expense list on the page
  function updateExpenseList(expenses) {
    expenseList.innerHTML = "";
    expenses.forEach((expense, index) => {
      const { date, item, amount } = expense;

      const listItem = document.createElement("li");
      listItem.classList.add("expense-entry");
      listItem.innerHTML = `
      <div class="expense-details">
      <p><span class="label">Date:</span> <span class="value">${date}</span></p>
      <p><span class="label">Item:</span> <span class="value">${item}</span></p>
      <p><span class="label">Amount:</span> <span class="value">PKR ${amount.toFixed(2)}</span></p>
    </div>
    <div class="expense-actions">
      <button class="edit-button" data-index="${index}">Edit</button>
      <button class="delete-button" data-index="${index}">Delete</button>
    </div>
  `;
  expenseList.appendChild(listItem);
    });

    // Calculate and display the total amount
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    totalAmount.innerText = `PKR ${total.toFixed(2)}`;
  }


  // Load expenses when the page is rendered
  loadExpenses();

  // Add Expense Button Click Handler
  addExpenseButton.addEventListener("click", () => {
    const date = expenseDate.value;
    const item = expenseItem.value.trim();
    const amount = parseFloat(expenseAmount.value);

    if (!date || !item || isNaN(amount) || amount <= 0) {
      // Display an error message or provide feedback to the user
      return;
    }

    // Retrieve existing expenses from Local Storage
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (editMode) {
      // If in edit mode, update the existing expense
      if (editIndex >= 0 && editIndex < expenses.length) {
        expenses[editIndex] = { date, item, amount };
      }

      // Reset edit mode
      editMode = false;
      editIndex = -1;
    } else {
      // Add the new expense to the array
      expenses.push({ date, item, amount });
    }

    // Save the updated expenses array to Local Storage
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Clear input fields
    expenseDate.value = "";
    expenseItem.value = "";
    expenseAmount.value = "";

    // Update the expense list on the page
    updateExpenseList(expenses);

    // Show a success message
    Swal.fire("Added!", "The expense has been added.", "success");
  });

  // Edit and Delete Button Click Handlers
  expenseList.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("edit-button")) {
      const index = parseInt(target.getAttribute("data-index"));
      const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
      const expenseToEdit = expenses[index];

      // Populate input fields with existing data for editing
      expenseDate.value = expenseToEdit.date;
      expenseItem.value = expenseToEdit.item;
      expenseAmount.value = expenseToEdit.amount.toFixed(2);

      // Set edit mode and edit index
      editMode = true;
      editIndex = index;
    }

    if (target.classList.contains("delete-button")) {
      // Display a confirmation dialog using SweetAlert
      const index = parseInt(target.getAttribute("data-index"));
      Swal.fire({
        title: "Delete Expense",
        text: "Do you want to delete this expense?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // User confirmed, proceed with deletion
          const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
          expenses.splice(index, 1);

          // Save the updated expenses array to Local Storage
          localStorage.setItem("expenses", JSON.stringify(expenses));

          // Update the expense list on the page
          updateExpenseList(expenses);

          // Show a success message
          Swal.fire("Deleted!", "The expense has been deleted.", "success");
        }
      });
    }
  });
});
