import request from "../../utility/request.js";

const SERVER = "http://localhost:2000/Box/server/APIs"

const loginForm = document.forms[0];

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    request("POST", `${SERVER}/admin/login.php`, handelLoginRequest, null, new FormData(loginForm));
})

const handelLoginRequest = (result) => {
    console.log(result);
}