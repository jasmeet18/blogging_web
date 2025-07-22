import React, { useState, useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { ImCross } from 'react-icons/im';
import axios from 'axios';
import { URL } from '../url';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState('*');
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Remove BASE_URL and use URL from import
  // Get token from localStorage
  const token = localStorage.getItem('token');

  const addCategory = () => {
    if (cat && cat !== '*') {
      setCats([...cats, cat]);
      setCat('*');
    }
  };

  const deleteCategory = (i) => {
    const updatedCats = [...cats];
    updatedCats.splice(i, 1);
    setCats(updatedCats);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log("Create button clicked");
    console.log("User context:", user);

    const post = {
      title,
      desc,
      username: user?.username,
      userId: user?._id,
      categories: cats,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("img", filename);
      data.append("file", file);
      post.photo = filename;

      try {
        await axios.post(`${URL}/api/upload`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Image uploaded");
      } catch (err) {
        console.error("Image upload failed:", err.response?.data || err.message);
      }
    }

    try {
      const res = await axios.post(`${URL}/api/posts/create`, post, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("Post created:", res.data);
      navigate(`/posts/post/${res.data._id}`);
    } catch (err) {
      alert("Post creation failed. Check console.");
      console.error("Post creation failed:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex justify-center'>
        <div className='px-6 m-4 border flex flex-col w-[70%] shadow-xl md:px-[200px] mt-8'>
          <h1 className='font-bold text-2xl mt-3 flex justify-center'>
            Create a post
          </h1>
          <form className='w-full flex flex-col space-y-4 mt-4' onSubmit={handleCreate}>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type='text'
              placeholder='Enter post title'
              className='px-4 py-2 outline-none border'
              required
            />
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              className='px-4 py-1 border'
            />
            <div className='flex items-center space-x-4'>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className='border p-2'>
                <option value="*">Select Category</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Big Data">Big Data</option>
                <option value="Block Chain">Block Chain</option>
                <option value="Business Management">Business Management</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Database">Database</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="DevOps">DevOps</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Operating System">Operating System</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <button type='button' onClick={addCategory} className='bg-black text-white px-4 py-2 font-semibold'>
                ADD
              </button>
            </div>

            <div className='flex flex-wrap gap-2'>
              {cats.map((c, i) => (
                <div key={i} className='flex items-center bg-gray-200 px-2 py-1 rounded'>
                  <p className='mr-2'>{c}</p>
                  <ImCross onClick={() => deleteCategory(i)} className='cursor-pointer text-sm text-red-600' />
                </div>
              ))}
            </div>

            <textarea
              onChange={(e) => setDesc(e.target.value)}
              rows={9}
              className='px-4 py-2 outline-none border'
              placeholder='Enter post description'
              required
            ></textarea>

            <button type='submit' className='bg-black text-white font-semibold px-4 py-2 text-lg'>
              Create 
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreatePost;
