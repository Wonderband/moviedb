

let userlink = document.querySelector('#userlink');
let signoutlink = document.querySelector('#signoutlink');
let header = document.querySelector('#hh');
let currentUser = null;

function getUsername() {
    let keepLoggedIn = localStorage.getItem("keepLoggedIn");

    if (keepLoggedIn == "yes") {
        currentUser = JSON.parse(localStorage.getItem('user'));
    }

    else {
        currentUser = JSON.parse(sessionStorage.getItem("user"));
    }
}
 
function signOut() {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    localStorage.removeItem('keepLoggedIn');
    window.location = 'index.html';
}

// --------------------------------WINDOWS LOADS------------------------------- // 

window.onload = function () {
    getUsername();
    if (currentUser == null) {
        userlink.innerText = 'CREATE NEW ACCOUNT';
        userlink.classList.replace("nav-link", "nav-btn");
        userlink.classList.add("nav-btn-outline-primary");
        userlink.href = 'register.html';

        signoutlink.innerText = 'LOGIN';
        signoutlink.classList.replace("nav-link", "nav-btn");
        signoutlink.classList.add("nav-btn-login");
        signoutlink.href = 'login.html';
    }

    else {
        userlink.innerText = "Welcome, @" + currentUser.username;
        // header.innerText = "Welcome " + currentUser.fullname;
        userlink.classList.replace("nav-btn", "nav-link");
        userlink.classList.remove("nav-btn-outline-primary");
        userlink.href = '#';

        signoutlink.innerText = 'SIGN OUT';
        // signoutlink.classList.replace("nav-btn", "nav-link");
        signoutlink.classList.replace("nav-btn-login", "nav-btn-signout");
        // signoutlink.classList.remove("nav-btn-login");
          signoutlink.classList.add("nav-btn-signout");
        signoutlink.addEventListener('click', signOut)

    }
}

