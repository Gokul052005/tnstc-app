import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Bus, ChevronLeft, MapPinned, Search, RefreshCw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllStops } from '../data/busDatabaseRuntime';

const BusStopsNearMe = ({ lang, onBack, userLocation }) => {
    const t = {
        ENG: {
            title: 'Nearby Stops',
            locating: 'Locating...',
            detected: 'Detected Location:',
            current: 'Current Area:',
            resetGps: 'Reset to GPS',
            searchPlaceholder: 'Search another area (e.g. Pachampalayam)',
            searching: 'Scanning coordinates for nearby stops...',
            discovered: 'Discovered Near',
            localArea: 'Local Area',
            noStops: 'No specific TNSTC stops found in',
            tryPlanner: 'Try searching from the Route Planner for a wider range.',
            yourArea: 'Your Area'
        },
        TAM: {
            title: 'அருகிலுள்ள நிறுத்தங்கள்',
            locating: 'இருப்பிடத்தைக் கண்டறிகிறது...',
            detected: 'கண்டறியப்பட்ட இடம்:',
            current: 'தற்போதைய பகுதி:',
            resetGps: 'ஜிபிஎஸ் மீட்டமைக்கவும்',
            searchPlaceholder: 'மற்றொரு பகுதியைத் தேடுங்கள் (எ.கா. பாச்சம்பாளையம்)',
            searching: 'அருகிலுள்ள நிறுத்தங்களைத் தேடுகிறது...',
            discovered: 'அருகில் கண்டறியப்பட்டது:',
            localArea: 'உள்ளூர் பகுதி',
            noStops: 'அருகில் எந்த ஒரு நிறுத்தமும் கண்டறியப்படவில்லை:',
            tryPlanner: 'கூடுதல் தகவலுக்கு வழித்தடத் திட்டமிடலைப் பயன்படுத்தித் தேடுங்கள்.',
            yourArea: 'உங்கள் பகுதி'
        }
    }[lang] || {
        title: 'Nearby Stops', locating: 'Locating...', detected: 'Detected Location:', current: 'Current Area:', resetGps: 'Reset to GPS', searchPlaceholder: 'Search another area (e.g. Pachampalayam)', searching: 'Scanning coordinates for nearby stops...', discovered: 'Discovered Near', localArea: 'Local Area', noStops: 'No specific TNSTC stops found in', tryPlanner: 'Try searching from the Route Planner for a wider range.', yourArea: 'Your Area'
    };

    const [placeName, setPlaceName] = useState(t.locating);
    const [nearbyStops, setNearbyStops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isManualSearch, setIsManualSearch] = useState(false);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        return R * c; // Distance in km
    };

    const deg2rad = (deg) => deg * (Math.PI / 180);

    useEffect(() => {
        if (!isManualSearch) {
            searchNearby();
        }
    }, [userLocation, isManualSearch]);

    const searchNearby = async (manualQuery = null) => {
        setIsLoading(true);
        try {
            const allStops = await getAllStops();
            let matches = [];

            if (manualQuery) {
                const query = manualQuery.toLowerCase();
                setPlaceName(manualQuery);
                matches = allStops.filter(s => 
                    s.name.toLowerCase().includes(query) || 
                    s.district.toLowerCase().includes(query) ||
                    (s.taluk && s.taluk.toLowerCase().includes(query))
                ).map(s => ({ ...s, dist: null }));
            } else if (userLocation) {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`);
                const data = await res.json();
                const addr = data?.address || {};
                const specificName = addr.hamlet || addr.village || addr.neighbourhood || addr.suburb || addr.residential || addr.town || addr.city || t.yourArea;
                setPlaceName(specificName);

                matches = allStops
                    .map(s => ({
                        ...s,
                        dist: calculateDistance(userLocation.lat, userLocation.lng, s.lat, s.lng)
                    }))
                    .filter(s => (s.dist !== null && s.dist <= 15) || (specificName && s.name.toLowerCase().includes(specificName.toLowerCase())))
                    .sort((a, b) => (a.dist || 999) - (b.dist || 999));
                
                // If no distance matches, try name-based in district
                if (matches.length === 0) {
                    const district = (addr.state_district || addr.county || '').toLowerCase().replace(' district', '').trim();
                    matches = allStops.filter(s => s.district.toLowerCase().includes(district)).map(s => ({ ...s, dist: null }));
                }
            }
            setNearbyStops(matches);
        } catch (err) {
            console.error("Search error", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsManualSearch(true);
            searchNearby(searchQuery);
        }
    };

    return (
        <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ChevronLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{t.title}</h2>
            </div>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fff', border: '1px solid #E2E8EE' }}>
                {userLocation && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                        <div style={{ flex: 1, padding: '12px', backgroundColor: isManualSearch ? '#F8FAFC' : '#F0F9FF', borderRadius: '10px', fontSize: '0.85rem', color: isManualSearch ? '#64748B' : '#0369A1', display: 'flex', alignItems: 'center', gap: '8px', border: isManualSearch ? '1px solid #E2E8F0' : '1px solid #BAE6FD' }}>
                            <Navigation size={16} /> {isManualSearch ? t.current : t.detected} <strong>{placeName}</strong>
                        </div>
                        {isManualSearch && (
                            <button 
                                onClick={() => { setIsManualSearch(false); setSearchQuery(''); }}
                                style={{ padding: '10px', borderRadius: '10px', border: '1px solid #BAE6FD', backgroundColor: '#F0F9FF', color: '#0369A1', cursor: 'pointer' }}
                                title={t.resetGps}
                            >
                                <RefreshCw size={20} />
                            </button>
                        )}
                    </div>
                )}

                <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
                    <input 
                        type="text" 
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ 
                            width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', 
                            border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.9rem',
                            backgroundColor: '#fff', boxSizing: 'border-box'
                        }}
                    />
                    {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                            <X size={16} />
                        </button>
                    )}
                </form>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6A7E8F' }}>
                            <div className="spinner" style={{ marginBottom: '15px', borderTopColor: 'var(--primary)' }}></div>
                            {t.searching}
                        </div>
                    ) : nearbyStops.length > 0 ? (
                        <>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#455768', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPinned size={18} color="var(--primary)" />
                                {t.discovered} {placeName}
                            </div>
                            {nearbyStops.map((stop, i) => (
                                <motion.div 
                                    key={i} 
                                    whileTap={{ scale: 0.98 }}
                                    style={{ 
                                        padding: '16px', 
                                        border: (stop.dist && stop.dist <= 1.5) ? '2px solid #E0F2FE' : '1px solid #E6EDF3', 
                                        borderRadius: '16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: (stop.dist && stop.dist <= 1.5) ? '#F8FAFC' : '#fff'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ 
                                            width: '42px', height: '42px', 
                                            backgroundColor: (stop.dist && stop.dist <= 1.5) ? '#E0F2FE' : '#F0F4FF', 
                                            borderRadius: '12px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center' 
                                        }}>
                                            <MapPin size={22} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1D2D3A' }}>{stop.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6A7E8F', marginTop: '4px' }}>
                                                {stop.taluk ? `${stop.taluk}, ` : ''}{stop.district}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ 
                                        padding: '8px 12px', 
                                        borderRadius: '999px', 
                                        backgroundColor: (stop.dist && stop.dist <= 1.5) ? 'var(--primary)' : '#F1F5F9', 
                                        color: (stop.dist && stop.dist <= 1.5) ? 'white' : '#475569', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 700 
                                    }}>
                                        {stop.dist ? `${stop.dist.toFixed(1)} km` : t.localArea}
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6A7E8F', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                            <MapPin size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                            <p style={{ margin: 0, fontWeight: 500 }}>{t.noStops} {placeName}.</p>
                            <p style={{ margin: '5px 0 0', fontSize: '0.8rem' }}>{t.tryPlanner}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusStopsNearMe;
