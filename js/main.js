document.addEventListener("DOMContentLoaded", () => {
  async function initializeApp() {
    // --- DATA and STATE ---
    let employees = [];
    let nextId = 1;

    // --- FETCH DATA FROM JSON FILE ---
    try {
      const response = await fetch("employees.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      employees = await response.json();
      // Calculate the next ID based on the loaded data
      if (employees.length > 0) {
        nextId = Math.max(...employees.map((e) => e.id)) + 1;
      }
    } catch (error) {
      console.error("Could not fetch employee data:", error);
      // Display an error message to the user
      document.getElementById("employeeGrid").innerHTML =
        '<p class="error">Failed to load employee data. Please try again later.</p>';
      return; // Stop execution if data fails to load
    }

    // --- DOM ELEMENTS ---
    const employeeGrid = document.getElementById("employeeGrid");
    const modal = document.getElementById("employeeModal");
    const addEmployeeBtn = document.getElementById("addEmployeeBtn");
    const closeModalBtn = document.querySelector(".close-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const employeeForm = document.getElementById("employeeForm");
    const modalTitle = document.getElementById("modalTitle");
    const formSubmitBtn = document.getElementById("formSubmitBtn");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");
    const showSelect = document.getElementById("showSelect");
    // const filterToggleBtn = document.getElementById("filterToggleBtn");
    // const filterSidebar = document.getElementById("filterSidebar");
    const filterForm = document.getElementById("filterForm");

    // --- OFFCANVAS ---
    const sidebar = document.getElementById("filterSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const openBtn = document.getElementById("openSidebarBtn");
    const closeBtn = document.getElementById("closeSidebarBtn");

    function openSidebar() {
      sidebar.classList.add("open");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden"; // optional
    }

    function closeSidebar() {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
      document.body.style.overflow = ""; // reset
    }

    openBtn.addEventListener("click", openSidebar);
    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);

    // Optional: Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });

    // --- STATE ---
    let editingEmployeeId = null;
    let currentSort = "";
    let currentFilters = {};
    let currentPage = 1;
    let itemsPerPage = parseInt(showSelect.value);

    // --- RENDER FUNCTION ---
    // This function simulates the Freemarker template processing.
    function renderEmployees(employeeList) {
      employeeGrid.innerHTML = "";
      if (employeeList.length === 0) {
        employeeGrid.innerHTML = "<p>No employees found.</p>";
        return;
      }

      employeeList.forEach((employee) => {
        const card = document.createElement("div");
        card.className = "employee-card";
        card.dataset.id = employee.id;
        card.innerHTML = `
                <h3>${employee.firstName} ${employee.lastName}</h3>
                <p><strong>Email:</strong> ${employee.email}</p>
                <p><strong>Department:</strong> ${employee.department}</p>
                <p><strong>Role:</strong> ${employee.role}</p>
                <div class="employee-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
        employeeGrid.appendChild(card);
      });
    }

    function displayData() {
      let filteredEmployees = [...employees];

      // Apply Search
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp.firstName.toLowerCase().includes(searchTerm) ||
            emp.lastName.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm)
        );
      }

      // Apply Filters
      if (currentFilters.firstName) {
        filteredEmployees = filteredEmployees.filter((emp) =>
          emp.firstName
            .toLowerCase()
            .includes(currentFilters.firstName.toLowerCase())
        );
      }
      if (currentFilters.department) {
        filteredEmployees = filteredEmployees.filter(
          (emp) => emp.department === currentFilters.department
        );
      }
      if (currentFilters.role) {
        filteredEmployees = filteredEmployees.filter(
          (emp) => emp.role === currentFilters.role
        );
      }

      // Apply Sorting
      if (currentSort === "firstName") {
        filteredEmployees.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );
      } else if (currentSort === "department") {
        filteredEmployees.sort((a, b) =>
          a.department.localeCompare(b.department)
        );
      } else if (currentSort === "role") {
        filteredEmployees.sort((a, b) => a.role.localeCompare(b.role));
      }

      // Apply Pagination
      const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedEmployees = filteredEmployees.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      renderEmployees(paginatedEmployees); // Pass the final list to the render function
      renderPagination(totalPages);
    }

    // --- PAGINATION RENDER ---
    function renderPagination(totalPages) {
      const paginationControls = document.getElementById("paginationControls");
      paginationControls.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? "active" : "";
        pageBtn.addEventListener("click", () => {
          currentPage = i;
          displayData();
        });
        paginationControls.appendChild(pageBtn);
      }
    }

    // --- MODAL HANDLING ---
    function openModal(mode = "add", employee = null) {
      editingEmployeeId = mode === "edit" ? employee.id : null;
      modalTitle.textContent =
        mode === "add" ? "Add Employee" : "Edit Employee";
      formSubmitBtn.textContent = mode === "add" ? "Add" : "Save Changes";
      employeeForm.reset();

      if (mode === "edit") {
        document.getElementById("employeeId").value = employee.id;
        document.getElementById("firstName").value = employee.firstName;
        document.getElementById("lastName").value = employee.lastName;
        document.getElementById("email").value = employee.email;
        document.getElementById("department").value = employee.department;
        document.getElementById("role").value = employee.role;
      }
      modal.classList.add("active");
    }

    function closeModal() {
      modal.classList.remove("active");
    }

    // --- EVENT LISTENERS ---
    addEmployeeBtn.addEventListener("click", () => openModal("add"));
    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    searchInput.addEventListener("input", () => {
      currentPage = 1;
      displayData();
    });
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      displayData();
    });
    showSelect.addEventListener("change", (e) => {
      itemsPerPage = parseInt(e.target.value);
      currentPage = 1;
      displayData();
    });

    // filterToggleBtn.addEventListener("click", () =>
    //   filterSidebar.classList.toggle("active")
    // );

    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      currentFilters.firstName =
        document.getElementById("filterFirstName").value;
      currentFilters.department =
        document.getElementById("filterDepartment").value;
      currentFilters.role = document.getElementById("filterRole").value;
      currentPage = 1;
      displayData();
    });

    filterForm.addEventListener("reset", () => {
      currentFilters = {};
      currentPage = 1;
      filterForm.reset(); // Also reset the form fields visually
      displayData();
    });

    // --- FORM SUBMISSION (ADD/EDIT) ---
    employeeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic Validation
      const firstName = document.getElementById("firstName").value.trim();
      if (!firstName) {
        alert("First Name is required.");
        return;
      }

      const employeeData = {
        id: editingEmployeeId || nextId++,
        firstName: firstName,
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value,
        role: document.getElementById("role").value.trim(),
      };

      if (editingEmployeeId) {
        // Edit existing employee
        employees = employees.map((emp) =>
          emp.id === editingEmployeeId ? employeeData : emp
        );
      } else {
        // Add new employee
        employees.push(employeeData);
      }

      displayData();
      closeModal();
    });

    // --- EVENT DELEGATION FOR EDIT/DELETE ---
    employeeGrid.addEventListener("click", (e) => {
      const target = e.target;
      const card = target.closest(".employee-card");
      if (!card) return;

      const employeeId = parseInt(card.dataset.id);

      if (target.classList.contains("edit-btn")) {
        const employeeToEdit = employees.find((emp) => emp.id === employeeId);
        openModal("edit", employeeToEdit);
      }

      if (target.classList.contains("delete-btn")) {
        if (confirm("Are you sure you want to delete this employee?")) {
          employees = employees.filter((emp) => emp.id !== employeeId);
          displayData();
        }
      }
    });

    // --- INITIAL RENDER ---
    displayData();
  }

  // --- START THE APP ---
  initializeApp();
});
