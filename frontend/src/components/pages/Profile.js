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
                    <h4>{state ? state.name : "Loading"}</h4>
                    <div className="profile-info">
                        <h6>40 posts</h6>
                        <h6>40 following</h6>
                        <h6>40 followers</h6>
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
                            />
                        );
                    })
                ) : (
                    <h3
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontFamily: "Grand Hotel",
                        }}
                    >
                        No Posts....
                    </h3>
                )}
            </div>
        </div>
    );
};

export default Profile;
