if (localStorage.getItem("token") === null) {
  window.location.href= "/login";
}
$(document).ready(function(){
  $("#username").text(` ${sessionStorage.getItem("user")}`);
  $("#Email").text(`${sessionStorage.getItem("email")}`);
  $("#role").text(` ${sessionStorage.getItem("role")}`);
});
function logout() {
  localStorage.removeItem("token");
  sessionStorage.clear()
  window.location.href= "/";
  }

  $(document).ready(function(){

    if (sessionStorage.getItem("role")==="admin"){

        $("#device").css("display","flex");

        $("#device").css("display","flex");

    }

});
