import { profileUrl, postsUrl, profileParams } from "./config.mjs";
import { accessToken } from "./config.mjs";
import { authFetch } from "./fetch.mjs";


export function parseJwt (token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

export async function getLoggedInUser() {

    try {
        if (!accessToken) {
            throw new Error("Token not found");
        }
        const payload = parseJwt(accessToken); 
        console.log("Decoded JWT Payload:", payload);

        const loggedInUserEmail = payload.email; 
        const loggedInUser = payload.name;

        if (!loggedInUserEmail || !loggedInUser) {
            throw new Error("Logged-in user's email not found in token");
        }

        const postsResponse = await authFetch(postsUrl); 
        if (!postsResponse.ok) {
            throw new Error("Unable to fetch userposts")
        }
            const postsData = await postsResponse.json();
            const posts = postsData.data;
            console.log("Posts Array:", posts);

            const userPosts = posts.filter(post => post.author.email === loggedInUserEmail);
            
            const user = {
                name: loggedInUser,
                email: loggedInUserEmail,
                posts: userPosts
            };
            const profileResponse = await authFetch(`${profileUrl}/${loggedInUser}`);
            if (!profileResponse.ok) {
                throw new Error(`Failed to fetch profile data: ${profileResponse.status}`);
            }
            const profileData = await profileResponse.json();
            console.log("Profile Data:", profileData);
            
            return {
                user,
                profile: profileData
            };
    } catch (error) {
        console.log(error, "Unable to fetch users")
        return null;
    }
}
