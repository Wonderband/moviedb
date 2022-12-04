

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
        userlink.innerText = 'Create New Account';
        userlink.classList.replace("nav-link", "btn");
        userlink.classList.add("btn-outline-primary");
        userlink.href = 'register.html';

        signoutlink.innerText = 'Login';
        signoutlink.classList.replace("nav-link", "btn");
        signoutlink.classList.add("btn-success");
        signoutlink.href = 'login.html';
    }

    else {
        userlink.innerText = currentUser.username;
        header.innerText = "Welcome " + currentUser.fullname;
        userlink.classList.replace("btn", "nav-link");
        userlink.classList.remove("btn-outline-primary");
        // userlink.href = '#';

        signoutlink.innerText = 'Sign Out';
        signoutlink.classList.replace("btn", "nav-link");
        signoutlink.classList.remove("btn-success");
        signoutlink.addEventListener('click', signOut)

    }
}

