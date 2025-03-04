import React, { useState, useEffect } from "react";
import Delete from "./Delete"; 
import Edit from "./Edit";
import '../styles/AddComment.css';

const AddComment = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [userVotes, setUserVotes] = useState({}); // To track user votes

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
        setMessages(messages.map(msg =>
            msg.id === commentId ? { ...msg, content: updatedContent } : msg
        ));
        setEditingCommentId(null);
    };

    const handleVote = (commentId, type) => {
        setMessages(messages.map(msg => {
            if (msg.id === commentId) {
                const prevVote = userVotes[commentId] || 0;
                let newVoteState = 0;
                let voteChange = 0;

                if (type === "up") {
                    if (prevVote === 1) {
                        voteChange = -1; // Undo upvote
                        newVoteState = 0;
                    } else {
                        voteChange = 1; // Upvote
                        newVoteState = 1;
                    }
                } else if (type === "down") {
                    if (prevVote === -1) {
                        voteChange = 1; // Undo downvote
                        newVoteState = 0;
                    } else {
                        voteChange = -1; // Downvote
                        newVoteState = -1;
                    }
                }

                setUserVotes({ ...userVotes, [commentId]: newVoteState });

                return { ...msg, score: msg.score + voteChange };
            }
            return msg;
        }));
    };

    return (
        <div className="section">
            {messages.map((msg) => (
                <div key={msg.id} className="contianer">
                    <button className="score-box">
                        <img 
                            src="./images/icon-plus.svg" 
                            alt="plus" 
                            className="cursor-pointer"
                            onClick={() => handleVote(msg.id, "up")} 
                        />
                        <h5>{msg.score}</h5>
                        <img 
                            src="./images/icon-minus.svg" 
                            alt="minus" 
                            className="cursor-pointer"
                            onClick={() => handleVote(msg.id, "down")} 
                        />
                    </button>
                    <div className="content-box">
                        <div className="innerbox">
                            <div className="amyrobson">
                                <img className="image-amyrobson" src={msg.user.image.png} alt={msg.user.username} />
                                <h5>{msg.user.username}</h5>
                                <h5><span>{msg.createdAt}</span></h5>
                            </div>
                            <div className="reply">
                                {currentUser && msg.user.username === currentUser.username ? (
                                    <>
                                        <Delete commentId={msg.id} onDelete={handleDeleteComment} />
                                        <img 
                                            className="icon-edit" 
                                            src="./images/icon-edit.svg" 
                                            alt="update" 
                                            onClick={() => setEditingCommentId(msg.id)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <h5 onClick={() => setEditingCommentId(msg.id)}>Edit</h5>
                                    </>
                                ) : (
                                    <>
                                        <img className="icon-reply" src="./images/icon-reply.svg" alt="reply" />
                                        <h5>Reply</h5>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="para">
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
                </div>
            ))}
            <div className="container1">
                {currentUser && (
                    <img src={currentUser.image.png} alt="icon-juliusomo" />
                )}
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
