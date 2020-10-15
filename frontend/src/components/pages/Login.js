/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { Preloader } from "react-materialize";
import { UserContext } from "../../App";

const Login = () => {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const postData = () => {
        if (
            !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                email
            )
        ) {
            M.toast({ html: "Please enter a valid E-mail", classes: "red" });
            return;
        }
        setLoading(true);
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                if (data.error) {
                    M.toast({ html: data.error, classes: "red" });
                } else {
                    localStorage.setItem("jwt", data.token);
                    delete data.user.password;
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: "USER", payload: data.user });
                    M.toast({
                        html: "Successfully Logged IN",
                        classes: "green",
                    });
                    history.push("/");
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };
    return (
        <div className="card auth-card">
            <h2 className="insta-font">Instagram</h2>
            <div className="row">
                <div className="input-field col s12">
                    <input
                        id="email"
                        type="email"
                        className="validate"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <label htmlFor="email">Email</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input
                        id="password"
                        type="password"
                        className="validate"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <label htmlFor="password">Password</label>
                </div>
            </div>
            <button className="btn black" onClick={() => postData()}>
                {loading ? (
                    <Preloader
                        active={loading}
                        color="blue"
                        flashing
                        size="small"
                    />
                ) : (
                    "Login"
                )}
            </button>
            <p>
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
