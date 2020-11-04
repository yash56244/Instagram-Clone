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
    const recipients = [state ? state._id : "", receiverId];
    recipients.sort();
    const conversationId = recipients[0] + recipients[1];
    // const socket = state
    //     ? socketIOClient("http://localhost:3000", {
    //           query: { id: state._id },
    //       })
    //     : socketIOClient("http://localhost:3000");
    const fetchMessages = () => {
        if (state) {
            fetch(`/conversation/${conversationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        setMessages(data[0].messages);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            scrollToBottom();
        }
    };
    useEffect(fetchMessages, [lastMessage, state]);
    useEffect(() => {
        const socket = socketIOClient("http://localhost:3000");
        socket.on("message", (data) => {
            setLastMessage(data);
        });
    });
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/inbox", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                message: newMessage,
                conversationId: conversationId,
                recipients,
            }),
        })
            .then((res) => res.json())
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
                        return message.from === state._id ? (
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
