import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bus, Clock, ChevronLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TrackByRoute = ({ onBack }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [userStop, setUserStop] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [results, setResults] = useState(null);

    // Mock data for stops and routes
    const stopsList = [
        'Pachampalayam', 'Palladam', 'Palani', 'Panruti', 'Perundurai',
        'Coimbatore Gandhipuram', 'Erode Central', 'Salem Junction',
        'Madelpalayam', 'Nallur', 'Avinashi', 'Bhavani', 'Chithode'
    ];

    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Suggestions based on 'From' and 'To' being filled, and user typing
        if (userStop.length >= 1 && from && to) {
            const filtered = stopsList.filter(s =>
                s.toLowerCase().includes(userStop.toLowerCase()) &&
                s.toLowerCase() !== from.toLowerCase() &&
                s.toLowerCase() !== to.toLowerCase()
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [userStop, from, to]);

    const handleShowMe = () => {
        if (!from || !to || !userStop) {
            alert('Please fill all fields');
            return;
        }

        // Mock results based on the inputs
        setResults({
            busRoute: 'Route 45-B',
            timings: ['09:15 AM', '12:30 PM', '03:45 PM', '07:10 PM'],
            passedStops: [from, 'Intermediate Stop A', 'Intermediate Stop B'],
            eta: '18 mins',
            currentLocation: 'Intermediate Stop B'
        });
    };

    return (
        <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <ChevronLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>Track By Route</h2>
            </div>

            {!results ? (
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '10px' }}>
                        Enter route details to see live bus progress and arrival timings.
                    </p>

                    <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '5px', display: 'block' }}>From</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                            <MapPin size={18} color="var(--primary)" />
                            <input
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder="Departure Station"
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '5px', display: 'block' }}>To</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                            <MapPin size={18} color="var(--accent)" />
                            <input
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="Destination Station"
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '5px', display: 'block' }}>Your Stop Name</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                            <Search size={18} color="var(--text-light)" />
                            <input
                                value={userStop}
                                onChange={(e) => setUserStop(e.target.value)}
                                placeholder="e.g. Pachampalayam"
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem' }}
                            />
                        </div>

                        <AnimatePresence>
                            {showSuggestions && suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        backgroundColor: 'white',
                                        zIndex: 100,
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        borderRadius: '8px',
                                        marginTop: '5px',
                                        maxHeight: '200px',
                                        overflowY: 'auto'
                                    }}
                                >
                                    {suggestions.map((s, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setUserStop(s);
                                                setShowSuggestions(false);
                                            }}
                                            style={{
                                                padding: '12px 15px',
                                                borderBottom: i === suggestions.length - 1 ? 'none' : '1px solid #f5f5f5',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '10px' }}
                        onClick={handleShowMe}
                    >
                        Show Me
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Active Route</span>
                                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{results.busRoute}</h3>
                                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>{from} <ArrowRight size={10} style={{ display: 'inline' }} /> {to}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>ETA to {userStop}</span>
                                <h3 style={{ margin: 0, color: 'var(--success)' }}>{results.eta}</h3>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', marginBottom: '5px' }}>
                            {results.timings.map((t, i) => (
                                <div key={i} style={{ backgroundColor: '#f0f2f5', padding: '6px 12px', borderRadius: '15px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bus size={18} color="var(--primary)" /> Live Progress
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
                            {results.passedStops.map((stop, i) => (
                                <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', minHeight: '60px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
                                        <div style={{ width: 2, height: '48px', backgroundColor: 'var(--success)' }}></div>
                                    </div>
                                    <div style={{ paddingBottom: '15px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{stop}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Bus Passed</div>
                                    </div>
                                </div>
                            ))}

                            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--primary)', backgroundColor: 'white', position: 'relative', zIndex: 2 }}>
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                                    </div>
                                </div>
                                <div style={{ paddingBottom: '15px' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{userStop}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>Approaching...</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn"
                        style={{ backgroundColor: '#eee', color: 'var(--text)', fontWeight: 600 }}
                        onClick={() => setResults(null)}
                    >
                        Track Another Route
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrackByRoute;
