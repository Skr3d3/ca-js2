import { profileParams, profileUrl } from "./config.mjs";
import { authFetch } from "./fetch.mjs";
import { getLoggedInUser } from "./loggedinuser.mjs";



let profileHeader = document.getElementById("profileheader");
let followersContainer = document.getElementById("followerscontainer")
const followBtn = document.getElementById("followbtn");
const moreFollowersBtn = document.getElementById("morefollowersbtn");
let informationContainer = document.getElementById("informationcontainer");
const editProfileBtn = document.getElementById("editprofilebtn");
let postsContainer = document.getElementById("postscontainer");
const morePostsBtn = document.getElementById("morepostsbutton");

export async function getProfileData(url) {
    try {
        const response = await authFetch(url); 
        if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        const profileData = await response.json();
        return profileData; 
    } catch (error) {
        console.error("Error fetching profile data:", error);
        return null;
    }
}


export async function showProfile(user, profile, loggedInUser){

    document.title = `${user.name}`;

    console.log("showprofile user", user)
    
    const userData = await getLoggedInUser()
    const isAuthor = profile.data.email === userData.user.email;

    if(profileHeader !== null) {
    profileHeader.innerHTML = "";
    profileHeader.innerHTML = `
    <img src="${profile.data.avatar.url}" alt="${profile.data.avatar.alt} class="img-thumbnail bg-dark col-md-6 col-sm-10">
    <h2 class="mt-3">${user.name}</h2>
    `;};

    const hasFollowers = user.followers && user.followers.length > 0;
    const followersList = hasFollowers
        ? loggedInUser.followers.map(follower => `<li class="list-group-item text-bg-dark text-center">${follower.name || 'No name available'}</li>`).join('')
        : '<li class="list-group-item text-bg-dark text-center">No followers</li>';

    if (followersContainer !== null) {
    followersContainer.innerHTML = "";
    followersContainer.innerHTML = `
        <h3>Followers</h3>
        ${followersList}
    `;};

    if (informationContainer !== null) {
    informationContainer.innerHTML = "";
    informationContainer.innerHTML =`
    <div class="card-body">
    <p class="card-text">${user.bio || "This user has nothing to say about themselves"}</p>
    </div>
    ${isAuthor ? `
    <div>
    <button id="editprofilebtn" class="btn btn-primary mt-3">Edit profile</button>
    </div>` : ""}`};

    const hasPosts = user.posts && user.posts.length > 0;
    const postsList = hasPosts 
    ? user.posts.map(post => `
          <h5 class="card-title">${post.title}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${user.name}</h6>
          <p class="card-text">${post.body}</p>
    `)
    : ` <p>No posts!</p>`;
    
    if (informationContainer !== null) {
    postsContainer.innerHTML = `
    <div class="card col-md-9 col-12">
        <div class="card-body">
            ${postsList}
            <button  class="btn btn-primary">Go to post</button>
        </div>
    </div>
    `;};
    
}

async function initialize() {
    const userData = await getLoggedInUser();
    const params = new URLSearchParams(window.location.search);
    const username = params.get('user');

    if (userData && userData.user) { 
        const loggedInUser = userData.user;
        const loggedInUserProfile = await getProfileData(`${profileUrl}/${loggedInUser.name}`);
        
        console.log("Logged-in user profile data:", loggedInUserProfile);

        const profileData = JSON.parse(sessionStorage.getItem('profileData'));

        if (profileData.data.name === username && profileData.data.name !== loggedInUser.name) {
            showProfile(profileData.data, profileData, profileData.data);
        } else {
            if (loggedInUserProfile) {
                showProfile(loggedInUser, loggedInUserProfile, loggedInUser); 
            } else {
                console.error("Failed to fetch profile for logged-in user.");
            }
        }
       

    } 
    
    else {
        console.error("Failed to load user data");
    }
}

initialize();
