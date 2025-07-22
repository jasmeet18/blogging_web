import React, { useEffect, useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios'; // ✅ fixed import
import HomePosts from '../components/HomePost';
import Footer from '../components/Footer';
import { URL } from '../url';
import { Link, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';

function Home() {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);
  const [cat, setCat] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts" + search);
      setPosts(res.data);
      setFilterData(res.data);

      // Extract unique categories
      let cata = res.data.map((item) => item.categories || []);
      let sets = new Set();
      cata.forEach((category) => {
        category.forEach((c) => sets.add(c));
      });
      setCat(Array.from(sets));

      // No results check
      setNoResults(res.data.length === 0);
    } catch (err) {
      console.log(err);
      setNoResults(true); // ✅ Show "no results" on error
    } finally {
      setLoader(false); // ✅ Done loading
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  const filterCategory = (category) => {
    const newPosts = posts.filter((post) =>
      post.categories.includes(category)
    );
    setFilterData(newPosts);
  };

  return (
    <div>
      <Navbar />

      {/* Category Filter Buttons */}
      <div className='flex flex-wrap'>
        <div className='p-3 m-5 flex flex-wrap justify-center'>
          {cat.length > 0 &&
            cat.map((category, idx) => (
              <button
                key={idx}
                className='p-3 m-5 h-[90px] w-[150px] border text-lg font-semibold bg-white hover:shadow-blue-200 shadow shadow-black'
                onClick={() => filterCategory(category)}
              >
                {category}
              </button>
            ))}
        </div>
      </div>

      {/* Posts */}
      <div className='flex flex-wrap w-[95%] justify-center'>
        {loader ? (
          <div className='h-screen flex justify-center items-center'>
            <Loader />
          </div>
        ) : !noResults ? (
          filterData.map((post) => (
            <div
              key={post._id}
              className='flex flex-wrap m-2 sm:w-[35vw] lg:w-[45vw] md:w-[50vw]'
            >
              <Link to={user ? `/posts/post/${post._id}` : '/login'}>
                <HomePosts post={post} />
              </Link>
            </div>
          ))
        ) : (
          <h3 className='text-center font-bold mt-16'>
            No posts available
          </h3>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
