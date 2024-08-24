import { postsUrl, singlePostUrl } from "./config.mjs";
import { getPosts } from "./feed.mjs";
import { authFetch } from "./fetch.mjs";

export async function deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        try {
            const options = {
                method: "DELETE",
            };
            const response = await authFetch(`${singlePostUrl}/${postId}`, options);
            if (!response.ok) {
                throw new Error(response.status);
            }
            console.log(`Post with ID ${postId} deleted successfully`);
            getPosts(postsUrl);
        } catch (error) {
            console.log("Error deleting post", error);
        }
    }
}


document.querySelectorAll(".edit-post-btn").forEach(button => {
    button.addEventListener("click", function () {
        const postId = this.getAttribute("data-post-id");
        editPost(postId);
    });
});
