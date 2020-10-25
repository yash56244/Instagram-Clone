import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../../App";
import socketIOClient from "socket.io-client";

const PrivateMessage = () => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);
    const { receiverId } = useParams();
    // eslint-disable-next-line no-unused-vars
    const { state, dispatch } = useContext(UserContext);
    const messagesEndRef = useRef(null);
    const fetchMessages = () => {
        fetch(`/inbox/${receiverId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages(data);
            })
            .catch((err) => {
                console.log(err);
            });
        scrollToBottom();
    };
    useEffect(fetchMessages, [lastMessage]);
    useEffect(() => {
        const socket = socketIOClient("http://localhost:3000");
        socket.on("messages", (data) => {
            setLastMessage(data);
        });
    });
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/inbox/${receiverId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                message: newMessage,
            }),
        })
            .then((res) => res.text())
            .then((data) => {
                setNewMessage("");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchProfile = () => {
        fetch(`/user/${receiverId}`, {
            headers: {
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setUser(res.user);
            });
    };
    useEffect(fetchProfile, []);
    return (
        <div className="chat-container">
            <div className="chat-header">
                <h4 style={{ maxHeight: "60px" }}>
                    <img src={user.photo} className="home-profile-img" alt="" />
                    <Link
                        to={"/user/" + user._id}
                        style={{
                            position: "relative",
                            top: "-25px",
                        }}
                    >
                        {user.name}
                    </Link>
                </h4>
            </div>
            <hr></hr>
            <ol className="message-container">
                {messages &&
                    messages.map((message) => {
                        return message.from._id === state._id ? (
                            <div style={{ clear: "both" }} key={message._id}>
                                <div className="message message-right">
                                    {message.body}
                                </div>
                            </div>
                        ) : (
                            <div style={{ clear: "both" }} key={message._id}>
                                <div className="message message-left">
                                    {message.body}
                                </div>
                            </div>
                        );
                    })}
                <div ref={messagesEndRef} />
            </ol>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                />
            </form>
        </div>
    );
};

export default PrivateMessage;
