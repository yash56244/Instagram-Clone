import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="card auth-card">
            <h2 className="insta-font">Instagram</h2>
            <div className="row">
                <div className="input-field col s12">
                    <input id="email" type="email" className="validate" />
                    <label for="email">Email</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input id="password" type="password" className="validate" />
                    <label for="password">Password</label>
                </div>
            </div>
            <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
            >
                Login
            </button>
            <p>
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
