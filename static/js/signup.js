
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
})

// let captchaText = document.getElementById('captcha');
// var ctx = captchaText.getContext("2d");

// let userText = document.getElementById('textBox');
// let submitButton = document.getElementById('submitButton');
// let output = document.getElementById('output');

    // captcha generator
    function generateCaptcha() {
      const captchaElement = document.getElementById('captcha');
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let captcha = '';

      for (let i = 0; i < 6; i++) {
          captcha += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      captchaElement.textContent = captcha;
  }

  // Initial captcha generation
  generateCaptcha();

  // Button click event for captcha generation
  document.getElementById('refreshButton').addEventListener('click', function () {
      generateCaptcha();
  });




// function displayAccessToken(token) {
//   const tokenDisplay = document.getElementById("token-display");
//   tokenDisplay.innerHTML = "<h3>Access Token:</h3><pre>" + token + "</pre>";
// }





async function handleLogin(event) {
  event.preventDefault();
  const user=document.getElementById("captcha").textContent;;
  const used=document.getElementById("textBox").value;
  // console.log(user,used,"before if");
  if(user !== used){
   alert("incorrect captcha");
   return;
  }
  const form = new FormData();
  const email = document.querySelector(".sign-in-form input[name='email']").value;
  const password = document.querySelector(".sign-in-form input[name='password']").value;
  const captcha = document.getElementById('textBox').value;
  form.append("email", email);
  form.append("password", password);
  form.append("captcha", captcha);
  const response = await fetch("/login", {
    method: "POST",
    body: form
  });
  console.log("before data", response);
  if (response.ok) {
    const data = await response.json();
    // console.log(data, "im in data");
    localStorage.setItem("token", data.token);
    sessionStorage.setItem("user", data.user);
    sessionStorage.setItem("email", data.email);
    // console.log(email)
    sessionStorage.setItem("role", data.role);
    window.location.href = "/Dashboard";
  } else {
    alert("Invalid email or password!");
  }
}

document.querySelector(".sign-in-form").addEventListener("submit", handleLogin);
window.addEventListener('DOMContentLoaded', (event) => {
  const message = document.getElementById('message');
  if (message) {
    setTimeout(() => {
      message.style.display = 'none';
    }, 5000);
  }
  const sign_in_btn = document.querySelector("#sign-in-btn");
});

function togglePassword(inputId) {
  var element = document.getElementById(inputId);
  element.type === "password" ? element.type = "text" : element.type = "password";
}

function validatePassword() {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  if (password != confirmPassword) {
    document.getElementById("message").innerHTML = "Passwords do not match";

    setTimeout(function () {
      document.getElementById("message").innerHTML = "";
    }, 7000);
    return false;
  }
  return true;
}

function validateForm() {
  let email = document.getElementById("email").value;
  let exists = checkEmailExists(email);
  if (exists) {
    document.getElementById("emailExistsMessage").style.display = "block";
    return false;
  }
  return true;
}

// $(document).ready(function () {
//   $("#signup_submit").on("click",function(event) {

//   const form = new FormData();
//   form.append("name",$("#username").val());
//   form.append("email",$("#email").val());
//   form.append("password",$("#signup-password").val());
//   form.append("confirmpassword",$("#confirmPassword").val());
  

//     event.preventDefault();
//   fetch("/signup", {
//       method: "POST",
//       body:form,
      
//   }).then(response => {
//       return response.json();
//     }).then(data => {
//       alert(data.message);
//     }).catch(error => {
//       $("#message").text(error);
//     })
//   })
//       });
$(document).ready(function () {
  $("#signup_submit").on("click", function (event) {
      const form = new FormData();
      form.append("name", $("#username").val());
      form.append("email", $("#email").val());
      form.append("password", $("#signup-password").val());
      form.append("confirmpassword", $("#confirmPassword").val());

      event.preventDefault();
      fetch("/signup", {
          method: "POST",
          body: form,
      }).then(response => {
          return response.json();
      }).then(data => {
          alert(data.message);
          // Reset the form fields after successful submission
          $("#signup-form")[0].reset();
      }).catch(error => {
          $("#message").text(error);
      });
  });
});
