// const API_URL = "http://localhost:8000/api/v1";
// const API_URL = "https://todo-d3fd.onrender.com/api/v1";
import { API_URL } from "../../assets/constant.js";

let userData = {
    fullName: "",
    email: ""
};
async function fetchProfile() {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    if (response.ok) {
      const responseData = await response.json();
      userData = responseData.data;
      displayProfile();
    } else {
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  } catch (error) {
    showMessage("Failed to fetch profile.");
  }
}

function displayProfile() {
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  // const profileImg = document.getElementById('profileImg');

  fullNameInput.value = userData.fullName;
  emailInput.value = userData.email;
  // profileImg.src = userData.profile;
}

document.addEventListener("DOMContentLoaded", () => {
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const saveBtn = document.getElementById("saveBtn");
  // const photoUpload = document.getElementById('photoUpload')

  fullNameInput.addEventListener("input", handleInputChange);
  emailInput.addEventListener("input", handleInputChange);
  // photoUpload.addEventListener('change', handleInputChange);

  function handleInputChange() {
    const updatedUserData = {
      fullName: fullNameInput.value,
      email: emailInput.value,
    };

    const hasChanges = Object.keys(updatedUserData).some(key => updatedUserData[key] !== userData[key]);
    // const hasNewPhoto = photoUpload.files.length > 0;

    if (hasChanges) {
      saveBtn.style.display = "block";
    } else {
      saveBtn.style.display = "none";
    }
  }

  saveBtn.addEventListener("click", () => {

    const newFullName = fullNameInput.value.trim();
    const newEmail = emailInput.value.trim();

    if (email === "") {
      showMessage("Email cannot be empty.");
      return;
    }
    const updatedFields = {};

    if (newFullName !== userData.fullName) {
      updatedFields.fullName = newFullName;
    }

    if (newEmail !== userData.email) {
        updatedFields.email = newEmail;
    }

    if (Object.keys(updatedFields).length > 0) {
        updateUserData(updatedFields);
        saveBtn.style.display = 'none';
    } else {
      showMessage("No changes detected.");
    }
  });

  async function updateUserData(data) {
    try {
      const response = await fetch(`${API_URL}/user/update`, {
        method: "PATCH",
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        showMessage(responseData.message);
        userData = data;
        saveBtn.style.display = 'none';
      }else {
        const errorData = await response.text();
        const errorMessage = extractErrorMessage(errorData);
        showMessage(errorMessage);
      }
    } catch (error) {
      showMessage("Failed to update profile.");
    }
  }

  // photoUpload.addEventListener('change', () => {
  //     const file = photoUpload.files[0];
  //     if (file) {
  //         // Update user photo (Assuming photo is sent to a different API)
  //         updatePhoto(file);
  //     }
  // });

  // function updatePhoto(file) {
  //     const formData = new FormData();
  //     formData.append('photo', file);

  //     // Mock API call to update user photo
  //     // Replace this with actual API call
  //     console.log("Photo Uploaded:", file.name);
  //     profileImg.src = URL.createObjectURL(file); // Update profile picture preview
  //     alert('Photo uploaded successfully!');

  //     // Hide "Save Changes" button
  //     saveBtn.style.display = 'none';
  // }
});

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

// Message
function showMessage(message) {
  var messageBox = document.getElementById("messageBox");
  var messageText = document.getElementById("messageText");

  messageText.textContent = message;
  messageBox.style.display = "block";
  messageBox.offsetHeight;
  messageBox.style.opacity = "1";

  setTimeout(function () {
    messageBox.style.opacity = "0";
    setTimeout(function () {
      messageBox.style.display = "none";
    }, 300);
  }, 1000);
}

fetchProfile();
