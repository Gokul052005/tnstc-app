import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Bus, Lock, BarChart3, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { ref, set, get, remove } from 'firebase/database';
import logo from '../assets/logo.svg';

const AdminDashboard = ({ onBack }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');

    const [routeId, setRouteId] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [stopsStr, setStopsStr] = useState('');
    const [existingRoutes, setExistingRoutes] = useState([]);
    
    // Dynamically derive current stops for the stops grid
    const currentStops = stopsStr.split(',').map(s => s.trim()).filter(s => s);
    
    const [buses, setBuses] = useState([
        { tripNo: '', serviceType: 'TNSTC EXPRESS', depot: '', departure: '', arrival: '' }
    ]);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    const [activeTab, setActiveTab] = useState('routes'); // 'routes' or 'feedback'
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Routes
                const routeSnapshot = await get(ref(db, 'routes'));
                if (routeSnapshot.exists()) {
                    setExistingRoutes(Object.entries(routeSnapshot.val()).map(([key, val]) => ({
                        dbKey: key, ...val
                    })));
                }
                
                // Fetch Feedback
                const feedbackSnapshot = await get(ref(db, 'feedback'));
                if (feedbackSnapshot.exists()) {
                    const data = Object.entries(feedbackSnapshot.val()).map(([id, val]) => ({
                        id, ...val
                    }));
                    // Sort by newest first
                    setFeedbackList(data.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated]);

    const handleAddBus = () => {
        setBuses([...buses, { tripNo: '', serviceType: 'TNSTC EXPRESS', depot: '', departure: '', arrival: '' }]);
    };

    const handleRemoveBus = (index) => {
        setBuses(buses.filter((_, i) => i !== index));
    };

    const handleBusChange = (index, field, value) => {
        const newBuses = [...buses];
        newBuses[index][field] = value;
        setBuses(newBuses);
    };

    const to24Hour = (time12) => {
        if (!time12) return "";
        const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return time12;
        let [ , h, m, ampm ] = match;
        h = parseInt(h, 10);
        if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
        if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${m}`;
    };

    const to12Hour = (time24) => {
        if (!time24) return "";
        const [hStr, mStr] = time24.split(':');
        let h = parseInt(hStr, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
        return `${h.toString().padStart(2, '0')}:${mStr} ${ampm}`;
    };

    const handleDeleteRoute = async (dbKey, routeInfo) => {
        if (!window.confirm(`Are you sure you want to delete route ${routeInfo.id} (${routeInfo.from} to ${routeInfo.to})?`)) return;
        
        setLoading(true);
        setMessage('');
        try {
            // Priority: dbKey (internal firebase key), then fallback to uniqueKey derivation if somehow missing
            const keyToDelete = dbKey || `${routeInfo.id}_${routeInfo.from}_${routeInfo.to}`.replace(/[.#$[\] /]/g, '_');
            const routeRef = ref(db, `routes/${keyToDelete}`);
            await remove(routeRef);
            setMessage(`Success! Route ${routeInfo.id} deleted.`);
            
            // If we are currently editing this route, reset the form
            if (routeId === routeInfo.id) {
                setRouteId('');
                setFrom('');
                setTo('');
                setStopsStr('');
                setBuses([{ tripNo: '', serviceType: 'TNSTC EXPRESS', depot: '', departure: '', arrival: '' }]);
            }

            // Refresh list
            const snapshot = await get(ref(db, 'routes'));
            if (snapshot.exists()) {
                setExistingRoutes(Object.entries(snapshot.val()).map(([key, val]) => ({
                    dbKey: key, ...val
                })));
            } else {
                setExistingRoutes([]);
            }
        } catch (error) {
            console.error('Error deleting:', error);
            setMessage(`Error deleting route: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!routeId || !from || !to || !stopsStr) {
            setMessage('Please fill in all core fields (ID, From, To, Stops).');
            return;
        }

        const parsedStops = stopsStr.split(',').map(s => s.trim()).filter(s => s);
        
        // Auto-fix: ensure From and To are safely in the stops list, only if they aren't completely blank
        if (parsedStops.length > 0 && from.trim() && to.trim()) {
            if (parsedStops[0].toLowerCase() !== from.toLowerCase().trim()) {
                parsedStops.unshift(from.trim());
            }
            if (parsedStops[parsedStops.length - 1].toLowerCase() !== to.toLowerCase().trim()) {
                parsedStops.push(to.trim());
            }
        }
        
        const routeData = {
            id: routeId,
            from: from.trim(),
            to: to.trim(),
            stops: parsedStops,
            buses: buses.filter(b => b.tripNo && b.departure && b.arrival)
        };

        setLoading(true);
        setMessage('');

        try {
            // SAFE SPLIT KEY: Service ID + From + To
            const uniqueKey = `${routeId}_${from.trim()}_${to.trim()}`.replace(/[.#$[\] /]/g, '_');
            const routeRef = ref(db, `routes/${uniqueKey}`);
            await set(routeRef, routeData);
            
            setMessage(`Success! Service ${routeId} from ${from} to ${to} saved separately.`);
            
            // Refresh list
            const snapshot = await get(ref(db, 'routes'));
            if (snapshot.exists()) {
                setExistingRoutes(Object.entries(snapshot.val()).map(([key, val]) => ({
                    dbKey: key, ...val
                })));
            }

            // Reset
            setRouteId('');
            setFrom('');
            setTo('');
            setStopsStr('');
            setBuses([{ tripNo: '', serviceType: 'TNSTC EXPRESS', depot: '', departure: '', arrival: '' }]);
        } catch (error) {
            console.error('Error saving:', error);
            setMessage(`Error saving route: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', 
        fontSize: '1rem', marginBottom: '15px', boxSizing: 'border-box'
    };
    
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 500, color: '#444' };

    if (!isAuthenticated) {
        return (
            <div style={{ 
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)', 
                flex: 1, 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '20px'
            }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                        padding: '50px 30px 40px', 
                        borderRadius: '32px', 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
                        textAlign: 'center', 
                        maxWidth: '400px', 
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    {/* Official Logo at Top */}
                    <div style={{
                        position: 'absolute',
                        top: '-45px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '90px',
                        height: '90px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        padding: '10px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2
                    }}>
                        <img src={logo} alt="TNSTC Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#1E293B', fontWeight: 800 }}>Welcome Admin</h2>
                        <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '30px' }}>Secure area for TNSTC personnel</p>
                    </div>
                    
                    {pinError && (
                        <motion.p 
                            initial={{ x: -10 }} 
                            animate={{ x: 0 }}
                            style={{ color: '#EF4444', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 600, backgroundColor: '#FEF2F2', padding: '10px', borderRadius: '8px' }}
                        >
                            {pinError}
                        </motion.p>
                    )}
                    
                    <div style={{ position: 'relative', marginBottom: '25px' }}>
                        <input 
                            type="password" 
                            value={pin} 
                            onChange={e => { setPin(e.target.value); setPinError(''); }} 
                            placeholder="••••" 
                            style={{ 
                                width: '100%', 
                                padding: '15px', 
                                border: '2px solid #E2E8F0', 
                                borderRadius: '12px', 
                                fontSize: '1.8rem', 
                                textAlign: 'center', 
                                letterSpacing: '10px', 
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                color: '#1E3A8A'
                            }} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (pin === '1234') {
                                        setIsAuthenticated(true);
                                    } else {
                                        setPinError('Incorrect PIN Access Denied');
                                        setPin('');
                                    }
                                }
                            }}
                        />
                    </div>
                    
                    <button 
                        onClick={() => {
                            if (pin === '1234') {
                                setIsAuthenticated(true);
                            } else {
                                setPinError('Incorrect PIN Access Denied');
                                setPin('');
                            }
                        }}
                        style={{ 
                            width: '100%', 
                            padding: '16px', 
                            backgroundColor: '#1D4ED8', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '12px', 
                            fontSize: '1.1rem', 
                            fontWeight: 700, 
                            cursor: 'pointer', 
                            boxShadow: '0 10px 15px -3px rgba(29, 78, 216, 0.3)',
                            transition: 'transform 0.2s, background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E40AF'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                    >
                        Unlock Dashboard
                    </button>
                    
                    <button 
                        onClick={() => { setPin(''); onBack(); }} 
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            backgroundColor: 'transparent', 
                            color: '#94A3B8', 
                            border: 'none', 
                            fontSize: '0.95rem', 
                            marginTop: '20px', 
                            cursor: 'pointer', 
                            fontWeight: 500 
                        }}
                    >
                        Cancel & Go Back
                    </button>
                </motion.div>
                
                <div style={{ marginTop: '30px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                    © 2026 TNSTC Live Distribution Management
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f5f7fa', flex: 1, minHeight: '100vh' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                    onClick={() => { setIsAuthenticated(false); setPin(''); }}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 500 }}>Admin Dashboard</h1>
            </div>

            <div style={{ display: 'flex', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
                <button 
                    onClick={() => setActiveTab('routes')}
                    style={{ 
                        flex: 1, padding: '15px', border: 'none', background: 'none', 
                        borderBottom: activeTab === 'routes' ? '3px solid var(--primary)' : 'none',
                        color: activeTab === 'routes' ? 'var(--primary)' : '#666',
                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    <Bus size={18} /> Route Manager
                </button>
                <button 
                    onClick={() => setActiveTab('feedback')}
                    style={{ 
                        flex: 1, padding: '15px', border: 'none', background: 'none', 
                        borderBottom: activeTab === 'feedback' ? '3px solid var(--primary)' : 'none',
                        color: activeTab === 'feedback' ? 'var(--primary)' : '#666',
                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    <MessageSquare size={18} /> User Feedback ({feedbackList.length})
                </button>
            </div>
            
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
                {activeTab === 'routes' ? (
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.3rem', margin: 0, color: '#1D2D3A' }}>Add / Edit Route</h2>
                        <select 
                            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', backgroundColor: '#F8FBFF', color: 'var(--primary)', fontWeight: 500 }}
                            onChange={(e) => {
                                const matched = existingRoutes.find(r => (r.dbKey || r.id) === e.target.value);
                                if (matched) {
                                    setRouteId(matched.id);
                                    setFrom(matched.from || '');
                                    setTo(matched.to || '');
                                    setStopsStr(matched.stops ? matched.stops.join(', ') : '');
                                    setBuses(matched.buses && matched.buses.length > 0 ? matched.buses : [{ tripNo: '', serviceType: 'TNSTC EXPRESS', depot: '', departure: '', arrival: '' }]);
                                    setMessage(`Loaded route ${matched.id} (${matched.from} to ${matched.to}) to edit.`);
                                }
                            }}
                        >
                            <option value="">✎ Edit Old Route...</option>
                            {existingRoutes.map(r => (
                                <option key={r.dbKey || r.id} value={r.dbKey || r.id}>{r.id} ({r.from} to {r.to})</option>
                            ))}
                        </select>
                    </div>
                    
                    {message && (
                        <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '20px', 
                            backgroundColor: message.includes('Success') ? '#E3F8EB' : '#FFEBEB', 
                            color: message.includes('Success') ? '#0E7A40' : '#CC1A2B',
                            fontWeight: 500 }}>
                            {message}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <label style={labelStyle}>Route ID / Service No</label>
                        <input style={inputStyle} value={routeId} onChange={e => setRouteId(e.target.value)} placeholder="e.g. M1, 4112, E15" required />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Origin From</label>
                                <input style={inputStyle} value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Madurai" required />
                            </div>
                            <div>
                                <label style={labelStyle}>Destination To</label>
                                <input style={inputStyle} value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Chennai" required />
                            </div>
                        </div>

                        <label style={labelStyle}>All Stops on Route (Comma separated in order)</label>
                        <textarea 
                            style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} 
                            value={stopsStr} 
                            onChange={e => setStopsStr(e.target.value)} 
                            placeholder="e.g. Madurai, Trichy, Tindivanam, Chennai" 
                            required 
                        />
                        
                        <div style={{ borderTop: '2px dashed #eee', marginTop: '10px', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1D2D3A' }}>Bus Timings</h3>
                                <button type="button" onClick={handleAddBus} style={{ 
                                    display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', 
                                    backgroundColor: '#EBF4FF', color: 'var(--primary)', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                    fontWeight: 600
                                }}>
                                    <Plus size={16} /> Add Timing
                                </button>
                            </div>

                            {buses.map((bus, index) => (
                                <div key={index} style={{ backgroundColor: '#F8FBFF', padding: '16px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #DCEAF7' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#3A506B' }}><Bus size={18} /> Bus Schedule #{index + 1}</div>
                                        {buses.length > 1 && (
                                            <Trash2 size={18} color="#e53935" style={{ cursor: 'pointer' }} onClick={() => handleRemoveBus(index)} />
                                        )}
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                                        <input style={{...inputStyle, marginBottom: 0}} placeholder="Trip No (e.g. 5370)" value={bus.tripNo} onChange={e => handleBusChange(index, 'tripNo', e.target.value)} required />
                                        <select style={{...inputStyle, marginBottom: 0, paddingRight: '5px'}} value={bus.serviceType} onChange={e => handleBusChange(index, 'serviceType', e.target.value)}>
                                            <option>TNSTC TOWN</option>
                                            <option>TNSTC EXPRESS</option>
                                            <option>TNSTC ULTRA</option>
                                        </select>
                                        <input style={{...inputStyle, marginBottom: 0}} placeholder="Depot Name" value={bus.depot} onChange={e => handleBusChange(index, 'depot', e.target.value)} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#6A7E8F', marginBottom: '4px' }}>Departure</span>
                                                <input type="time" style={{...inputStyle, marginBottom: 0, padding: '12px 8px'}} value={to24Hour(bus.departure)} onChange={e => handleBusChange(index, 'departure', to12Hour(e.target.value))} required />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#6A7E8F', marginBottom: '4px' }}>Arrival</span>
                                                <input type="time" style={{...inputStyle, marginBottom: 0, padding: '12px 8px'}} value={to24Hour(bus.arrival)} onChange={e => handleBusChange(index, 'arrival', to12Hour(e.target.value))} required />
                                            </div>
                                        </div>
                                    </div>

                                    {currentStops.length > 0 && (
                                        <div style={{ padding: '12px', backgroundColor: '#eef2f9', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#455768', marginBottom: '10px' }}>Exact Timings Per Stop (Optional)</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                {currentStops.map(stop => (
                                                    <div key={stop} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span style={{ fontSize: '0.85rem', color: '#333', width: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={stop}>{stop}</span>
                                                        <input 
                                                            type="time"
                                                            style={{ ...inputStyle, marginBottom: 0, padding: '8px', fontSize: '0.85rem', flex: 1 }} 
                                                            value={to24Hour(bus.stopTimings?.[stop] || '')}
                                                            onChange={e => {
                                                                const newBuses = [...buses];
                                                                if (!newBuses[index].stopTimings) newBuses[index].stopTimings = {};
                                                                newBuses[index].stopTimings[stop] = to12Hour(e.target.value);
                                                                setBuses(newBuses);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{
                                width: '100%', padding: '16px', backgroundColor: 'var(--primary)', color: 'white', 
                                border: 'none', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 600, 
                                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px',
                                opacity: loading ? 0.7 : 1, boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                            }}
                        >
                            <Save size={22} /> {loading ? 'Saving...' : 'Deploy Route Online'}
                        </button>
                    </form>

                    {/* Existing Routes List with Delete Option */}
                    <div style={{ marginTop: '40px', borderTop: '2px solid #f0f0f0', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: '#1D2D3A', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bus size={20} /> Total Active Routes ({existingRoutes.length})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {existingRoutes.map((r) => (
                                <div key={r.dbKey || r.id} style={{ 
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                    padding: '12px 16px', backgroundColor: '#F8FBFF', borderRadius: '10px',
                                    border: '1px solid #E1E9F4'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#1D2D3A' }}>{r.id}: {r.from} ↔ {r.to}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6A7E8F', marginTop: '2px' }}>
                                            {r.stops?.length || 0} stops • {r.buses?.length || 0} schedules
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={() => {
                                                setRouteId(r.id);
                                                setFrom(r.from || '');
                                                setTo(r.to || '');
                                                setStopsStr(r.stops ? r.stops.join(', ') : '');
                                                setBuses(r.buses && r.buses.length > 0 ? r.buses : [{ tripNo: '', serviceType: 'TNSTC EXPRESS', depot: '', departure: '', arrival: '' }]);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            style={{ padding: '6px 10px', backgroundColor: '#EBF4FF', color: 'var(--primary)', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteRoute(r.dbKey || r.id, r)}
                                            style={{ padding: '6px 10px', backgroundColor: '#FFEBEB', color: '#CC1A2B', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                ) : (
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1D2D3A' }}>User Feedback ({feedbackList.length})</h2>
                        
                        {feedbackList.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6A7E8F' }}>
                                <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                <p>No feedback received yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {feedbackList.map((item) => (
                                    <div key={item.id} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #E6EDF3', backgroundColor: '#F9FBFC' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {[1,2,3,4,5].map(s => (
                                                    <span key={s} style={{ color: item.rating >= s ? '#FFB800' : '#ddd', fontSize: '1.2rem' }}>★</span>
                                                ))}
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: '#6A7E8F' }}>{item.istDisplay}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px', textTransform: 'capitalize' }}>
                                            Category: {item.category || 'General'}
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#2A3E50', lineHeight: 1.4 }}>
                                            {item.comment || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No comment provided</span>}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
