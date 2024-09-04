import { authFetch } from "./fetch.mjs"

export const baseUrlVersion = "v2"
export const baseUrl = `https://${baseUrlVersion}.api.noroff.dev`
export const postsUrl = `${baseUrl}/social/posts`+"?_author=true"
export const singlePostUrl = `${baseUrl}/social/posts`
export const profileUrl = `${baseUrl}/social/profiles`
export const profileParams = `?_following&_followers&_posts`



export const APIKey = "dfd9535d-d059-4a1a-aa3a-8c5d8f102d2d"
export const accessToken = localStorage.getItem("accessToken")




// renew API Key

/**
 * Asynchronously creates a new API key by making a POST request to the specified endpoint.
 * 
 * DO NOT USE unless the api key is missing. This only happens if the endpoint is purged or the key is deleted from the code.
 * 
 * This function sends a request to the `/auth/create-api-key` endpoint to create an API key
 * with the name "APIKey". If the request is successful, the new API key data is returned.
 * If the request fails, an error message is logged to the console.
 * 
 * @returns {Promise<Object>} - A promise that resolves to an object containing the API key data if the request is successful.
 *  If the request fails, it returns undefined and logs the error to the console.
 * 
 * @throws {Error} - If the network request fails, the function may throw an error when `authFetch` fails.
 */
export async function createAPIKey() {
    const response = await authFetch(baseUrl+"/auth/create-api-key", {
        method: "POST",
        body: JSON.stringify({
            name: "APIKey"
        })
        
    });
    if (response.ok) {
        return await response.json()
    }
    console.log("api error", await response.json())
}