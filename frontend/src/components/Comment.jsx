import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../pages/url';

function Comment({ comment, user, fetchPostComments }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);

  const isAuthor = user && (user.username === comment.author || user._id === comment.userID);

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`${URL}/api/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchPostComments && fetchPostComments();
    } catch (err) {
      alert('Failed to delete comment');
      console.log(err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${URL}/api/comments/${comment._id}`,
        { comment: editText },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setIsEditing(false);
      fetchPostComments && fetchPostComments();
    } catch (err) {
      alert('Failed to edit comment');
      console.log(err);
    }
  };

  return (
    <div className="border p-2 my-2 rounded">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{comment.author}</span>
        {isAuthor && (
          <div className="flex space-x-2">
            <button onClick={() => setIsEditing(!isEditing)} className="text-blue-600 text-xs">{isEditing ? 'Cancel' : 'Edit'}</button>
            <button onClick={handleDelete} className="text-red-600 text-xs">Delete</button>
          </div>
        )}
      </div>
      {isEditing ? (
        <form onSubmit={handleEdit} className="flex space-x-2 mt-2">
          <input
            value={editText}
            onChange={e => setEditText(e.target.value)}
            className="flex-1 border p-1 text-sm"
          />
          <button type="submit" className="bg-blue-600 text-white px-2 py-1 text-xs">Save</button>
        </form>
      ) : (
        <p className="mt-1 text-sm">{comment.comment}</p>
      )}
    </div>
  );
}

export default Comment;
