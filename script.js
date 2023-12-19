let loggedInUser = "";
let userScreenName = "";


// sign up form submission
let form = document.getElementById("signup");
form.addEventListener('submit', function (e) {
  e.preventDefault();

  let email = document.querySelector("#email");
  let password = document.querySelector("#password");
  let confirmPassword = document.querySelector("#confirm_password");

  if(confirmPassword.value !== password.value){
      document.getElementById("signup-response").innerText = "Password Not Match";
      return;
  }

  let signupRequest = {
    username: email.value,
    password: password.value
  };
  console.log(signupRequest);
  const url = 'http://localhost:8080/Chronicles/register';

  fetch( url, {
    method: 'POST',
    body: JSON.stringify(signupRequest),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'

    },

  })
      .then(response => response.text())
      .then(responseText => {
        document.getElementById("signup-response").innerText = responseText;
      })
      .catch(error => {
        console.error('Error:', error);
      });

})

let typed = new Typed(".words", {
  strings: ["one page at a time", "of your life's Journey"],
  typeSpeed: 60,
  backSpeed: 60,
  loop: true,
});


const startLoginForm = document.querySelector('#login-button');
startLoginForm.addEventListener('click', () => {
  console.log('Button clicked!');
  let loginModal = document.querySelector('#login-container');
  loginModal.style.display = 'flex';

  let chronicles = document.querySelector('#left-container');
  chronicles.style.display = 'none';

  let signup = document.querySelector('#container');
  signup.style.display = 'none';
});



const closeButton = document.querySelector('#close-button');
closeButton.addEventListener('click', () => {
  console.log(' Close Button clicked!');
  let loginModal = document.querySelector('#login-container');
  loginModal.style.display = 'none';

  let chronicles = document.querySelector('#left-container');
  chronicles.style.display = 'flex';

  let signup = document.querySelector('#container');
  signup.style.display = 'flex';
});



// login pane for submission
let submitLoginForm = document.getElementById("login");
submitLoginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  console.log("Login Button Clicked... submitting inputs")
  let email = document.querySelector("#login_email");
  let password = document.querySelector("#login_password");
  let screenName = document.querySelector("#screen_name");
  let rememberMe = document.getElementById('rememberMe').checked;

    if (rememberMe) {
        localStorage.setItem('rememberedUsername', email.value);
        localStorage.setItem('rememberedPassword', password.value);
        localStorage.setItem('rememberedScreenName', screenName.value)
    }

  let loginRequest = {
    username: email.value,
    password: password.value
  };
    userScreenName = screenName;
    console.log('user screen name', userScreenName);
  console.log(loginRequest);
  const url = 'http://localhost:8080/Chronicles/unlock';

  fetch( url, {
    method: 'POST',
    body: JSON.stringify(loginRequest),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },

  })
      .then(response => response.text())
      .then(responseText => {
          console.log(responseText);
        if(responseText.startsWith("Diary Unlocked")){
            localStorage.setItem("loggedInUser", email.value);
            localStorage.setItem("userScreenName", screenName.value);
            window.location.href = 'dashboard.html';

        } else {
            document.getElementById("login-response").innerText = responseText;
        }

      })
      .catch(error => {
        console.error('Error:', error);
      });

})

document.addEventListener('DOMContentLoaded', function () {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const rememberedScreenName = localStorage.getItem('rememberedScreenName');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    if (rememberedUsername && rememberedPassword) {
        document.getElementById('login_email').value = rememberedUsername;
        document.getElementById('login_password').value = rememberedPassword;
        document.getElementById('screen_name').value = rememberedScreenName;
        rememberMeCheckbox.checked = true;
    }
});


