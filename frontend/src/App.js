import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Profile from "./components/pages/Profile";
import NewPost from "./components/pages/NewPost";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
            <Route path="/profile" exact>
                <Profile />
            </Route>
            <Route path="/post/create">
                <NewPost />
            </Route>
        </BrowserRouter>
    );
}

export default App;
