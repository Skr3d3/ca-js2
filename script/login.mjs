import { baseUrl } from "./config.mjs";
import { formData } from "./auth.mjs";
import { authUser } from "./auth.mjs";

const loginForm = document.getElementById("login");
const loginBtn = document.getElementById("loginbtn");
const signupBtn = document.getElementById("signupbtn");

const loginUrl = `${baseUrl}/auth/login`;

// loginForm.addEventListener("submit", function(e){
//     e.preventDefault();
//     const userToLogin = formData(loginForm);
//     console.log(userToLogin);
//     if (userToLogin) {
//         authUser(loginUrl, userToLogin);
// };}
// );

loginBtn.addEventListener("click", submitForm);
signupBtn.addEventListener("click", function(e){
    e.preventDefault();
})

function submitForm(e){
    e.preventDefault();
    const userToLogin = formData(loginForm);
    console.log(userToLogin);
    if (userToLogin) {
        authUser(loginUrl, userToLogin);
};}