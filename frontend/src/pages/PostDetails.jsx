import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Comment from '../components/Comment';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import { URL, IF } from '../url';
import { UserContext } from '../context/UserContext';
import Loader from '../components/Loader';

function PostDetails() {
  const PostID = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem('token');

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${URL}/api/posts/${PostID}`);
      setPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/comments/post/${PostID}`);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(`${URL}/api/posts/${PostID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res.data);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${URL}/api/comments/create`,
        {
          comment,
          author: user.username,
          postId: PostID,
          userID: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        }
      );
      setComment("");
      fetchPostComments();
    } catch (err) {
      alert("Failed to post comment. Check console.");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchPostComments();
  }, [PostID]);

  return (
    <div>
      <Navbar />
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="px-8 md:px-[200px] mt-8">
          <div className="border p-3 shadow">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">{post.title}</h1>
              {user?._id === post?.userId && (
                <div className="flex items-center space-x-2">
                  <p
                    className="cursor-pointer"
                    onClick={() => navigate("/edit/" + PostID)}
                  >
                    <BiEdit />
                  </p>
                  <p className="cursor-pointer" onClick={handleDeletePost}>
                    <MdDelete />
                  </p>
                </div>
              )}
            </div>
            <p className="mt-4">{post.desc}</p>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            {/* Single comment form */}
            <form onSubmit={postComment} className="flex space-x-2 mb-4">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                className="flex-1 border p-2"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2">
                Comment
              </button>
            </form>

            {/* Display comments */}
            {comments.map((c, index) => (
              <Comment key={index} comment={c} post={post} user={user} fetchPostComments={fetchPostComments} />
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default PostDetails;
