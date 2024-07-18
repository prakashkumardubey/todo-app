import { API_URL } from "../../assets/constant.js";


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const data = {
      fullName: form.fullName.value,
      email: form.email.value,
      password: form.password.value,
    };

    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      showMessage(responseData.message)
      
      setTimeout(() => {
        showMessage(`Please Login`)
      }, 2000);
      setTimeout(() => {
        window.location.href = "../login";
      }, 4000);

    } else {
      const errorData = await response.text();
      const errorMessage = extractErrorMessage(errorData);
      showMessage(errorMessage);
    }
  });
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
  var messageBox = document.getElementById('messageBox');
  var messageText = document.getElementById('messageText');

  messageText.textContent = message;
  messageBox.style.display = 'block';
  messageBox.offsetHeight;
  messageBox.style.opacity = '1';

  setTimeout(function() {
      messageBox.style.opacity = '0';
      setTimeout(function() {
          messageBox.style.display = 'none';
      }, 300);
  }, 1000);
}
