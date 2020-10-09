import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";

const Profile = () => {
    const [photos, setPhotos] = useState([]);
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
                        src="https://images.unsplash.com/photo-1569466896818-335b1bedfcce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
                        alt=""
                    />
                </div>
                <div>
                    <h4>{state ? state.name : "Loading"}</h4>
                    <div className="profile-info">
                        <h6>40 posts</h6>
                        <h6>40 following</h6>
                        <h6>40 followers</h6>
                    </div>
                </div>
            </div>
            <div className="profile-gallery">
                {photos.map((item) => {
                    return (
                        <img
                            className="profile-gallery-img"
                            src={item.photo}
                            alt=""
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Profile;
