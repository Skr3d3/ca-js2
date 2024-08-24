import { baseUrl, APIKey, profileUrl, accessToken, postsUrl, singlePostUrl, createAPIKey } from "./config.mjs";
import { authFetch } from "./fetch.mjs";
import { getLoggedInUser } from "./loggedinuser.mjs";
import { deletePost } from "./deleteupdate.mjs";


const postsContainer = document.querySelector(".postscontainer");
const showMoreBtn = document.getElementById("showmorebtn");

let filteredPosts = [];

const searchBars = document.querySelectorAll(".searchbar")
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const searchQuery = params.get("search");

function filterPosts(searchQuery) {
    searchQuery = searchQuery.toLowerCase();
    filteredPosts = postsData.data.filter(post => {
        const hasTags = post.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        const hasBody = post.body ? post.body.toLowerCase().includes(searchQuery) : false;
        const hasTitle = post.title ? post.title.toLowerCase().includes(searchQuery) : false;
        return hasTags || hasBody || hasTitle;
    }
    );
    showPosts();
};

let currentIndex = 10;

function showPosts(loggedInUser) {
    postsContainer.innerHTML = "";

        let posts = filteredPosts.length > 0 ? filteredPosts : postsData.data;

        if(posts && posts.length > 0) {
        posts.slice(0,currentIndex).forEach((post) => {

            const isAuthor = loggedInUser && post.author.name === loggedInUser.name && post.author.email === loggedInUser.email;

            console.log(loggedInUser);

            postsContainer.innerHTML += `
            <div class="card col-md-9 col-12">
            <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">${post.tags}</h6>
            <p class="card-text">${post.body}</p>
            <div>
            <p>Posted by: ${post.author.name}</p>
            <button class="btn btn-primary">Add comment</button>
            </div>
            <div class="mt-3">
            ${isAuthor ? `
            <button class="btn btn-secondary edit-post-btn" data-post-id="${post.id}">Edit</button>
            <button class="btn btn-danger delete-post-btn" data-post-id="${post.id}">Delete</button>
            ` : ''}
            </div>
            </div>
            </div>
            `
        })

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

}


searchBars.forEach((searchBar) => {
    searchBar.addEventListener("submit", function(e){
        console.log("serachbar works")
        e.preventDefault();
        filterPosts(searchBar.querySelector("input[type='search']").value)
    })
});


showMoreBtn.addEventListener("click", () => {
    currentIndex += 10;
    showPosts();
})

let postsData = []

const options = {
    method: "GET",
}

export async function getPosts(url) {

    try {
        const response = await authFetch(url, options);
        postsData = await response.json();
        console.log(postsData)
        if(searchQuery) {
            postsData.filter(checkQuery);
        }
        showPosts();
    }
    catch(error) {console.log("Couldn't fetch posts", error)}
};


async function initialize() {
    const userData = await getLoggedInUser();

    if (userData && userData.user) { 
        const loggedInUser = userData.user;
        await getPosts(postsUrl) 
        showPosts(loggedInUser);
    } else {
        console.error("Failed to load user data");
    }
}

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
        await createPostForm.reset;
        console.log("createpostdata", json)
    }
    catch(error) {console.log("Error creating post", error)}
}

createPostBtn.addEventListener("click", async function(e){
    e.preventDefault();
    await createPost();
    await getPosts(postsUrl);
    
})