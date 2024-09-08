import { baseUrl } from "./config.mjs";
import { formData } from "./auth.mjs";
import { authUser } from "./auth.mjs";

const loginForm = document.getElementById("login");
const loginBtn = document.getElementById("loginbtn");
const signupBtn = document.getElementById("signupbtn");

const loginUrl = `${baseUrl}/auth/login`;

loginBtn.addEventListener("click", function(e){
    submitForm(e);
});

signupBtn.addEventListener("click", function(e){
    e.preventDefault();
    const email = document.getElementById("email-login").value;
    if(email) {
        sessionStorage.setItem("email", email)
    }
    window.location.href = "/signup/index.html"
});

async function submitForm(e){
    e.preventDefault();
    const userToLogin = formData(loginForm);
    console.log(userToLogin);
    if (userToLogin) {
        try{
            const response = await authUser(loginUrl, userToLogin);
            if(response) {
                setTimeout(function(){
                    window.location.href = "feed/index.html"
                }, 300)
            };
        }
        catch(error){
            alert(`Login failed! ${error.message}`)
        }
        
};}