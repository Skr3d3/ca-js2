import { profileUrl, postsUrl, profileParams } from "./config.mjs";
import { accessToken } from "./config.mjs";
import { authFetch } from "./fetch.mjs";

/**
 * Parses a JSON Web Token (JWT) and returns the decoded payload as a JavaScript object.
 * The function handles the base64 decoding and JSON parsing of the JWT's payload.
 *
 * @param {string} token - The JWT as a string, typically in the format "header.payload.signature".
 * @returns {Object|null} - Returns the decoded payload as a JavaScript object if the token is valid.
 *   If the token is invalid or an error occurs during parsing, it returns `null` and logs an error to the console.
 */
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
};


/**
 * Retrieves the logged-in user's information, including their profile and posts, based on the JWT token.
 * 
 * This function checks for a valid JWT token, extracts user information from the token,
 * fetches the user's posts and profile data, and returns an object containing this information.
 *
 * @returns {Promise<Object|null>} - A promise that resolves to an object containing the logged-in user's 
 *   name, email, posts, and profile data if successful. If any error occurs (e.g., token is missing or invalid, 
 *   fetching posts or profile fails), the function returns `null` and logs the error to the console.
 * 
 * @throws {Error} - Throws an error if the token is not found, if the token is invalid, or if required user 
 *   information is missing in the token payload.
 */
export async function getLoggedInUser() {

    try {
        if (!accessToken) {
            throw new Error("Token not found");
        }
        const payload = parseJwt(accessToken); 
        console.log("JWT Payload:", payload);

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
};