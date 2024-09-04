import { APIKey } from "./config.mjs";
import { accessToken } from "./config.mjs";


/**
 * Asynchronously performs a fetch request with the provided URL and options.
 * This function automatically adds the appropriate headers, including authentication
 * and content type headers, if necessary.
 *
 * @param {string} url - The URL to which the fetch request is sent.
 * @param {object} [options={}] - The options object to customize the fetch request. 
 *  Supports all the options available for the Fetch API, such as method, headers, body, etc.
 * @returns {Promise<Response>} - A promise that resolves to the response of the fetch request.
 * @async
 */
export async function authFetch(url, options = {}){
    return fetch(url, {
        ...options,
        headers: headers(Boolean(options.body)),
    });
};

/**
 * Generates the appropriate headers for a fetch request, including optional
 * authorization and content type headers.
 *
 * @param {boolean} [hasBody=false] - Indicates whether the request has a body (e.g., for POST/PUT requests).
 *  If true, the 'Content-Type: application/json' header is added.
 * @returns {Headers} - A Headers object containing the appropriate headers.
 */
export function headers(hasBody = false) {

    const headers = new Headers();

    if(accessToken) {
        headers.append("Authorization", `Bearer ${accessToken}`);
    }
    if(APIKey) {
        headers.append("X-Noroff-API-Key", APIKey);
    }
    if(hasBody){
        headers.append("Content-Type", "application/json")
    };
    
    return headers;
};