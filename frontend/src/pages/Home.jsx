import React from 'react';
import LandingPage from './LandingPage';
import CitizenHome from './CitizenHome';
import RepDashboard from './RepDashboard';

const Home = () => {
    const token = localStorage.getItem('token');
    const isRep = localStorage.getItem('is_representative') === 'true';

    if (!token) {
        return <LandingPage />;
    }

    if (isRep) {
        return <RepDashboard />;
    }

    return <CitizenHome />;
};

export default Home;
