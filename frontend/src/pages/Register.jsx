import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {URL} from '../url';
import axios from 'axios';

import Footer from '../components/Footer';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post(URL + "/api/auth/register", {
        username,
        email,
        password
      });

      setUsername(res.data.username);
      setemail(res.data.email);
      setpassword(res.data.password);
      seterror(false);
      navigate("/login");

    } catch (err) {
      seterror(true);
      console.log(err);
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between px-6 md:px-[200px] py-4'>
        <h1 className='text-lg md:text-xl font-extrabold'>
          <Link to="/">Blogosphere</Link>
        </h1>
        <h3><Link to="/login">Login</Link></h3>
      </div>

      <div className='w-full flex justify-center items-center h-[80vh]'>
        <div className='flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]'>
          <h1 className='text-xl font-bold text-left'>Create an Account</h1>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-4 py-2 border-black outline-0 border'
            type='text'
            placeholder='Enter your name'
          />
          <input
            onChange={(e) => setemail(e.target.value)}
            className='w-full px-4 py-2 border-black outline-0 border'
            type='email'
            placeholder='Enter your email'
          />
          <input
            onChange={(e) => setpassword(e.target.value)}
            className='w-full px-4 py-2 border-black outline-0 border'
            type='password'
            placeholder='Enter your password'
          />
          <button
            onClick={handleRegister}
            className='w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black'
          >
            Register
          </button>

          {error && <h3 className='text-red-500 text-sm'>Something went wrong</h3>}

          <div className='flex justify-center items-center space-x-3'>
            <p>Already have an account?</p>
            <p className='text-gray-500 hover:text-black'>
              <Link to='/login'>Login</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
