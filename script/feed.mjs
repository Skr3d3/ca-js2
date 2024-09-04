import { baseUrl, APIKey, profileUrl, accessToken, postsUrl, singlePostUrl, createAPIKey, profileParams} from "./config.mjs";
import { authFetch } from "./fetch.mjs";
import { getLoggedInUser } from "./loggedinuser.mjs";
import { deletePost } from "./deleteupdate.mjs";
import { getProfileData } from "./profile.mjs";


const postsContainer = document.querySelector(".postscontainer");
const showMoreBtn = document.getElementById("showmorebtn");

let filteredPosts = [];

const searchBars = document.querySelectorAll(".searchbar")
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const searchQuery = params.get("search");

function filterPosts(searchQuery, postsData) {
    searchQuery = searchQuery.toLowerCase();
    filteredPosts = postsData.filter(post => {
        const hasAuthor = post.author.name ? post.author.name.toLowerCase().includes(searchQuery) : false;
        const hasTags = post.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        const hasBody = post.body ? post.body.toLowerCase().includes(searchQuery) : false;
        const hasTitle = post.title ? post.title.toLowerCase().includes(searchQuery) : false;
        return hasTags || hasBody || hasTitle || hasAuthor;
    });
    showPosts(filteredPosts);
    return filteredPosts;
};

let currentIndex = 10;

function showPosts(posts, loggedInUser) {
    postsContainer.innerHTML = "";

        if(posts && posts.length > 0) {
        posts.slice(0,currentIndex).forEach((post) => {

            const isAuthor = loggedInUser && post.author.name === loggedInUser.name && post.author.email === loggedInUser.email;

            postsContainer.innerHTML += `
            <div class="card col-md-9 col-12" data-post-id="${post.id}">
                <div class="card-body">
                    <h5 class="cardelements card-title">${post.title}</h5>
                    <h6 class="cardelements card-tags mb-2 text-body-secondary">${post.tags.join(", ")}</h6>
                    <p class="cardelements card-text">${post.body}</p>
                    <div>
                        <p>Posted by: <a href="#" class="author-link" data-author-name="${post.author.name}">${post.author.name}</a></p>
                        <button class="cardelements btn btn-primary">Add comment</button>
                    </div>
                    <div class="mt-3">
                        ${isAuthor ? `
                        <button class="cardelements btn btn-secondary edit-post-btn" data-post-id="${post.id}">Edit</button>
                        <button class="cardelements btn btn-danger delete-post-btn" data-post-id="${post.id}">Delete</button>
                        ` : ''}
                    </div>
                    <div class="edit-post-form mt-3" style="display: none;">
                        <form>
                            <div class="mb-3">
                                <label for="edit-title-${post.id}" class="form-label">Title</label>
                                <input type="text" class="form-control" id="edit-title-${post.id}" value="${post.title}">
                            </div>
                            <div class="mb-3">
                                <label for="edit-tags-${post.id}" class="form-label">Tags</label>
                                <input type="text" class="form-control" id="edit-tags-${post.id}" value="${post.tags}">
                            </div>
                            <div class="mb-3">
                                <label for="edit-body-${post.id}" class="form-label">Body</label>
                                <textarea class="form-control" id="edit-body-${post.id}" rows="3">${post.body}</textarea>
                            </div>
                            <button type="button" class="btn btn-success save-edit-btn" data-post-id="${post.id}">Save</button>
                            <button type="button" class="btn btn-secondary cancel-edit-btn">Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
            `
        });

        document.querySelectorAll(".edit-post-btn").forEach(button => {
            button.addEventListener("click", function () {
                const postId = this.getAttribute("data-post-id");
                const postCard = document.querySelector(`.card[data-post-id="${postId}"]`);
                const postContent = postCard.querySelectorAll(".cardelements");
                const editForm = postCard.querySelector(".edit-post-form");

                postContent.forEach(element => {
                    element.style.display = "none";
                });
                editForm.style.display = "block";
            });
        });

        document.querySelectorAll(".cancel-edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const editForm = this.closest(".edit-post-form");
                const postCard = editForm.closest(".card")
                const postContent = postCard.querySelectorAll(".cardelements");

                if (postContent) {
                    postContent.forEach(element => {
                    element.style.removeProperty("display");
                    })
                    editForm.style.display = "none";
                } else {
                    console.log("Element not found")
                };
            });
        });

        document.querySelectorAll(".save-edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const postId = this.getAttribute("data-post-id");
                const postCard = document.querySelector(`.card[data-post-id="${postId}"]`);
                const titleInput = postCard.querySelector(`#edit-title-${postId}`);
                const tagsInput = postCard.querySelector(`#edit-tags-${postId}`);
                const bodyTextarea = postCard.querySelector(`#edit-body-${postId}`);

                const tagsArray = tagsInput.value.split(",").map(tag => tag.trim());

                updatePost(postId, titleInput.value, tagsArray, bodyTextarea.value);
            });
        });


        document.querySelectorAll(".author-link").forEach(link => {
            link.addEventListener("click", async function (e) {
                e.preventDefault();
                const authorName = this.getAttribute("data-author-name");
                
                const profileData = await getProfileData(`${profileUrl}/${encodeURIComponent(authorName)}${profileParams}`);
                
                if(profileData) {
                    sessionStorage.setItem("profileData", JSON.stringify(profileData));
                    window.location.href = `/profile/index.html?user=${encodeURIComponent(authorName)}`
                } else {
                    console.log("Could not find the profile")
                }
            });
        });

        document.querySelectorAll(".delete-post-btn").forEach(button => {
            button.addEventListener("click", function () {
                const postId = this.getAttribute("data-post-id");
                console.log(postId);
                console.log("button works")
                deletePost(postId);
            });
        });
    
        
    } else {
        console.log("No posts available")
    }
};

async function updatePost(postId, newTitle, newTags, newBody){

    try{ 
    const options = {
        method: "PUT",
        body: JSON.stringify({
            title: newTitle,
            tags: newTags,
            body: newBody
        })
        }
    const response = await authFetch(`${singlePostUrl}/${postId}`, options)
    const json = response.json
    console.log("update json", json);

    const postCard = document.querySelector(`.card[data-post-id="${postId}"]`)

    postCard.querySelector(".card-title").innerText = newTitle;
    postCard.querySelector(".card-tags").innerText = newTags.join(", ");
    postCard.querySelector(".card-text").innerText = newBody;

    postCard.querySelector(".edit-post-form").style.display = "none";
    postCard.querySelector(".card-body > .card-text").style.display = "block";
    initialize();
    }
    catch(error){console.log("Update error", error)}
}

showMoreBtn.addEventListener("click", () => {
    currentIndex += 10;
    initialize();
})

searchBars.forEach((searchBar) => {
    searchBar.addEventListener("submit",async function(e){
        console.log("serachbar works")
        e.preventDefault();
        const searchQuery = searchBar.querySelector("input[type='search']").value;
        const posts = await getPosts(postsUrl, searchQuery)
        showPosts(posts)
    })
});



export async function getPosts(url, searchQuery = "") {

    try {
        const response = await authFetch(url);
        const postsData = await response.json();
        console.log("getPosts data", postsData)
        if(searchQuery) {
            const filteredPosts = filterPosts(searchQuery, postsData.data);
            return filteredPosts;
        }
        return postsData.data;
    }
    catch(error) {console.log("Couldn't fetch posts", error)}
    return [];
};

export async function initialize() {

    const userData = await getLoggedInUser();

    if (userData && userData.user) { 
        const loggedInUser = userData.user;
        const posts = await getPosts(postsUrl) 
        showPosts(posts, loggedInUser);
    } else {
        console.error("Failed to load user data");
    }
};

initialize();


const createPostForm = document.getElementById("createpost")
const createPostBtn = document.getElementById("createpostbtn");

const postTitle = document.getElementById("title").value;
const postTags = document.getElementById("tags").value;
const postBody = document.getElementById("body").value;

let createPostData = {
    title: postTitle,
    tags: [postTags],
    body: postBody, 
}

export async function createPost() {

    try {
        const options = {
            method: "POST",
            body: JSON.stringify(createPostData)
        }
        const response = await authFetch(singlePostUrl, options)

        console.log(response)
        if(!response.ok) {
            throw new Error(response.status)
        }
        const json = await response.json();
        console.log("createpostdata", json)
        createPostForm.reset()
        initialize();
    }
    catch(error) {console.log("Error creating post", error)}
}

createPostBtn.addEventListener("click", async function(e){
    e.preventDefault();
    await createPost();
    
})