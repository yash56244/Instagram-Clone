import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Register = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const postData = () => {
        if (
            !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                email
            )
        ) {
            M.toast({ html: "Please enter a valid E-mail", classes: "red" });
            return;
        }
        fetch("/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "red" });
                } else {
                    M.toast({ html: data.message, classes: "green" });
                    history.push("/login");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div className="card auth-card">
            <h2 className="insta-font">Instagram</h2>
            <div className="row">
                <div className="input-field col s12">
                    <input
                        id="name"
                        type="text"
                        className="validate"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <label htmlFor="name">Name</label>
                </div>
            </div>
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
            <button
                className="btn waves-effect waves-light"
                onClick={() => postData()}
            >
                Register
            </button>
            <p>
                Have an account? <Link to="/login">Log In</Link>
            </p>
        </div>
    );
};

export default Register;
