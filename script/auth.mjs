

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

export async function authUser(url, userData) {
    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
        const response = await fetch(url, options)
        console.log("Response", response)
        const json = await response.json();
        console.log("Response JSON", json);
        if(json.data && typeof json.data.accessToken === "string") {
            const accessToken = json.data.accessToken;
            localStorage.setItem("accessToken", accessToken);
            console.log(accessToken);
        } else {
            console.log("skipped json")
            return;
        };

    }
    catch(error){console.warn("error", error)}
}