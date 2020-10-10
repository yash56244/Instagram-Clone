import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

const Home = () => {
    const [data, setData] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const { state, dispatch } = useContext(UserContext);
    const fetchPosts = () => {
        fetch("/posts/all", {
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setData(res.posts);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(fetchPosts, []);
    const likePost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const addComment = (id, text) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id,
                text,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div>
            {data.length > 0 ? (
                data.map((item) => {
                    return (
                        <div className="card home-card">
                            <h4>
                                <img
                                    src={item.author.photo}
                                    className="home-profile-img"
                                    alt=""
                                />
                                {item.author.name}
                            </h4>
                            <div className="card-image">
                                <img src={item.photo} alt="" />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id) ? (
                                    <i
                                        className="material-icons medium"
                                        onClick={() => {
                                            unlikePost(item._id);
                                        }}
                                    >
                                        thumb_down
                                    </i>
                                ) : (
                                    <i
                                        className="material-icons medium"
                                        onClick={() => {
                                            likePost(item._id);
                                        }}
                                    >
                                        thumb_up
                                    </i>
                                )}
                                {item.likes.length > 1 ? (
                                    <h6>{item.likes.length} likes</h6>
                                ) : (
                                    <h6>{item.likes.length} like</h6>
                                )}
                                <h6>
                                    <b>{item.author.name}</b> : {item.caption}
                                </h6>
                                {item.comments.map((item2) => {
                                    return (
                                        <h6>
                                            <b>{item2.author.name}</b> :{" "}
                                            {item2.text}
                                        </h6>
                                    );
                                })}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        addComment(item._id, e.target[0].value);
                                        e.target[0].value = "";
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Add a Comment.."
                                    />
                                </form>
                            </div>
                        </div>
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
    );
};

export default Home;
