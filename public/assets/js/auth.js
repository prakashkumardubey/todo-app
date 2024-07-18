// Function to check if a cookie exists
function checkCookie(name) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  var found = sessionStorage.getItem(name);
  if (match || found) {
    return true;
  } else {
    return false;
  }
}
const currentPath = window.location.pathname;

if (!checkCookie("accessToken")) {
  if (!currentPath.includes('/user/login') && !currentPath.includes('/user/register')) {
    window.location.href = "/user/login";
  }
} else {
  if (currentPath.includes('/user/login') || currentPath.includes('/user/register')) {
    window.location.href = "/task";
  }
}
