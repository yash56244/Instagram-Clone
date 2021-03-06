import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";
import { Link } from "react-router-dom";
import { Row, Col, ProgressBar } from "react-materialize";

const Post = () => {
    const [data, setData] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const { state, dispatch } = useContext(UserContext);
    const fetchPost = () => {
        fetch("/posts/me", {
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + sessionStorage.getItem("jwt"),
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
    useEffect(fetchPost, []);
    const likePost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + sessionStorage.getItem("jwt"),
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
                authorization: "Bearer " + sessionStorage.getItem("jwt"),
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
        if (!text) {
            return M.toast({ html: "Enter valid text", classes: "red" });
        }
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + sessionStorage.getItem("jwt"),
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
    const deletePost = (id) => {
        fetch(`/post/${id}/delete`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.filter((item) => {
                    return item._id !== result._id;
                });
                setData(newData);
                M.toast({ html: "Post deleted", classes: "green" });
            });
    };
    const deleteComment = (id, postId) => {
        fetch(`/comment/${id}/delete`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId,
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
            });
    };
    return (
        <div>
            {data.length > 0 ? (
                data.map((item) => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h4 style={{ maxHeight: "70px" }}>
                                <img
                                    src={item.author.photo}
                                    className="home-profile-img"
                                    alt=""
                                />
                                <Link
                                    style={{
                                        position: "relative",
                                        top: "-25px",
                                    }}
                                    to={
                                        item.author._id !== state._id
                                            ? "/user/" + item.author._id
                                            : "/profile"
                                    }
                                >
                                    {item.author.name}
                                </Link>
                                {item.author._id === state._id && (
                                    <i
                                        className="material-icons medium red-text"
                                        onClick={() => {
                                            deletePost(item._id);
                                        }}
                                        style={{
                                            float: "right",
                                            cursor: "pointer",
                                            top: "12px",
                                            position: "relative",
                                        }}
                                    >
                                        delete
                                    </i>
                                )}
                            </h4>
                            <div className="card-image">
                                <img
                                    src={item.photo}
                                    alt=""
                                    onDoubleClick={() => likePost(item._id)}
                                />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id) ? (
                                    <i
                                        className="material-icons medium"
                                        onClick={() => {
                                            unlikePost(item._id);
                                        }}
                                        style={{
                                            cursor: "pointer",
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
                                        style={{
                                            cursor: "pointer",
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
                                        <h6 key={item2._id}>
                                            <b>{item2.author.name}</b> :{" "}
                                            {item2.text}
                                            {item2.author._id === state._id && (
                                                <i
                                                    className="material-icons"
                                                    style={{
                                                        float: "right",
                                                        position: "relative",
                                                        top: "-4px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        deleteComment(
                                                            item2._id,
                                                            item._id
                                                        );
                                                    }}
                                                >
                                                    delete
                                                </i>
                                            )}
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
                <Row>
                    <Col s={12}>
                        <ProgressBar />
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default Post;
