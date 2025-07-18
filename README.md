# Tacnique-Assignment Employee Directory UI

This project is a responsive Employee Directory web interface built with HTML, CSS, and vanilla JavaScript, following the requirements of the frontend assignment.

## Project Overview

The application allows users to view, add, edit, delete, search, filter, and sort a list of employees. All data is handled on the client-side without a backend. The UI is designed to be clean, user-friendly, and responsive across various devices.

## Project Structure

- `/index.html`: Main application page.
- `/css/styles.css`: All application styles.
- `/js/main.js`: Core JavaScript logic for data handling and interactivity.
- `/templates/employee-list.ftl`: Freemarker-style template for an employee card (processed via JS).

## Setup and Run Instructions

1.  Clone the repository: `git clone https://github.com/MayurDange15/Tacnique-Assignment.git`
2.  Navigate to the project directory: `cd Tacnique-Assignment`
3.  Open the `index.html` file in your web browser. No special build tools or servers are required.

## Challenges Faced and Improvements

**Challenges:**

- **Simulating Freemarker:** Since Freemarker is a server-side technology, the main challenge was to replicate its templating functionality on the client-side. I addressed this by using JavaScript template literals to dynamically generate HTML from the data array, which achieves the same goal of separating data from presentation logic.
- **State Management:** Managing the state (current page, filters, sort order) in vanilla JavaScript required careful organization to ensure all components updated correctly after any user action.

**Future Improvements:**

- **Component-Based Architecture:** If given more time, I would refactor the JavaScript into smaller, reusable modules or components for better maintainability.
- **Advanced Validation:** I would implement more robust, real-time validation on the input fields, providing instant feedback to the user.
- **URL-based State:** I would store the current filter, sort, and page state in the URL query parameters so the view can be shared and bookmarked.
