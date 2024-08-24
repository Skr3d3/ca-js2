import { profileParams, profileUrl } from "./config.mjs";
import { authFetch } from "./fetch.mjs";
import { getLoggedInUser } from "./loggedinuser.mjs";



let profileHeader = document.getElementById("profileheader");
const followBtn = document.getElementById("followbtn");
const moreFollowersBtn = document.getElementById("morefollowersbtn");
let informationContainer = document.getElementById("informationcontainer");
const editProfileBtn = document.getElementById("editprofilebtn");
let postsContainer = document.getElementById("postscontainer");
const morePostsBtn = document.getElementById("morepostsbutton");


export async function getProfile(url) {
    
    try{
        const options = {
            method: "GET"
        }
        const response = await authFetch(url, options);
        const json = response.json()
        if(!response.ok) {
            throw new Error("Unable to fetch profile")
        }
    }
    catch(error){console.log(error)}
}

export function showProfile(loggedInUser){
    profileHeader.innerHTML = "";

    profileHeader.innerHTML = `
    <img src="../images/avalancheninja-profile-purple.png" alt="profile picture" class="img-thumbnail bg-dark col-md-6 col-sm-10">
    <h2 class="mt-3">${loggedInUser.name}</h2>
    `
}

async function initialize() {
    const userData = await getLoggedInUser();

    if (userData && userData.user) { 
        const loggedInUser = userData.user;
        console.log("user", userData.user)
        await getProfile(profileUrl+profileParams).then(console.log)
        await showProfile(loggedInUser)
    } else {
        console.error("Failed to load user data");
    }
}

initialize();
