import React, { useContext, useState, useEffect } from "react";
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
                        <button className="btn waves-effect waves-light">
                            <i class="material-icons">create</i>
                        </button>
                    </h4>
                    <div className="profile-info">
                        <h6>
                            {photos.length}
                            {photos.length > 1 ? " posts" : " post"}
                        </h6>
                        <h6>{state.followers.length} followers</h6>
                        <h6>{state.following.length} following</h6>
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
