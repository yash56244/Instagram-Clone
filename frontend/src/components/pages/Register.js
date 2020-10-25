import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { Preloader } from "react-materialize";

const Register = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const fetchUser = () => {
        if (imageUrl) {
            if (
                !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                    email
                )
            ) {
                M.toast({
                    html: "Please enter a valid E-mail",
                    classes: "red",
                });
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
                    photoUrl: imageUrl,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setLoading(false);
                    if (data.error) {
                        M.toast({ html: data.error, classes: "red" });
                    } else {
                        M.toast({ html: data.message, classes: "green" });
                        history.push("/login");
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                });
        }
    };
    useEffect(fetchUser, [imageUrl]);
    const postData = () => {
        if (!image) {
            return M.toast({ html: "Please add all fields", classes: "red" });
        }
        setLoading(true);
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "yvc");
        fetch("https://api.cloudinary.com/v1_1/yvc/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setImageUrl(res.url);
            })
            .catch((err) => {
                console.log(err);
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
                <div className="file-field input-field">
                    <div className="btn black">
                        <span>Profile Photo</span>
                        <input
                            type="file"
                            onChange={(e) => {
                                setImage(e.target.files[0]);
                            }}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
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
                    "Register"
                )}
            </button>
            <p>
                Have an account?{" "}
                <Link to="/login">
                    <b className="blue-text">Log In</b>
                </Link>
            </p>
        </div>
    );
};

export default Register;
