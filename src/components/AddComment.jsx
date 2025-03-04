import React, { useState, useEffect } from "react";
import Delete from "./Delete";
import Edit from "./Edit";
import "../styles/AddComment.css";

const AddComment = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [userVotes, setUserVotes] = useState({}); // Tracks votes per comment

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

    const handleVote = (commentId, voteType) => {
        setMessages(messages.map(msg => {
            if (msg.id === commentId) {
                const upvoteSelected = userVotes[commentId] === "upvote";
                const downvoteSelected = userVotes[commentId] === "downvote";
                let newScore = msg.score;
                let newVoteState = "none";

                if (voteType === "upvote") {
                    if (!upvoteSelected && !downvoteSelected) {
                        newScore += 1;
                        newVoteState = "upvote";
                    } else if (!upvoteSelected && downvoteSelected) {
                        newScore += 2;
                        newVoteState = "upvote";
                    } else if (upvoteSelected) {
                        newScore -= 1;
                        newVoteState = "none";
                    }
                } else if (voteType === "downvote") {
                    if (!downvoteSelected && !upvoteSelected) {
                        newScore -= 1;
                        newVoteState = "downvote";
                    } else if (!downvoteSelected && upvoteSelected) {
                        newScore -= 2;
                        newVoteState = "downvote";
                    } else if (downvoteSelected) {
                        newScore += 1;
                        newVoteState = "none";
                    }
                }

                setUserVotes({ ...userVotes, [commentId]: newVoteState });

                return { ...msg, score: newScore };
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
                            className={`cursor-pointer ${userVotes[msg.id] === "upvote" ? "voted" : ""}`}
                            data-id="upvote-button"
                            data-voted={userVotes[msg.id] === "upvote"}
                            onClick={() => handleVote(msg.id, "upvote")} 
                        />
                        <h5 data-id="score-count">{msg.score}</h5>
                        <img 
                            src="./images/icon-minus.svg" 
                            alt="minus" 
                            className={`cursor-pointer ${userVotes[msg.id] === "downvote" ? "voted" : ""}`}
                            data-id="downvote-button"
                            data-voted={userVotes[msg.id] === "downvote"}
                            onClick={() => handleVote(msg.id, "downvote")} 
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
