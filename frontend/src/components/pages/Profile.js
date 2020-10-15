import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-materialize";
import { UserContext } from "../../App";
import M from "materialize-css";

const Profile = () => {
    const history = useHistory();
    // eslint-disable-next-line no-unused-vars
    const { state, dispatch } = useContext(UserContext);
    const [photos, setPhotos] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const fetchMyPosts = () => {
        fetch("/posts/me", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setPhotos(res.posts);
            });
    };
    useEffect(fetchMyPosts, []);
    const fetchUser = () => {
        if (imageUrl) {
            if (email) {
                if (
                    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                        email
                    )
                ) {
                    M.toast({
                        html: "Please enter a valid E-mail",
                        classes: "red",
                    });
                    return;
                }
            }
            fetch("/profile/update", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    name,
                    email,
                    bio,
                    photoUrl: imageUrl ? imageUrl : state.photo,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    dispatch({ type: "USER", payload: data.user });
                    localStorage.setItem("user", JSON.stringify(data.user));
                    if (data.error) {
                        M.toast({ html: data.error, classes: "red" });
                    } else {
                        M.toast({ html: data.message, classes: "green" });
                        history.push("/profile");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    useEffect(fetchUser, [imageUrl]);
    const postData = () => {
        if (!image) {
            setImageUrl(state.photo);
            return;
        }
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
                setImageUrl(res.url);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div className="profile-page">
            <div className="profile-container">
                <div>
                    <img
                        className="profile-img"
                        src={state ? state.photo : "Loading"}
                        alt=""
                    />
                </div>
                <div>
                    <h4>
                        {state ? state.name : "Loading"}
                        <Modal
                            actions={[
                                <Button
                                    flat
                                    modal="close"
                                    node="button"
                                    waves="green"
                                    onClick={() => postData()}
                                >
                                    Update
                                </Button>,
                            ]}
                            bottomSheet
                            fixedFooter={false}
                            header="Edit Profile"
                            id="Modal-0"
                            open={false}
                            options={{
                                dismissible: true,
                                endingTop: "10%",
                                inDuration: 500,
                                onCloseEnd: null,
                                onCloseStart: null,
                                onOpenEnd: null,
                                onOpenStart: null,
                                opacity: 0.5,
                                outDuration: 1000,
                                preventScrolling: true,
                                startingTop: "4%",
                            }}
                            //   root={[object HTMLBodyElement]}
                            trigger={
                                <Button node="button">
                                    <i className="material-icons">create</i>
                                </Button>
                            }
                        >
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="name"
                                        type="text"
                                        className="validate"
                                        value={name}
                                        placeholder={state ? state.name : ""}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                        }}
                                    />
                                    <label htmlFor="name">Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="email"
                                        type="email"
                                        className="validate"
                                        placeholder={state ? state.email : ""}
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                    />
                                    <label htmlFor="email">Email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <textarea
                                        id="bio"
                                        className="materialize-textarea"
                                        placeholder={state ? state.bio : ""}
                                        value={bio}
                                        onChange={(e) => {
                                            setBio(e.target.value);
                                        }}
                                    ></textarea>
                                    <label htmlFor="bio">Bio</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="file-field input-field">
                                    <div className="btn">
                                        <span>Profile Photo</span>
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                setImage(e.target.files[0]);
                                            }}
                                        />
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input
                                            className="file-path validate"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </h4>
                    <p>{state ? state.bio : ""}</p>
                    <div className="profile-info">
                        <h6>
                            {photos.length}
                            {photos.length > 1 ? " posts" : " post"}
                        </h6>
                        <h6>
                            {state ? state.followers.length : "0"} followers
                        </h6>
                        <h6>
                            {state ? state.following.length : "0"} following
                        </h6>
                    </div>
                </div>
            </div>
            <div className="profile-gallery">
                {photos.length > 0 ? (
                    photos.map((item) => {
                        return (
                            <img
                                className="profile-gallery-img"
                                src={item.photo}
                                alt=""
                                key={item._id}
                            ></img>
                        );
                    })
                ) : (
                    <h3 id="loading">No Posts....</h3>
                )}
            </div>
        </div>
    );
};

export default Profile;
