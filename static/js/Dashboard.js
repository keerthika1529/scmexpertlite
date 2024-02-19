var slides = document.querySelectorAll(".slideshow img");
var currentSlide = 0;
var welcomeText = document.getElementById('welcomeText');

function showSlide(index) {
    // Hide all slides
    slides.forEach(function (slide) {
        slide.classList.remove("active");
    });+
    // Show the selected slide
    slides[index].classList.add("active");

    // Update welcome text
    var texts = ["Hi Buddy!", "Welcome To SCMXPerLite", "Hi buddy!Welcome to SCMXPerLite"];
    welcomeText.textContent = texts[index];
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Show the first slide initially
showSlide(currentSlide);

// Start the slideshow
var slideshowInterval = setInterval(nextSlide, 3000);

// Add animation class to welcome text
setTimeout(function () {
    welcomeText.classList.add('show-animation');
}, 1000); // Adjust the delay as needed

// logout
function logout() {
localStorage.removeItem("token");
window.location.href= "/";
// You can add more cleanup here if needed
}

if (localStorage.getItem("token") === null) {
window.location.href = "/";
}