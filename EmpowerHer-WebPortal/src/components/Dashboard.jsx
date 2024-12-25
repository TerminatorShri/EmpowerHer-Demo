import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { faBars, faCoffee, faCookie, faHome, faQuestionCircle, faTachometerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // To check the current path
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

  // Assuming role is stored in Redux under auth state
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const logoutUser = () => {
    dispatch(logout({ role: '', isAuthenticated: false }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar state
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-purple-200">
      {/* Navbar at the top */}
      <header className="w-full bg-purple-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <button onClick={toggleSidebar} className="text-xl font-bold">
          {isSidebarOpen ? 
          <FontAwesomeIcon icon={faHome} />

          : 
          <FontAwesomeIcon icon={faBars} /> 
          } {/* Toggle icon */}
        </button>
        {/* <FontAwesomeIcon icon={faCookie} /> */}
        <h1 className="text-2xl font-bold">{role === "ngo" ? "NGO" : "Police"} Dashboard</h1>
        <button 
          onClick={logoutUser} 
          className="px-4 py-2 bg-white text-purple-600 font-semibold rounded hover:bg-gray-200 transition duration-200"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="w-64 bg-white text-purple-600 p-4 space-y-4">
            {role === 'police' ? (
              <>
                <Link to="EmergencyReports" className="block px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition duration-200 text-xl">
                  Emergency Reports
                </Link>
                <Link to="EmergencyResponseScreen" className="block px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition duration-200 text-xl">
                  Emergency Reponse
                </Link>
              </>
            ) : (
              <>
                <Link to="Incidents" className="block px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition duration-200 text-xl">
                  Incidents
                </Link>
                <Link to="PendingIncidents" className="block px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition duration-200 text-xl">
                  Pending Incidents
                </Link>
                <Link to="Post" className="block px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition duration-200 text-xl">
                  Post
                </Link>
                <Link to="CreatePost" className="block px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition duration-200 text-xl">
                  Create Post
                </Link>
              </>
            )}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col items-center">
          {location.pathname === '/dashboard' ? ( // Check if at dashboard root
            <div className="flex flex-col items-center justify-center text-center text-purple-600 text-lg">
              <FontAwesomeIcon icon={faQuestionCircle}/>
              Nothing in the dashboard. <br/>Open the sidebar for more info.
            </div>
          ) : (
            <div className="w-full max-w-4xl p-6 bg-white rounded-lg">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
