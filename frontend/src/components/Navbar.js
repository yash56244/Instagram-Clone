import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);
    const renderList = () => {
        if (state) {
            return [
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
        </nav>
    );
};

export default Navbar;
