import React from "react";

const NewPost = () => {
    return (
        <div className="card input-field newPost-card">
            <h3 className="insta-font">New Post</h3>
            <div className="file-field input-field">
                <div className="btn">
                    <span>Photo</span>
                    <input type="file" />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <input type="text" placeholder="caption" />
            <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
            >
                Post
            </button>
        </div>
    );
};

export default NewPost;
