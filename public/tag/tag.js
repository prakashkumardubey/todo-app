// const API_URL = "http://localhost:8000/api/v1";
// const API_URL = "https://todo-d3fd.onrender.com/api/v1";
import { API_URL } from "../assets/constant.js";

let tagsArray = [];

// Fetch all tags from the API
async function fetchTags() {
  try {
    const response = await fetch(`${API_URL}/tag/fetch-all`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
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

// Display tags in the container
function displayTags() {
  const container = document.getElementById("tagContainer");
  container.innerHTML = "";
  tagsArray.forEach((tag, index) => {
    container.innerHTML += createTagCard(tag, index);
  });
}

// Create individual tag card HTML
function createTagCard(tag, index) {
  return `
    <div class="tag-card" id="tag${index}">
        <h3>${tag.name}</h3>
        <p>${tag.description}</p>
        <div class="tag-actions">
            <button onclick="editTag(${index})"><i class="fas fa-edit"></i></button>
            <button onclick="deleteTag(${index})"><i class="fas fa-trash-alt"></i></button>
        </div>
    </div>`;
}

// Add a new tag
async function addTag() {
  const name = document.getElementById("tagName").value;
  const description = document.getElementById("tagDescription").value;
  const data = { name, description };

  try {
    const response = await fetch(`${API_URL}/tag/create`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      showMessage(responseData.message);

      fetchTags();
      clearForm();
    }else{
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  } catch (error) {
    showMessage("Failed to add tag.");
  }
}

// Edit a tag
async function editTag(index) {
  const tag = tagsArray[index];
  const tagCard = document.getElementById(`tag${index}`);
  const nameElement = tagCard.querySelector("h3");
  const descriptionElement = tagCard.querySelector("p");

  const nameInput = createInputField(tag.name);
  const descriptionInput = createInputField(tag.description);

  nameElement.replaceWith(nameInput);
  descriptionElement.replaceWith(descriptionInput);

  const editButton = tagCard.querySelector(".tag-actions button:nth-child(1)");
  editButton.innerHTML = '<i class="fas fa-save"></i>';
  editButton.onclick = async () => {
    const newName = nameInput.value.trim();
    const newDescription = descriptionInput.value.trim();
    
    if (newName === "") {
      showMessage("Title cannot be empty.");
      return;
    }
    const updatedFields = {};
    
    if (newName !== tag.name) {
      updatedFields.name = newName;
    }

    if (newDescription !== tag.description) {
      updatedFields.description = newDescription;
    }

    if (Object.keys(updatedFields).length > 0) {
      await updateTag(index, updatedFields);
    } else {
      showMessage("No changes detected.");
      fetchTags();
    }
  }
}

// Helper function to create input fields for editing
function createInputField(value) {
  const input = document.createElement("input");
  input.value = value;
  return input;
}

// Update a tag
async function updateTag(index, data) {

  try {
    const response = await fetch(`${API_URL}/tag/update/${tagsArray[index]._id}`, {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      showMessage(responseData.message);

      fetchTags();
    }else{
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  } catch (error) {
    showMessage("Failed to update tag.");
  }
}

// Delete a tag
async function deleteTag(index) {
  try {
    const response = await fetch(`${API_URL}/tag/delete/${tagsArray[index]._id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    if (response.ok) {
      const responseData = await response.json();
      showMessage(responseData.message);

      fetchTags();
    }else{
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  } catch (error) {
    showMessage("Failed to delete tag.");
  }
}

// Clear form fields
function clearForm() {
  document.getElementById("tagName").value = "";
  document.getElementById("tagDescription").value = "";
}

// Helper function to get headers with authorization token
function getHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };
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

// Show message to the user
function showMessage(message) {
  const messageBox = document.getElementById("messageBox");
  const messageText = document.getElementById("messageText");

  messageText.textContent = message;
  messageBox.style.display = "block";
  messageBox.offsetHeight;
  messageBox.style.opacity = "1";

  setTimeout(() => {
    messageBox.style.opacity = "0";
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 300);
  }, 1000);
}

// Initial display of tags
fetchTags();
