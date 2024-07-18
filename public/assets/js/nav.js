// Logout
const logoutElement = document.getElementById("logout");
logoutElement.addEventListener('click', logout);

async function logout(){
    const response = await fetch(`${API_URL}/user/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
        },
        credentials: 'include',
    });
    if (response.ok) {
        sessionStorage.removeItem("accessToken")
        window.location = '/';
    } else {
        const errorData = await response.text();
        console.log(`Error: ${errorData}`);
    }
}



// Navigation Bar
function toggleDropdown() {
    const dropdownContent = document.getElementById("dropdownContent");
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
}
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-icon')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const dropdown = dropdowns[i];
            if (dropdown.style.display === "block") {
                dropdown.style.display = "none";
            }
        }
    }
}