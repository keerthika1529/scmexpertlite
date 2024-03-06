var slides = document.querySelectorAll(".slideshow img");
var currentSlide = 0;
var welcomeText = document.getElementById('welcomeText');

function showSlide(index) {
    slides.forEach(function (slide) {
        slide.classList.remove("active");
    });+
    slides[index].classList.add("active");
    var texts = ["Hi Buddy!", "Welcome To SCMXPertLite", "Hi buddy!Welcome to SCMXPertLite"];
    welcomeText.textContent = texts[index];
}
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

showSlide(currentSlide);
var slideshowInterval = setInterval(nextSlide, 3000);

setTimeout(function () {
    welcomeText.classList.add('show-animation');
}, 1000); 

function logout() {
localStorage.removeItem("token");
sessionStorage.clear()
window.location.href= "/";
}

if (localStorage.getItem("token") === null) {
window.location.href = "/";
}


