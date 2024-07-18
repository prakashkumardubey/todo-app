// const API_URL = "http://localhost:8000/api/v1";
// const API_URL = "https://todo-d3fd.onrender.com/api/v1";
import { API_URL } from "../../assets/constant.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("changePasswordForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    // Simple password length validation
    if (newPassword.length < 4) {
      showMessage("New password must be at least 4 characters long.");
      return;
    }

    changePassword(oldPassword, newPassword);

    form.reset();
  });

  async function changePassword(oldPassword, newPassword) {
    const data = {
      oldPassword,
      newPassword,
    };
    const response = await fetch(`${API_URL}/user/change-password`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const responseData = await response.json();
      showMessage(responseData.message)
      sessionStorage.removeItem("accessToken")

      setTimeout(function () {
        window.location.href = "/";
      }, 1000);

    } else {
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  }

  // function showMessage(message, type) {
  //     const messageDiv = document.getElementById('message');
  //     messageDiv.innerHTML = message;
  //      messageBox.className = `message ${type}`;

  //     messageDiv.style.display = 'block';

  //     // Hide message after 5 seconds
  //     setTimeout(function() {
  //         messageDiv.style.display = 'none';
  //     }, 5000);
  // }
});

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
