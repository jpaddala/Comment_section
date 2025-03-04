import React, { useState, useEffect } from "react";
import Delete from "./Delete";
import Edit from "./Edit";
import ReplySection from "./ReplySection";
import "../styles/AddComment.css";

const AddComment = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);

    useEffect(() => {
        fetch("/data/data.json")
            .then((response) => response.json())
            .then((data) => {
                setCurrentUser(data.currentUser);
                setMessages(data.comments);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;
        const newMsg = {
            id: messages.length + 1,
            content: newMessage,
            createdAt: "just now",
            score: 0,
            user: currentUser,
            replies: []
        };
        setMessages([...messages, newMsg]);
        setNewMessage("");
    };

    const handleDeleteComment = (commentId) => {
        setMessages(messages.filter((msg) => msg.id !== commentId));
    };

    const handleUpdateComment = (commentId, updatedContent) => {
        const updatedMessages = messages.map((msg) => {
            if (msg.id === commentId) {
                return { ...msg, content: updatedContent };
            }
            return msg;
        });
        setMessages(updatedMessages);
        setEditingCommentId(null);
    };

    const handleReplySubmit = (parentId, newReply) => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === parentId
                    ? { ...msg, replies: [...msg.replies, newReply] }
                    : msg
            )
        );
        setReplyingTo(null);
    };

    return (
        <div className="section">
            {messages.map((msg) => (
                <div key={msg.id} className="container">
                    <button className="score-box">
                        <img src="./images/icon-plus.svg" alt="plus" className="cursor-pointer" />
                        <h5>{msg.score}</h5>
                        <img src="./images/icon-minus.svg" alt="minus" className="cursor-pointer" />
                    </button>
                    <div className="content-box">
                        <div className="innerbox">
                            <div className="user-info">
                                <img className="user-avatar" src={msg.user.image.png} alt={msg.user.username} />
                                <h5>{msg.user.username}</h5>
                                <h5><span>{msg.createdAt}</span></h5>
                            </div>
                            <div className="actions">
                                {currentUser && msg.user.username === currentUser.username ? (
                                    <>
                                        <Delete commentId={msg.id} onDelete={handleDeleteComment} />
                                        <img
                                            className="icon-edit"
                                            src="./images/icon-edit.svg"
                                            alt="edit"
                                            onClick={() => setEditingCommentId(msg.id)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <h5 onClick={() => setEditingCommentId(msg.id)}>Edit</h5>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            className="icon-reply"
                                            src="./images/icon-reply.svg"
                                            alt="reply"
                                            onClick={() => setReplyingTo(msg.id)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <h5 onClick={() => setReplyingTo(msg.id)}>Reply</h5>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="comment-content">
                            {editingCommentId === msg.id ? (
                                <Edit
                                    comment={msg}
                                    onUpdate={handleUpdateComment}
                                    onCancel={() => setEditingCommentId(null)}
                                />
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                    {/* Show ReplySection only when reply is clicked */}
                    {replyingTo === msg.id && (
                        <ReplySection
                            currentUser={currentUser}
                            onReplySubmit={(newReply) => handleReplySubmit(msg.id, newReply)}
                        />
                    )}
                    {/* Display Replies */}
                    {msg.replies && msg.replies.map((reply) => (
                        <div key={reply.id} className="reply-box">
                            <p><strong>@{reply.user.username}</strong> {reply.content}</p>
                        </div>
                    ))}
                </div>
            ))}
            <div className="container1">
                {currentUser && <img src={currentUser.image.png} alt="icon-juliusomo" />}
                <textarea
                    id="message"
                    name="message"
                    placeholder="Add a comment..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button id="reply-btn" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default AddComment;
