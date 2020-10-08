import React from "react";

const Home = () => {
    return (
        <div>
            <div className="card home-card">
                <h4>
                    <img
                        src="https://images.unsplash.com/photo-1569466896818-335b1bedfcce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
                        className="home-profile-img"
                        alt=""
                    />
                    Yash Chaudhari
                </h4>
                <div className="card-image">
                    <img
                        src="https://images.unsplash.com/photo-1569466896818-335b1bedfcce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
                        alt=""
                    />
                </div>
                <div className="card-content">
                    <h6>Caption</h6>
                    <input type="text" placeholder="Add a Comment.." />
                </div>
            </div>
        </div>
    );
};

export default Home;
