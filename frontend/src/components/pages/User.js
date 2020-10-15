/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
import { ProgressBar, Col, Row } from "react-materialize";

const User = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
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
                setLoading(false);
                setUserProfile(res);
            });
    };
    useEffect(fetchProfile, []);
    const followUser = () => {
        fetch("/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ followId: id }),
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: data.following,
                        followers: data.followers,
                    },
                });
                localStorage.setItem("user", JSON.stringify(data));
                setUserProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id],
                        },
                    };
                });
            });
    };
    const unfollowUser = () => {
        fetch("/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ unfollowId: id }),
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: data.following,
                        followers: data.followers,
                    },
                });
                localStorage.setItem("user", JSON.stringify(data));
                setUserProfile((prevState) => {
                    const newFollowData = prevState.user.followers.filter(
                        (item) => item !== data._id
                    );
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollowData,
                        },
                    };
                });
            });
    };
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
                            <p>
                                {userProfile.user.bio
                                    ? userProfile.user.bio
                                    : ""}
                            </p>
                            <div className="profile-info">
                                <h6>
                                    {userProfile.posts.length}
                                    {userProfile.posts.length > 1
                                        ? " posts"
                                        : " post"}
                                </h6>
                                <h6>
                                    {userProfile.user.followers.length}{" "}
                                    followers
                                </h6>
                                <h6>
                                    {userProfile.user.following.length}{" "}
                                    following
                                </h6>
                            </div>
                            {state.following.includes(userProfile.user._id) ? (
                                <button
                                    className="btn waves-effect waves-light"
                                    onClick={() => unfollowUser()}
                                >
                                    Unfollow
                                </button>
                            ) : (
                                <button
                                    className="btn waves-effect waves-light"
                                    onClick={() => followUser()}
                                >
                                    Follow
                                </button>
                            )}
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
                <Row>
                    <Col s={12}>
                        <ProgressBar />
                    </Col>
                </Row>
            )}
        </>
    );
};

export default User;
