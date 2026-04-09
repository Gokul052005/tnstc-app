import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TrackBus from './components/TrackBus';
import RoutePlannerDatabase from './components/RoutePlannerDatabase';
import Feedback from './components/Feedback';
import TrackByRouteDatabase from './components/TrackByRouteDatabase';
import TrackByServiceNumber from './components/TrackByServiceNumber';
import BusStopsNearMe from './components/BusStopsNearMe';
import AdminDashboard from './components/AdminDashboard';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBus, setSelectedBus] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [lang, setLang] = useState('ENG');

  const handleTrackBus = (bus) => {
    setSelectedBus(bus);
    setActiveTab('track');
  };

  const handleRouteTrackingClick = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location access granted", position);
          setActiveTab('route-tracking');
        },
        (error) => {
          console.error("Location access denied", error);
          alert("Location access is required for route tracking. Please allow access and try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setActiveTab('route-tracking'); // Fallback to still show the screen
    }
  };

  const handleBusStopsNearMeClick = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location access granted", position);
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setActiveTab('stops-near-me');
        },
        (error) => {
          console.error("Location access denied", error);
          alert("Location access is required to find nearby bus stops. Please allow access and try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setActiveTab('stops-near-me'); // Fallback
    }
  };

  const handlePlannerClick = () => {
    setActiveTab('planner');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home 
          lang={lang}
          onTrackBus={handleTrackBus} 
          onRouteTrackingClick={handleRouteTrackingClick} 
          onBusStopsNearMeClick={handleBusStopsNearMeClick} 
          onPlannerClick={handlePlannerClick} 
          onTrackServiceClick={() => setActiveTab('track-service')}
          onAdminClick={() => setActiveTab('admin')} 
        />;
      case 'track':
        return <TrackBus lang={lang} selectedBus={selectedBus} onBack={() => { setSelectedBus(null); setActiveTab('home'); }} />;
      case 'route-tracking':
        return <TrackByRouteDatabase lang={lang} onBack={() => setActiveTab('home')} />;
      case 'stops-near-me':
        return <BusStopsNearMe lang={lang} onBack={() => setActiveTab('home')} userLocation={userLocation} />;
      case 'planner':
        return <RoutePlannerDatabase lang={lang} onBack={() => setActiveTab('home')} />;
      case 'track-service':
        return <TrackByServiceNumber lang={lang} onBack={() => setActiveTab('home')} />;
      case 'feedback':
        return <Feedback lang={lang} />;
      case 'admin':
        return <AdminDashboard lang={lang} onBack={() => setActiveTab('home')} />;
      default:
        return <Home 
          lang={lang}
          onTrackBus={handleTrackBus} 
          onRouteTrackingClick={handleRouteTrackingClick} 
          onBusStopsNearMeClick={handleBusStopsNearMeClick} 
          onPlannerClick={handlePlannerClick} 
          onTrackServiceClick={() => setActiveTab('track-service')}
          onAdminClick={() => setActiveTab('admin')} 
        />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      ENG: {
        home: 'Welcome',
        track: 'Live Tracking',
        route: 'Vehicle Route',
        stops: 'Nearby Stops',
        planner: 'Route Planner',
        service: 'Service Search',
        feedback: 'Feedback',
        default: 'TNSTC'
      },
      TAM: {
        home: 'வரவேற்கிறோம்',
        track: 'நேரடி கண்காணிப்பு',
        route: 'வாகன வழித்தடம்',
        stops: 'அருகிலுள்ள நிறுத்தங்கள்',
        planner: 'வழித்தட திட்டமிடுபவர்',
        service: 'சேவை தேடல்',
        feedback: 'கருத்து',
        default: 'த.நா.அ.போ.க'
      }
    };
    
    const t = titles[lang] || titles.ENG;
    
    switch (activeTab) {
      case 'home': return t.home;
      case 'track': return t.track;
      case 'route-tracking': return t.route;
      case 'stops-near-me': return t.stops;
      case 'planner': return t.planner;
      case 'track-service': return t.service;
      case 'feedback': return t.feedback;
      default: return t.default;
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}
        >

          {activeTab !== 'planner' && activeTab !== 'admin' && <Header lang={lang} setLang={setLang} title={getPageTitle()} />}
          <main style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: 'var(--navbar-height)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {renderContent()}
          </main>
          {activeTab !== 'admin' && <Navbar lang={lang} activeTab={activeTab} setActiveTab={setActiveTab} />}
        </motion.div>
      )}
    </div>
  );
}

export default App;
