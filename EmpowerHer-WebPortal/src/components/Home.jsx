import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">Welcome to the Rakshita Web Portal</h1>
      
      <div className="home-buttons">
        <Link to="/login">
          <button className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
