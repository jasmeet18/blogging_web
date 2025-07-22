import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';
import { URL } from './url';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyBlogs() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await axios.get(`${URL}/api/posts/user/${user.id || user._id}`);
        setPosts(res.data);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [user]);

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-lg">Please log in to view your blogs.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-bold mb-4">My Blogs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>You have not written any blogs yet.</p>
        ) : (
          <div className="w-full max-w-2xl space-y-4">
            {posts.map(post => (
              <Link to={`/posts/post/${post._id}`} key={post._id} className="block border p-4 rounded shadow hover:bg-gray-50">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.desc?.slice(0, 100)}...</p>
                <div className="text-xs text-gray-400 mt-2">{post.categories?.join(', ')}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MyBlogs;
