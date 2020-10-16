import React, { useEffect, createContext, useReducer, useContext } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Posts from "./components/pages/Posts";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Profile from "./components/pages/Profile";
import NewPost from "./components/pages/NewPost";
import User from "./components/pages/User";
import PrivateMessage from "./components/pages/PrivateMessage";
import { initialUserState, userReducer } from "./reducers/userReducer";
import M from "materialize-css";
import "./App.css";

export const UserContext = createContext();

const Router = () => {
    const history = useHistory();
    // eslint-disable-next-line no-unused-vars
    const { state, dispatch } = useContext(UserContext);
    const userEffect = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            dispatch({ type: "USER", payload: user });
        } else {
            M.toast({
                html: "You need to login to continue..",
                classes: "red",
            });
            history.push("/login");
        }
    };
    useEffect(userEffect, []);
    return (
        <Switch>
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
            <Route path="/user/:id">
                <User />
            </Route>
            <Route exact path="/posts/me">
                <Posts />
            </Route>
            <Route exact path="/inbox/:id">
                <PrivateMessage />
            </Route>
        </Switch>
    );
};

function App() {
    const [state, dispatch] = useReducer(userReducer, initialUserState);
    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <BrowserRouter>
                <Navbar />
                <Router />
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
