import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";

const User = () => {
    const [userProfile, setUserProfile] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const { state, dispatch } = useContext(UserContext);
    const { id } = useParams();
    const fetchProfile = () => {
        fetch(`/user/${id}`, {
            headers: {
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setUserProfile(res);
            });
    };
    useEffect(fetchProfile, []);
    return (
        <>
            {userProfile ? (
                <div className="profile-page">
                    <div className="profile-container">
                        <div>
                            <img
                                className="profile-img"
                                src={
                                    userProfile
                                        ? userProfile.user.photo
                                        : "Loading"
                                }
                                alt=""
                            />
                        </div>
                        <div>
                            <h4>
                                {userProfile
                                    ? userProfile.user.name
                                    : "Loading"}
                            </h4>
                            <div className="profile-info">
                                <h6>
                                    {userProfile.posts.length}
                                    {userProfile.posts.length > 1
                                        ? " posts"
                                        : " post"}
                                </h6>
                                <h6>40 following</h6>
                                <h6>40 followers</h6>
                            </div>
                        </div>
                    </div>
                    <div className="profile-gallery">
                        {userProfile.posts.length > 0 ? (
                            userProfile.posts.map((item) => {
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
            ) : (
                <h4>Loading</h4>
            )}
        </>
    );
};

export default User;
