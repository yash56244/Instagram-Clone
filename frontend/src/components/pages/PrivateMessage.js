import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../../App";
import socketIOClient from "socket.io-client";
import aes256 from "aes256";
import sha256 from "sha256";

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
    const getConversationId = (recipients) => {
        recipients.sort();
        let output = "";
        for (let i = 0; i < recipients.length; i++) {
            output += recipients[0];
        }
        return sha256(output);
    };
    const conversationId = getConversationId(recipients);
    const fetchMessages = () => {
        if (state) {
            fetch(`/conversation/${conversationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + sessionStorage.getItem("jwt"),
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res) {
                        const data = res[0].messages;
                        data.forEach((message) => {
                            message.body = aes256.decrypt(
                                sha256(conversationId),
                                message.body
                            );
                        });
                        setMessages(data);
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
            const decryptedMessage = aes256.decrypt(
                sha256(conversationId),
                data
            );
            setLastMessage(decryptedMessage);
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
                authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                message: aes256.encrypt(sha256(conversationId), newMessage),
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
                authorization: "Bearer " + sessionStorage.getItem("jwt"),
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
