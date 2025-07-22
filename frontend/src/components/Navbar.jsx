import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import Menu from './Menu';
import { UserContext } from '../context/UserContext'; // Update this path accordingly

function Navbar() {
  const [prompt, setPrompt] = useState('');
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const { user } = useContext(UserContext);

  const showMenu = () => {
    setMenu(!menu);
  };

  const handleSearch = () => {
    if (prompt.trim()) {
      navigate(`/?search=${prompt}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className='flex items-center justify-between px-6 md:px-[200px] py-4 bg-black text-white'>
      <h1 className='text-lg md:text-xl font-extrabold'>
        <Link to="/">Blogosphere</Link>
      </h1>

      {path === '/' && (
        <div className='flex justify-center items-center space-x-0'>
          <input
            className='outline-none rounded-l-xl px-3 text-black bg-white'
            placeholder='Search a post'
            type='text'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p onClick={handleSearch} className='cursor-pointer p-2 bg-white text-black rounded-r-xl'>
            <BsSearch />
          </p>
        </div>
      )}

      <div className='hidden md:flex items-center justify-center space-x-4'>
        {user ? (
          <>
            <Link to='/write'>Write</Link>
           
            <div onClick={showMenu} className='cursor-pointer relative'>
              <FaBars />
              {menu && <Menu />}
            </div>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </div>

      <div onClick={showMenu} className='md:hidden text-lg'>
        <p className='cursor-pointer relative'>
          <FaBars />
        </p>
        {menu && <Menu />}
      </div>
    </div>
  );
}

export default Navbar;
