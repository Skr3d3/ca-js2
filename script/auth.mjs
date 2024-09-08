import { authFetch } from "./fetch.mjs";


export const formData = (form) => {
    const _formData = new FormData(form);

    const formObject = {
        name: _formData.get("name"),
        email: _formData.get("email"),
        password: _formData.get("password"),
        re_password: _formData.get("re_password")
    }
    if (formObject.re_password && formObject.password !== formObject.re_password) {
        alert("Passwords do not match!");
        return null;
    }
    console.log(formObject);

    
    const registeredUser = {
        name: formObject.name || "",
        email: formObject.email,
        password: formObject.password
    };
    return registeredUser
};

/**
 * Authenticates a user by sending a POST request with the provided user data to the specified URL.
 * This function handles both login and sign-up processes based on the `isSignUp` flag.
 *
 * @param {string} url - The URL to which the authentication request is sent.
 * @param {Object} userData - An object containing the user's data (e.g., email and password).
 * @param {boolean} [isSignUp=false] - A boolean flag indicating whether the operation is a sign-up (true) or a login (false).
 * @returns {Promise<Object>} - A promise that resolves to the response data in JSON format if the authentication is successful.
 *   For sign-ups, it resolves if the server confirms the creation of a new account.
 *   For logins, it resolves if an access token is returned and saved to localStorage.
 *
 * @throws {Error} - Throws an error if the sign-up fails, the login credentials are incorrect, or if any other issue occurs during the request.
 */
export async function authUser(url, userData, isSignUp = false) {
    try {
        const options = {
            method: "POST",
            body: JSON.stringify(userData),
        }
        const response = await authFetch(url, options);
        const json = await response.json();
        if (isSignUp) {
            if (json.data) {
                console.log("Sign up successfull")
                return json;
            } else {
                throw new Error ("Sign up failed")
            }
        } else {
        if(json.data && typeof json.data.accessToken === "string") {
            const accessToken = json.data.accessToken;
            localStorage.setItem("accessToken", accessToken);
            return json;
        } else {
            console.log("skipped json")
            throw new Error("Incorrect login credentials");
        };
    }

    }
    catch(error){
        console.warn("error", error)
        throw error
    }

};
