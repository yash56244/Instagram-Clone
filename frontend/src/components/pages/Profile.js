import React, { useContext, useState, useEffect } from "react";
import { Modal, Button } from "react-materialize";
import { UserContext } from "../../App";

const Profile = () => {
    const [photos, setPhotos] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const { state, dispatch } = useContext(UserContext);
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
                                    waves="red"
                                >
                                    Close
                                </Button>,
                                <Button
                                    flat
                                    modal="close"
                                    node="button"
                                    waves="green"
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
                                    <i class="material-icons">create</i>
                                </Button>
                            }
                        >
                            <div className="row">
                                <div className="file-field input-field">
                                    <div className="btn">
                                        <span>Profile Photo</span>
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                // setImage(e.target.files[0]);
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
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        id="email"
                                        type="email"
                                        className="validate"
                                        // value={email}
                                        // onChange={(e) => {
                                        //     setEmail(e.target.value);
                                        // }}
                                    />
                                    <label htmlFor="email">Email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <textarea
                                        id="bio"
                                        class="materialize-textarea"
                                    ></textarea>
                                    <label for="bio">Bio</label>
                                </div>
                            </div>
                        </Modal>
                    </h4>
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
