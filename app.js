const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const filterPriority = document.getElementById("filterPriority");

const baseUrl = "http://localhost:5000/api/tasks";

// Fetch and Render Tasks
async function fetchTasks() {
    const filter = filterPriority.value;
    const response = await fetch(baseUrl);
    let tasks = await response.json();

    if (filter !== "all") {
        tasks = tasks.filter(task => task.priority === filter);
    }

    renderTasks(tasks);
}

// Render Tasks
function renderTasks(tasks) {
    taskList.innerHTML = ""; // Clear the task list before rendering

    tasks.forEach(task => {
        // Create a list item for the task
        const li = document.createElement("li");
        li.textContent = `${task.description} (${task.priority})`;
        li.classList.add(task.priority);

        // Apply line-through style if the task is completed
        if (task.completed) {
            li.style.textDecoration = "line-through";
        }

        // Create and configure the Complete button
        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.addEventListener("click", async () => {
            try {
                // Toggle task completion in the backend
                await fetch(`${baseUrl}/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed: !task.completed }),
                });

                // Refresh the task list
                fetchTasks();
            } catch (error) {
                console.error("Error updating task:", error);
                alert("Failed to update task. Please try again.");
            }
        });

        // Create and configure the Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
            try {
                // Remove the task from the backend
                await fetch(`${baseUrl}/${task._id}`, { method: "DELETE" });

                // Refresh the task list
                fetchTasks();
            } catch (error) {
                console.error("Error deleting task:", error);
                alert("Failed to delete task. Please try again.");
            }
        });

        // Append the buttons to the list item
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        // Add the list item to the task list
        taskList.appendChild(li);
    });
}

// Add Task
addTaskButton.addEventListener("click", async () => {
    const taskDescription = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (!taskDescription) {
        alert("Task cannot be empty!");
        return;
    }

    await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: taskDescription, priority, completed: false }),
    });

    taskInput.value = "";
    fetchTasks();
});

// Filter Tasks
filterPriority.addEventListener("change", fetchTasks);

// Initialize
fetchTasks();
