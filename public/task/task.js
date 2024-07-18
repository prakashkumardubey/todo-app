// const API_URL = "http://localhost:8000/api/v1";
// const API_URL = "https://todo-d3fd.onrender.com/api/v1";
import { API_URL } from "../assets/constant.js";

let tasksArray = [];
let tagsArray = [];

// Fetch all tags from the API
async function fetchTags() {
  try {
    const response = await fetch(`${API_URL}/tag/fetch-all`, {
      method: "GET",
      headers: getHeaders(),
      credentials: 'include',
    });

    if (response.ok) {
      const responseData = await response.json();
      tagsArray = responseData.data;
      displayTags();
    } else {
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  } catch (error) {
    showMessage("Failed to fetch tags.");
  }
}

// Display tags in the dropdown
function displayTags() {
  const tagsDropdown = document.getElementById("tags");
  tagsArray.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag._id;
    option.textContent = tag.name;
    tagsDropdown.appendChild(option);
  });
}

// Add a new task
async function addTask() {
  const taskData = collectTaskData();

  try {
    const response = await fetch(`${API_URL}/task/create`, {
      method: "POST",
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(taskData),
    });

    
    if (response.ok) {
      const responseData = await response.json();
      showMessage(responseData.message);
      await displayTasks();
      clearForm();
    }else {
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  } catch (error) {
    showMessage("Failed to add task.");
  }
}

// Collect task data from form
function collectTaskData() {
  return {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    dueDate: document.getElementById("dueDate").value,
    priority: document.getElementById("priority").value,
    tag: document.getElementById("tags").value,
  };
}

// Display all tasks
async function displayTasks() {
  try {
    const response = await fetch(`${API_URL}/task/fetch-all`, {
      method: "GET",
      headers: getHeaders(),
      credentials: 'include',
    });

    if (response.ok) {
      const responseData = await response.json();
      tasksArray = responseData.data;
      renderTasks();
    }else {
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  } catch (error) {
    showMessage("Failed to fetch tasks.");
  }
}

// Render tasks in the UI
function renderTasks() {
  const container = document.getElementById("taskContainer");
  container.innerHTML = "";

  tasksArray.forEach((task, index) => {
    const taskCard = createTaskCard(task, index);
    container.innerHTML += taskCard;
  });
}

// Create task card HTML
function createTaskCard(task, index) {
  const currentDate = new Date();
  const dueDate = new Date(task.dueDate);
  const isDueTodayOrPassed = dueDate <= currentDate;
  const statusClass = task.status === "completed" ? "completed" : "";

  let cautionSymbol = "";
  if (isDueTodayOrPassed && task.status !== "completed") {
    cautionSymbol = '<span style="margin-left: 10px;" title="Due date passed">⚠️</span>';
  }

  return `
    <div class="task-card ${statusClass}" id="task${index}">
      <h3>${task.title}${cautionSymbol}</h3>
      <p>${task.description}</p>
      <p><strong>Due Date:</strong> ${task.dueDate}</p>
      <p><strong>Priority:</strong> <span class="status ${task.priority}">${task.priority}</span></p>
      <p><strong>Tags:</strong> ${findTagNameById(task.tag)}</p>
      <p><strong>Status:</strong> ${task.status}</p>
      <p><strong>Created At:</strong> ${new Date(task.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> ${new Date(task.updatedAt).toLocaleString()}</p>
      <div class="edit-delete">
        <button onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="deleteTask(${index})"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>`;
}

// Helper function to find tag name by ID
function findTagNameById(tagId) {
  const tag = tagsArray.find(tag => tag._id === tagId);
  return tag ? tag.name : 'No Tag';
}

// Edit a task
function editTask(index) {
  const task = tasksArray[index];
  const taskCard = document.getElementById(`task${index}`);

  const elements = {
    title: taskCard.querySelector("h3"),
    description: taskCard.querySelector("p:nth-child(2)"),
    dueDate: taskCard.querySelector("p:nth-child(3)"),
    priority: taskCard.querySelector("p:nth-child(4)"),
    tag: taskCard.querySelector("p:nth-child(5)"),
    status: taskCard.querySelector("p:nth-child(6)"),
  };

  replaceWithInput(elements.title, "text", task.title);
  replaceWithInput(elements.description, "textarea", task.description);
  replaceWithInput(elements.dueDate, "date", task.dueDate);
  replaceWithSelect(elements.priority, ["low", "medium", "high"], task.priority);
  replaceWithSelect(elements.tag, tagsArray.map(tag => tag.name), findTagNameById(task.tag));
  replaceWithSelect(elements.status, ["pending", "completed"], task.status);

  const editButton = taskCard.querySelector(".edit-delete button:nth-child(1)");
  editButton.innerHTML = '<i class="fas fa-save"></i>';
  editButton.onclick = async () => await updateTask(index);
}

// Replace element with input or select
function replaceWithInput(element, type, value) {
  const input = document.createElement("input");
  input.type = type;
  if (type === "date" && value) {
    const dateValue = new Date(value).toISOString().split('T')[0]; // Convert date to "YYYY-MM-DD" format
    input.value = dateValue;
  } else {
    input.value = value;
  }
  element.innerHTML = "";
  element.appendChild(input);
}

function replaceWithSelect(element, options, selected) {
  const select = document.createElement("select");
  options.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    if (option === selected) {
      optionElement.selected = true;
    }
    select.appendChild(optionElement);
  });
  element.innerHTML = "";
  element.appendChild(select);
}

// Update a task
async function updateTask(index) {
  const tagId = findTagIdByName(document.querySelector("#taskContainer #task" + index + " p:nth-child(5) select").value)
  console.log(tagId)
  const taskData = {
    title: document.querySelector("#taskContainer #task" + index + " h3 input").value,
    description: document.querySelector("#taskContainer #task" + index + " p:nth-child(2) input").value,
    dueDate: document.querySelector("#taskContainer #task" + index + " p:nth-child(3) input").value,
    priority: document.querySelector("#taskContainer #task" + index + " p:nth-child(4) select").value,
    tag: tagId,
    status: document.querySelector("#taskContainer #task" + index + " p:nth-child(6) select").value,
  };

  try {
    const response = await fetch(`${API_URL}/task/update/${tasksArray[index]._id}`, {
      method: "PATCH",
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(taskData),
    });


    if (response.ok) {
      const responseData = await response.json();
      showMessage(responseData.message);
      await displayTasks();
    }else {
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  } catch (error) {
    showMessage("Failed to update task.");
  }
}

function findTagIdByName(tagName) {
  const tag = tagsArray.find(tag => tag.name === tagName);
  return tag ? tag._id : '';
}

// Delete a task
async function deleteTask(index) {
  try {
    const response = await fetch(`${API_URL}/task/delete/${tasksArray[index]._id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: 'include',
    });


    if (response.ok) {
      const responseData = await response.json();
      showMessage(responseData.message);
      await displayTasks();
    }else {
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  } catch (error) {
    showMessage("Failed to delete task.");
  }
}

// Clear form fields
function clearForm() {
  const formFields = ["title", "description", "dueDate", "priority", "tags"];
  formFields.forEach(field => {
    document.getElementById(field).value = "";
  });
}

// Helper function to get headers with authorization token
function getHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
  };
}

// Display a message to the user
function showMessage(message) {
  const messageBox = document.getElementById("messageBox");
  const messageText = document.getElementById("messageText");

  messageText.textContent = message;
  messageBox.style.display = "block";
  messageBox.offsetHeight;  // Trigger reflow to enable transition
  messageBox.style.opacity = "1";

  setTimeout(() => {
    messageBox.style.opacity = "0";
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 500);  // Wait for transition to complete
  }, 4000);  // 1000 milliseconds = 1 second
}

function extractErrorMessage(htmlContent) {
  const startIndex = htmlContent.indexOf('<pre>') + 5;
  const endIndex = htmlContent.indexOf('</pre>');
  
  if (startIndex === -1 || endIndex === -1) {
    return 'Error message not found';
  }

  const errorMessage = htmlContent.substring(startIndex, endIndex);
  const mainMessage = errorMessage.split('<br>')[0];

  return mainMessage;
}

// Initial display of tasks and tags
displayTasks();
fetchTags();
