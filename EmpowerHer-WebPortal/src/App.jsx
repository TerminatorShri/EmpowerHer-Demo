import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Incidents from './components/Incidents'
import PendingIncidents from './components/pendingIncidents';
import EmergencyReports from './components/EmergencyReports';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import EmergencyResponseScreen from './components/EmergencyResponseScreen';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="Incidents" element={<Incidents />} />
          <Route path="PendingIncidents" element={<PendingIncidents />} />
          <Route path="Post" element={<Post/>}/>
          <Route path='CreatePost' element={<CreatePost/>}/>
          <Route path="EmergencyReports" element={<EmergencyReports/>}/>
          <Route path="EmergencyResponseScreen" element={<EmergencyResponseScreen/>}/>
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
