import request from "../../utility/request.js";

const SERVER = "http://localhost:8000/Box/server/APIs"

const loginForm = document.forms[0];

if (document.cookie.split('=')[1]) {
    location.replace('/Box/client/src/pages/dashboard.html')
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    request("POST", `${SERVER}/admin/login.php`, handelLoginRequest, null, new FormData(loginForm));
})

const handelLoginRequest = (result) => {
    location.replace('/Box/client/src/pages/dashboard.html');
}