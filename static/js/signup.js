    // Your existing JavaScript code
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");
 
    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
 
    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
 
    // Your existing captcha code
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
        // Do something when captcha is correct
      } else {
        output.className = "incorrectCaptcha";
        output.innerHTML = "Incorrect, please try again!";
        // Do something when captcha is incorrect
      }
    }
 
    // To generate the CAPTCHA text
    ctx.font = "50px Roboto";  // Increase font size
    ctx.fillStyle = "#1a1a1a";  // Change text color
 
    // ...
 
    generate_captcha();
    function togglePassword(inputId) {
        const passwordInput = document.getElementById(inputId);
        const eyeIcon = document.querySelector(`#${inputId} + .toggle-password`);

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.className = "toggle-password fas fa-eye-slash";
            setTimeout(() => {
                passwordInput.type = "password";
                eyeIcon.className = "toggle-password fas fa-eye";
            }, 2000);
        } else {
            passwordInput.type = "password";
            eyeIcon.className = "toggle-password fas fa-eye";
        }
    }
    function displayAccessToken(token) {
        const tokenDisplay = document.getElementById("token-display");
        tokenDisplay.innerHTML = "<h3>Access Token:</h3><pre>" + token + "</pre>";
    }

    // Function to handle login form submission
    async function handleLogin(event) {
        event.preventDefault();
        const form = new FormData();
        
        const email = document.querySelector(".sign-in-form input[name='email']").value;
        const password = document.querySelector(".sign-in-form input[name='password']").value;
        form.append("email", email);
        form.append("password", password);

        const response = await fetch("/login", {
            method: "POST",
            body: form
        });
        // const response1 = response.json();
        console.log("before data",response);
        if (response.ok) {
          const data = await response.json();
          console.log(data,"im in data");
            // Store access token in local storage
            localStorage.setItem("token", data.token);
            sessionStorage.setItem("user", data.user);
            sessionStorage.setItem("email",data.email);
            console.log(email)
            sessionStorage.setItem("role",data.role);
            window.location.href = "/Dashboard";
            // Display the access token
            //displayAccessToken(data.access_token);

            // Redirect to the dashboard
            // window.location.href = data.redirect_url;
        } else {
            // Handle invalid login
            alert("Invalid email or password!");
        }
    }

    // Attach event listener to the login form
    document.querySelector(".sign-in-form").addEventListener("submit", handleLogin);
    
// Your existing JavaScript code
window.addEventListener('DOMContentLoaded', (event) => {
    // Your existing code for showing messages
    const message = document.getElementById('message');
    if (message) {
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    }

    // Rest of your JavaScript code...
    const sign_in_btn = document.querySelector("#sign-in-btn");
    // Rest of your JavaScript code...
});
function togglePassword(id) {
  var element = document.getElementById(id);
  element.type === "password" ? element.type = "text" : element.type = "password";
}
function togglePassword(id) {
var element = document.getElementById(id);
var eyeIcon = document.querySelector(`#${id} + .toggle-password`);

if (element.type === "password") {
element.type = "text";
eyeIcon.classList.remove("fa-eye");
eyeIcon.classList.add("fa-eye-slash");

// Hide the password after 5 seconds
setTimeout(function () {
  element.type = "password";
  eyeIcon.classList.remove("fa-eye-slash");
  eyeIcon.classList.add("fa-eye");
}, 5000);
} else {
element.type = "password";
eyeIcon.classList.remove("fa-eye-slash");
eyeIcon.classList.add("fa-eye");
}
}
function validatePassword() {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  if (password != confirmPassword) {
      document.getElementById("message").innerHTML = "Passwords do not match";
      setTimeout(function () {
          document.getElementById("message").innerHTML = "";
      }, 5000);
      return false;
  }
  return true;
}
function validateForm() {
  // Check if the email already exists
  let email = document.getElementById("email").value;
  let exists = checkEmailExists(email); // Assume checkEmailExists is a function that checks if the email exists

  // Show the popup message if the email already exists
  if (exists) {
    document.getElementById("emailExistsMessage").style.display = "block";
    return false; // Prevent form submission
  }

  return true; // Allow form submission
}