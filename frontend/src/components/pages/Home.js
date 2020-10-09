import React, { useState, useEffect } from "react";

const Home = () => {
    const [data, setData] = useState([]);
    const fetchPosts = () => {
        fetch("/posts/all", {
            headers: {
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
    return (
        <div>
            {data.length > 0 ? (
                data.map((item) => {
                    return (
                        <div className="card home-card">
                            <h4>
                                <img
                                    src="https://images.unsplash.com/photo-1569466896818-335b1bedfcce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
                                    className="home-profile-img"
                                    alt=""
                                />
                                {item.author.name}
                            </h4>
                            <div className="card-image">
                                <img src={item.photo} alt="" />
                            </div>
                            <div className="card-content">
                                <h6>{item.caption}</h6>
                                <input
                                    type="text"
                                    placeholder="Add a Comment.."
                                />
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
