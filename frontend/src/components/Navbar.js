import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const Navbar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);
    const [query, setQuery] = useState("");
    const [userList, setUserList] = useState([]);
    const searchUser = useRef(null);
    useEffect(() => {
        const options = {
            onCloseEnd: () => {
                setQuery("");
                setUserList([]);
            },
        };
        M.Modal.init(searchUser.current, options);
    }, []);
    const renderList = () => {
        if (state) {
            return [
                <li key="search" style={{ color: "black", cursor: "pointer" }}>
                    {" "}
                    <i
                        data-target="modal1"
                        className="material-icons modal-trigger"
                    >
                        search
                    </i>
                </li>,
                <li key="profile">
                    <Link to="/profile">Profile</Link>
                </li>,
                <li key="newPost">
                    <Link to="/post/create">New Post</Link>
                </li>,
                <li key="logout">
                    <button
                        className="btn waves-effect waves-light red"
                        onClick={() => {
                            localStorage.clear();
                            dispatch({ type: "CLEAR" });
                            history.push("/login");
                        }}
                        style={{ margin: "9px" }}
                    >
                        Log-Out
                    </button>
                </li>,
            ];
        } else {
            return [
                <li key="login">
                    <Link to="/login">Login</Link>
                </li>,
                <li key="register">
                    <Link to="/register">Register</Link>
                </li>,
            ];
        }
    };
    const searchQuery = (q) => {
        setQuery(q);
        fetch("/search", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ query: q }),
        })
            .then((res) => res.json())
            .then((data) => {
                setUserList(data.users);
            });
    };
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/login"} className="brand-logo left">
                    Instagram
                </Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div
                id="modal1"
                className="modal"
                ref={searchUser}
                style={{ color: "black" }}
            >
                <div className="modal-content">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => searchQuery(e.target.value)}
                        placeholder="Enter Username"
                    />
                    <ul className="collection">
                        {userList.length > 0 &&
                            userList.map((user) => {
                                if (user._id === state._id) {
                                    return null;
                                }
                                return (
                                    <Link
                                        // to={"/user/" + user._id}
                                        onClick={() => {
                                            setQuery("");
                                            setUserList([]);
                                            M.Modal.getInstance(
                                                searchUser.current
                                            ).close();
                                            window.location.href =
                                                "/user/" + user._id;
                                        }}
                                    >
                                        <li
                                            className="collection-item avatar"
                                            style={{
                                                width: "100%",
                                            }}
                                            key={user._id}
                                        >
                                            <img
                                                src={user.photo}
                                                alt=""
                                                className="circle"
                                            />
                                            <span className="title">
                                                {user.name}
                                            </span>
                                            <p>
                                                {user.email}
                                                <br />
                                                {user.following.indexOf(
                                                    state._id
                                                ) !== -1
                                                    ? "Follows You"
                                                    : ""}
                                            </p>
                                            <p className="secondary-content">
                                                {user.followers.indexOf(
                                                    state._id
                                                ) !== -1
                                                    ? "Following"
                                                    : ""}
                                            </p>
                                        </li>
                                    </Link>
                                );
                            })}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
