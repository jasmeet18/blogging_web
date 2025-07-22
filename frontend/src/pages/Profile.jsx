import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';

function Profile() {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-lg">Please log in to view your profile.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="border p-6 rounded shadow w-full max-w-md bg-white">
          <p><span className="font-semibold">Username:</span> {user.username}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">User ID:</span> {user.id || user._id}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
