import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RepLogin from './pages/RepLogin';
import RepSignup from './pages/RepSignup';
import RepDashboard from './pages/RepDashboard';
import ReportIssue from './pages/ReportIssue';
import TrackIssue from './pages/TrackIssue';
import Profile from './pages/Profile';
import MyReports from './pages/MyReports';
import CommunityIssues from './pages/CommunityIssues';
import Notifications from './pages/Notifications';
import IssueDetails from './pages/IssueDetails';


import Analysis from './pages/Analysis';


import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rep-login" element={<RepLogin />} />
          <Route path="/rep-signup" element={<RepSignup />} />
          <Route path="/dashboard" element={<RepDashboard />} />
          <Route path="/community" element={<CommunityIssues />} />
          <Route path="/track" element={<TrackIssue />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/issue/:id" element={<IssueDetails />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-reports" element={<MyReports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
