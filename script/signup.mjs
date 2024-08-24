import { baseUrl } from "./config.mjs";
import { authUser } from "./auth.mjs";
import { formData } from "./auth.mjs";

const signUpForm = document.getElementById("signupform");

const registerUrl = `${baseUrl}/auth/register`;

window.addEventListener("load", function() {
    const email = sessionStorage.getItem("email");

    if(email) {
        document.getElementById("email-signup").value = email;
    }
})

signUpForm.addEventListener("submit", function(e){
    e.preventDefault();
    const userToRegister = formData(signUpForm)
    if (userToRegister) {
        authUser(registerUrl, userToRegister, true);
        console.log("usertoregister", userToRegister)
    }
});