import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../../App";
import socketIOClient from "socket.io-client";

const PrivateMessage = () => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
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
                console.log(data);
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
                console.log(data);
                setNewMessage("");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div className="chat-container">
            <div className="chat-header">
                <h4 style={{ maxHeight: "70px" }}>
                    <img className="home-profile-img" alt="" />
                    <Link
                        style={{
                            position: "relative",
                            top: "-25px",
                        }}
                    >
                        {}
                    </Link>
                </h4>
            </div>
            <div className="message-container">
                {messages &&
                    messages.map((message) => {
                        return message.from._id === state._id ? (
                            <div
                                style={{
                                    border: "0.1px solid rgba(128,128,128,0.4)",
                                }}
                                className="message message-right"
                                key={message._id}
                            >
                                {message.body}
                            </div>
                        ) : (
                            <div
                                className="message message-left"
                                style={{
                                    background: "rgba(128,128,128,0.4)",
                                }}
                                key={message._id}
                            >
                                {message.body}
                            </div>
                        );
                    })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a Message.."
                />
            </form>
        </div>
    );
};

export default PrivateMessage;
