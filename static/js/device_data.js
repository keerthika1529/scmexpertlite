if (localStorage.getItem("token") === null) {
    window.location.href = "/";
}

function logout() {
    localStorage.removeItem("token");
    sessionStorage.clear()
    window.location.href= "/";
    }
           