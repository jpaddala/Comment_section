// import React from "react";
// import '../styles/Delete.css';

// const Delete = ({ commentId, onDelete }) => {
//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this comment?")) {
//       onDelete(commentId);
//     }
//   };
  
//   return (
//     <button className="delete-button" onClick={handleDelete}>
//       <img className="icon-delete" src="./images/icon-delete.svg" alt="delete" />
//       <h5>Delete</h5>
//     </button>
//   );
// };

// export default Delete;
import React, { useState } from "react";
import "../styles/Delete.css";

const Delete = ({ commentId, onDelete }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleDeleteClick = () => {
    setShowPopup(true); // Show the delete confirmation popup
  };

  const handleCancel = () => {
    setShowPopup(false); // Hide the popup when "NO, CANCEL" is clicked
  };

  const handleConfirmDelete = () => {
    onDelete(commentId); // Delete the comment
    setShowPopup(false); // Hide the popup after deletion
  };

  return (
    <>
      <button className="delete-button" onClick={handleDeleteClick}>
        <img className="icon-delete" src="./images/icon-delete.svg" alt="delete" />
        <h5>Delete</h5>
      </button>

      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>Delete comment</h2>
            <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
            <div className="btns">
              <button id="no" onClick={handleCancel}>NO, CANCEL</button>
              <button id="yes" onClick={handleConfirmDelete}>YES, DELETE</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Delete;
