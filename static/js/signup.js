
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
})

let captchaText = document.getElementById('captcha');
var ctx = captchaText.getContext("2d");

let userText = document.getElementById('textBox');
let submitButton = document.getElementById('submitButton');
let output = document.getElementById('output');
let refreshButton = document.getElementById('refreshButton');
var captchaStr = "";
let alphaNums = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
  'c', 'd', 'e', 'f', 'g', 'h', 'i',

  'j', 'k', 'l', 'm', 'n', 'o', 'p',
  'q', 'r', 's', 't', 'u', 'v', 'w',
  'x', 'y', 'z', '0', '1', '2', '3',
  '4', '5', '6', '7', '8', '9'];
function generate_captcha() {
  let emptyArr = [];

  for (let i = 1; i <= 7; i++) {
    emptyArr.push(alphaNums[Math.floor(Math.random() * alphaNums.length)]);
  }
  captchaStr = emptyArr.join('');
  ctx.clearRect(0, 0, captchaText.width, captchaText.height);
  ctx.fillText(captchaStr, captchaText.width / 4, captchaText.height / 2);
  output.innerHTML = "";
}
generate_captcha();
submitButton.addEventListener('click', function () {
  check_captcha();
});
refreshButton.addEventListener('click', function (event) {
  generate_captcha();
  event.preventDefault();
});
function check_captcha() {
  if (userText.value === captchaStr) {
    output.className = "correctCaptcha";
    output.innerHTML = "Correct!";
  } else {
    output.className = "incorrectCaptcha";
    output.innerHTML = "Incorrect, please try again!";
  }
}
ctx.font = "50px Roboto";
ctx.fillStyle = "#1a1a1a";
generate_captcha();

function displayAccessToken(token) {
  const tokenDisplay = document.getElementById("token-display");
  tokenDisplay.innerHTML = "<h3>Access Token:</h3><pre>" + token + "</pre>";
}

async function handleLogin(event) {
  event.preventDefault();
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
    console.log(data, "im in data");
    localStorage.setItem("token", data.token);
    sessionStorage.setItem("user", data.user);
    sessionStorage.setItem("email", data.email);
    console.log(email)
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