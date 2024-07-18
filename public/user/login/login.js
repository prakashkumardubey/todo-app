import { API_URL } from "../../assets/constant.js";
console.log(API_URL,"api");

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const data = {
            email: form.email.value,
            password: form.password.value
        }

        if (data.password.length < 4) {
            showMessage("Password must be at least 4 characters long.");
            return;
        }

        const response = await fetch(`${API_URL}/user/login`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
        )

        if (response.ok) {
            const responseData = await response.json();
            sessionStorage.setItem("accessToken", responseData.data.token);

            showMessage(responseData.message)
            
            setTimeout(()=>{
                window.location.href = '../../task';
            },5000)

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
