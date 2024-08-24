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
}

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

}