import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase, ref, set, child, get } from 'firebase/database';
import CryptoJS, { enc } from 'crypto-js';

const firebaseConfig = {
  apiKey: 'AIzaSyC_AoWR6sIw9yYqEcm5_Le0FK59RgGenNY',
  authDomain: 'filmoteka-js-c90cd.firebaseapp.com',
  databaseURL: 'https://filmoteka-js-c90cd-default-rtdb.firebaseio.com',
  projectId: 'filmoteka-js-c90cd',
  storageBucket: 'filmoteka-js-c90cd.appspot.com',
  messagingSenderId: '542180533478',
  appId: '1:542180533478:web:cc24636cc3211b9b060727',
  measurementId: 'G-04MJBK1QWZ',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();

// -----------------------------THE REFERENCES----------------------------- //

// SIGN UP
const name = document.querySelector('#nameInp');
const email = document.querySelector('#emailInp');
const username = document.querySelector('#userInp');
const password = document.querySelector('#passInp');
const subSignUp = document.querySelector('#sub_signup_btn');

// -------------------------------VALIDATION------------------------------- //

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

function validation() {
  let nameregex = /^[a-zA-Z\s]+$/;
  let emailregex = /^[a-zA-Z0-9]+@(gmail|yahoo|outlook)\.com$/;
  let userregex = /^[a-zA-Z0-9]{5,}$/;

  if (
    isEmptyOrSpaces(name.value) ||
    isEmptyOrSpaces(email.value) ||
    isEmptyOrSpaces(username.value) ||
    isEmptyOrSpaces(password.value)
  ) {
    alert("You can't left any field empty");
    return false;
  }

  if (!nameregex.test(name.value)) {
    alert('The name should only contain alphabets!');
    return false;
  }

  if (!emailregex.test(email.value)) {
    alert('Enter a valid email!');
    return false;
  }

  if (!userregex.test(username.value)) {
    alert(
      '-username can only be alphanumeric\n-username must be aleast 5 characters\n-username cannot contain spaces'
    );
    return false;
  }

  return true;
}

// ------------------------REGISTER USER TO FIREBASE------------------------- //

function registerUser() {
  if (!validation()) {
    return;
  }
  const databaseRef = ref(database);

  get(child(databaseRef, `UsersLists/${username.value}`)).then(snapshot => {
    if (snapshot.exists()) {
      alert('Account already exists!');
    } else {
      set(ref(database, 'UsersLists/' + username.value), {
        fullname: name.value,
        email: email.value,
        username: username.value,
        password: encPass(),
      })
        .then(() => {
          alert('User added successfully');
          window.location = 'login.html';
        })
        .catch(() => {
          alert('error' + error);
        });
    }
  });
}

// -------------------------------ENCRIPTION-------------------------------- //
function encPass() {
  let pass12 = CryptoJS.AES.encrypt(password.value, password.value);
  return pass12.toString();
}

// ----------------------------ASSIGN THE EVENTS----------------------------- //

subSignUp.addEventListener('click', registerUser);
