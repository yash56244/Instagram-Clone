import React, { useState } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const NewPost = () => {
    const history = useHistory();
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "yvc");
        fetch("https://api.cloudinary.com/v1_1/yvc/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setImageUrl(data.url);
            })
            .catch((err) => {
                console.log(err);
            });
        fetch("/post/create", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                caption,
                imageUrl,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "red" });
                } else {
                    M.toast({
                        html: "Posted Successfully",
                        classes: "green",
                    });
                    history.push("/");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div className="card input-field newPost-card">
            <h3 className="insta-font">New Post</h3>
            <div className="file-field input-field">
                <div className="btn">
                    <span>Photo</span>
                    <input
                        type="file"
                        onChange={(e) => {
                            setImage(e.target.files[0]);
                        }}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <input
                type="text"
                placeholder="caption"
                value={caption}
                onChange={(e) => {
                    setCaption(e.target.value);
                }}
            />
            <button
                className="btn waves-effect waves-light"
                onClick={() => {
                    postDetails();
                }}
            >
                Post
            </button>
        </div>
    );
};

export default NewPost;
