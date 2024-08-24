import { APIKey } from "./config.mjs";
import { accessToken } from "./config.mjs";


export async function authFetch(url, options = {}){
    return fetch(url, {
        ...options,
        headers: headers(Boolean(options.body)),
    });
};

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