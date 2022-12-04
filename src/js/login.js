import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, child, get, enableLogging } from "firebase/database";
import CryptoJS from "crypto-js";


const firebaseConfig = {
  apiKey: "AIzaSyC_AoWR6sIw9yYqEcm5_Le0FK59RgGenNY",
  authDomain: "filmoteka-js-c90cd.firebaseapp.com",
  databaseURL: "https://filmoteka-js-c90cd-default-rtdb.firebaseio.com",
  projectId: "filmoteka-js-c90cd",
  storageBucket: "filmoteka-js-c90cd.appspot.com",
  messagingSenderId: "542180533478",
  appId: "1:542180533478:web:cc24636cc3211b9b060727",
  measurementId: "G-04MJBK1QWZ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();


// -----------------------------THE REFERENCES----------------------------- // 

// LOG IN
const username = document.querySelector('#userInp');
const password = document.querySelector('#passInp');
const subLogIn = document.querySelector('#sub_login_btn');
console.log(subLogIn)


// -------------------------AUTHENTICATION PROCESS------------------------- // 

function authUser() {
    const dbRef = ref(db);
    get(child(dbRef, 'UsersLists/' + username.value)).then((snapshot) => {
        if (snapshot.exists()) {
            let dbpass = decPass(snapshot.val().password);
            console.log(snapshot.val().password)
            console.log(dbpass)
            console.log(password.value)
            if (dbpass == password.value) {
                login(snapshot.val());
            }
            
            else {
                alert("Username or password is invalid");       
            }
        }

        else {
            alert("User does not exist!");
        }

    });
}


// -------------------------DECRYPTION PROCESS------------------------- // 

function decPass(dbpass) {
    let pass12 = CryptoJS.AES.decrypt(dbpass, password.value);
    return pass12.toString(CryptoJS.enc.Utf8);
}

// --------------------------------LOGIN------------------------------- // 

function login(user) {
    let keepLoggedIn = document.querySelector("#flexSwitchCheckDefault").checked;

    if (!keepLoggedIn) {
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location = "index.html";
    }

    else {
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('user', JSON.stringify(user));
        window.location = "index.html";
    }
}

// ----------------------------ASSIGN THE EVENTS----------------------------- // 

subLogIn.addEventListener('click', authUser);