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