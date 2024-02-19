if (localStorage.getItem("token") === null) {
  window.location.href= "/login";
}
$(document).ready(function(){
  $("#username").text(` ${sessionStorage.getItem("user")}`);
  $("#Email").text(`${sessionStorage.getItem("email")}`);
  $("#role").text(` ${sessionStorage.getItem("role")}`);
});
