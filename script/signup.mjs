import { baseUrl } from "./config.mjs";
import { authUser } from "./auth.mjs";
import { formData } from "./auth.mjs";

const signUpForm = document.getElementById("signupform");

const registerUrl = `${baseUrl}/auth/register`;

signUpForm.addEventListener("submit", function(e){
    e.preventDefault();
    const userToRegister = formData(signUpForm)
    if (userToRegister) {
        authUser(registerUrl, userToRegister);
    }
});