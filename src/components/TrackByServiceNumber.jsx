import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bus, Clock, ChevronLeft, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoutes, initializeBusDatabase } from '../data/busDatabaseRuntime';

const TrackByServiceNumber = ({ lang, onBack }) => {
    const [serviceNo, setServiceNo] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const t = {
        ENG: {
            title: 'Track By Service Number',
            label: 'Enter Reservation / Service Number',
            placeholder: 'e.g. S2, E12, N5',
            search: 'Search Service',
            searching: 'Searching...',
            notFound: 'Service number not found. Please try another number like "S2" or "E12".',
            fetchError: 'Failed to fetch bus data. Please check your connection.',
            route: 'ROUTE',
            stops: 'STOPS',
            depot: 'Depot Name',
            status: 'Status',
            from: 'From',
            to: 'To',
            busType: 'Bus Type',
            originDate: 'Schedule Origin Date',
            start: 'Scheduled Start',
            end: 'Scheduled End',
            help: 'Help Line',
            updated: 'Last Updated At',
            arrival: 'Arrival',
            stopName: 'Stop Name',
            departure: 'Departure',
            source: 'Source',
            destination: 'Destination',
            terminal: 'Terminal',
            origin: 'Origin',
            enroute: 'Enroute',
            running: 'Running',
            scheduled: 'Scheduled',
            completed: 'Completed',
            approximation: 'Approximation'
        },
        TAM: {
            title: 'சேவை எண் மூலம் கண்காணியுங்கள்',
            label: 'முன்பதிவு / சேவை எண்ணை உள்ளிடவும்',
            placeholder: 'உதாரணமாக: S2, E12, N5',
            search: 'சேவையைத் தேடுங்கள்',
            searching: 'தேடுகிறது...',
            notFound: 'சேவை எண் கிடைக்கவில்லை. "S2" அல்லது "E12" போன்ற மற்றொரு எண்ணை முயற்சிக்கவும்.',
            fetchError: 'பேருந்து தகவல்களைப் பெறுவதில் தோல்வி. உங்கள் இணைய இணைப்பைச் சரிபார்க்கவும்.',
            route: 'வழித்தடம்',
            stops: 'நிறுத்தங்கள்',
            depot: 'பணிமனை பெயர்',
            status: 'நிலை',
            from: 'இருந்து',
            to: 'வரை',
            busType: 'பேருந்து வகை',
            originDate: 'அட்டவணை ஆரம்ப தேதி',
            start: 'திட்டமிடப்பட்ட தொடக்கம்',
            end: 'திட்டமிடப்பட்ட முடிவு',
            help: 'உதவி எண்',
            updated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
            arrival: 'வருகை',
            stopName: 'நிறுத்தம் பெயர்',
            departure: 'புறப்பாடு',
            source: 'ஆரம்பம்',
            destination: 'இலக்கு',
            terminal: 'முனையம்',
            origin: 'ஆரம்பம்',
            enroute: 'வழியில்',
            running: 'இயங்குகிறது',
            scheduled: 'திட்டமிடப்பட்டது',
            completed: 'முடிவடைந்தது',
            approximation: 'தோராயமான நேரம்'
        }
    }[lang] || {
        title: 'Track By Service Number', label: 'Enter Reservation / Service Number', placeholder: 'e.g. S2, E12, N5', search: 'Search Service', searching: 'Searching...', notFound: 'Service number not found. Please try another number like "S2" or "E12".', fetchError: 'Failed to fetch bus data. Please check your connection.', route: 'ROUTE', stops: 'STOPS', depot: 'Depot Name', status: 'Status', from: 'From', to: 'To', busType: 'Bus Type', originDate: 'Schedule Origin Date', start: 'Scheduled Start', end: 'Scheduled End', help: 'Help Line', updated: 'Last Updated At', arrival: 'Arrival', stopName: 'Stop Name', departure: 'Departure', source: 'Source', destination: 'Destination', terminal: 'Terminal', origin: 'Origin', enroute: 'Enroute', running: 'Running', scheduled: 'Scheduled', completed: 'Completed', approximation: 'Approximation'
    };

    useEffect(() => {
        initializeBusDatabase();
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        const searchId = serviceNo.trim().toLowerCase();
        if (!searchId) return;

        setLoading(true);
        setError('');
        setResults([]);

        try {
            const routes = await getRoutes();
            const foundRoutes = routes.filter(r => 
                String(r.id).toLowerCase() === searchId
            );

            if (foundRoutes.length > 0) {
                setResults(foundRoutes);
            } else {
                setError(t.notFound);
            }
        } catch (err) {
            setError(t.fetchError);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setServiceNo('');
        setResults([]);
        setError('');
    };

    return (
        <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', padding: '5px', cursor: 'pointer' }}
                >
                    <ChevronLeft size={24} color="#333" />
                </button>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{t.title}</h2>
            </div>

            {/* Search Box */}
            <div className="card" style={{ padding: '20px', backgroundColor: 'white' }}>
                <form onSubmit={handleSearch}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px', display: 'block' }}>
                            {t.label}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                <Bus size={18} />
                            </div>
                            <input
                                type="text"
                                value={serviceNo}
                                onChange={(e) => setServiceNo(e.target.value)}
                                placeholder={t.placeholder}
                                style={{
                                    width: '100%',
                                    padding: '12px 40px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    backgroundColor: '#f8fafc'
                                }}
                            />
                            {serviceNo && (
                                <button 
                                    type="button"
                                    onClick={clearSearch}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="btn-primary" 
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '8px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? t.searching : <><Search size={18} /> {t.search}</>}
                    </button>
                </form>
            </div>

            {/* Results Area */}
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="card" 
                        style={{ padding: '15px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', textAlign: 'center' }}
                    >
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{error}</p>
                    </motion.div>
                )}

                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}
                    >
                        {results.map((route, rIdx) => (
                            <div key={rIdx} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ 
                                    padding: '8px 15px', 
                                    backgroundColor: '#1E293B', 
                                    color: 'white', 
                                    borderRadius: '8px', 
                                    fontSize: '0.9rem', 
                                    fontWeight: 700,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span>{t.route}: {route.from} ↔ {route.to}</span>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({route.stops?.length || 0} {t.stops})</span>
                                </div>

                                {route.buses?.map((bus, idx) => {
                                    const now = new Date();
                                    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
                                    const currentMins = istTime.getHours() * 60 + istTime.getMinutes();

                                    const timeToMins = (timeStr) => {
                                        if (!timeStr) return 0;
                                        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
                                        if (!match) return 0;
                                        let [ , h, m, ampm ] = match;
                                        h = parseInt(h, 10);
                                        m = parseInt(m, 10);
                                        if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
                                        if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
                                        return h * 60 + m;
                                    };

                                    const startMins = timeToMins(bus.departure);
                                    const endMins = timeToMins(bus.arrival) || (startMins + 60);

                                    let status = t.running;
                                    let statusColor = '#059669';

                                    if (currentMins < startMins) {
                                        status = t.scheduled;
                                        statusColor = '#f59e0b';
                                    } else if (currentMins > endMins) {
                                        status = t.completed;
                                        statusColor = '#64748b';
                                    }

                                    return (
                                        <div key={idx} className="card" style={{ padding: '0', backgroundColor: 'white', overflow: 'hidden', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
                                            {/* Row 1: Depot & Status */}
                                            <div style={{ padding: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.depot}</div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#000' }}>{bus.depot?.toUpperCase() || route.depot?.toUpperCase() || 'TNSTC DEPOT'}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.status}</div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: statusColor }}>{status}</div>
                                                </div>
                                            </div>
                                            
                                            <div style={{ borderTop: '1px dashed #e2e8f0', margin: '0 15px' }}></div>

                                            {/* Row 2: From & To */}
                                            <div style={{ padding: '15px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.from}</div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000' }}>{route.from.toUpperCase()}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.to}</div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000' }}>{route.to.toUpperCase()}</div>
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px dashed #e2e8f0', margin: '0 15px' }}></div>

                                            {/* Row 3: Bus Type & Schedule Origin */}
                                            <div style={{ padding: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.busType}</div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000' }}>{bus.serviceType?.toUpperCase()}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.originDate}</div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000' }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</div>
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px dashed #e2e8f0', margin: '0 15px' }}></div>

                                            {/* Row 4: Times */}
                                            <div style={{ padding: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.start}</div>
                                                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#000' }}>{bus.departure}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.end}</div>
                                                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#000' }}>{bus.arrival || '--:--'}</div>
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px dashed #e2e8f0', margin: '0 15px' }}></div>

                                            {/* Row 6: Help Line & Last Updated */}
                                            <div style={{ padding: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#f9fafb' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{t.help}</div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000' }}>0866 2570005</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{t.updated}</div>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#000' }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}, {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}</div>
                                                </div>
                                            </div>

                                            {/* Stops Timeline Header */}
                                            <div style={{ 
                                                display: 'grid', 
                                                gridTemplateColumns: '80px 1fr 80px', 
                                                padding: '12px 15px', 
                                                backgroundColor: '#80CBC4', 
                                                marginTop: '0' 
                                            }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{t.arrival}</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', textAlign: 'center' }}>{t.stopName}</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', textAlign: 'right' }}>{t.departure}</div>
                                            </div>

                                            {/* Stops Timeline Body */}
                                            <div style={{ backgroundColor: '#EEF2FF', padding: '10px 0' }}>
                                                {route.stops?.map((stop, sIdx) => {
                                                    const isSource = sIdx === 0;
                                                    const isDestination = sIdx === route.stops.length - 1;
                                                    
                                                    // Dynamic styling based on status
                                                    const currentStatus = status === t.scheduled ? 'Scheduled' : (status === t.completed ? 'Completed' : 'Running');
                                                    const isScheduled = currentStatus === 'Scheduled';
                                                    const dotColor = isScheduled ? '#80CBC4' : '#3F51B5';
                                                    const statusLabel = isScheduled ? t.approximation : (isSource ? t.origin : isDestination ? t.terminal : t.enroute);
                                                    const lineColor = isScheduled ? '#CBD5E1' : '#3F51B5';

                                                    // Timing Distribution Logic
                                                    const startMins = timeToMins(bus.departure);
                                                    const totalArrivalMins = timeToMins(bus.arrival);
                                                    const totalDuration = totalArrivalMins > startMins ? totalArrivalMins - startMins : 60; // fallback 1hr
                                                    
                                                    const minsPerStop = Math.floor(totalDuration / (route.stops.length - 1 || 1));
                                                    const stopArrivalMins = startMins + (sIdx * minsPerStop);
                                                    const stopDepartureMins = stopArrivalMins + 2; // 2 min halt

                                                    const formatMins = (mins) => {
                                                        let h = Math.floor(mins / 60) % 24;
                                                        const m = mins % 60;
                                                        const ampm = h >= 12 ? 'PM' : 'AM';
                                                        h = h % 12 || 12;
                                                        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
                                                    };

                                                    // Use admin-defined timing if it exists, otherwise use calculated distribution
                                                    const customTime = (bus.stopTimings && bus.stopTimings[stop]) ? bus.stopTimings[stop] : null;
                                                    const dispArrival = isSource ? t.source : (customTime || formatMins(stopArrivalMins));
                                                    const dispDeparture = isDestination ? t.destination : (customTime || formatMins(isSource ? startMins : stopDepartureMins));

                                                    return (
                                                        <div key={sIdx} style={{ 
                                                            display: 'grid', 
                                                            gridTemplateColumns: '80px 1fr 80px', 
                                                            minHeight: '85px',
                                                            padding: '0 15px' 
                                                        }}>
                                                            {/* Arrival Column */}
                                                            <div style={{ paddingTop: '10px' }}>
                                                                {isSource ? (
                                                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{t.source}</span>
                                                                ) : (
                                                                    <>
                                                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000' }}>{dispArrival}</div>
                                                                        {!isScheduled && (
                                                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>{dispArrival}</div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>

                                                            {/* Stop Marker & Name Column */}
                                                            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}>
                                                                {/* Vertical Line */}
                                                                {!isDestination && (
                                                                    <div style={{ 
                                                                        position: 'absolute', 
                                                                        top: '25px', 
                                                                        bottom: '-10px', 
                                                                        width: '2px', 
                                                                        backgroundColor: lineColor, 
                                                                        opacity: isScheduled ? 0.4 : 1,
                                                                        zIndex: 0 
                                                                    }}></div>
                                                                )}
                                                                
                                                                {/* Stop Dot */}
                                                                <div style={{ 
                                                                    width: '18px', 
                                                                    height: '18px', 
                                                                    borderRadius: '50%', 
                                                                    backgroundColor: dotColor, 
                                                                    border: '3px solid white',
                                                                    boxShadow: `0 0 0 1px ${isScheduled ? '#80CBC4' : '#e2e8f0'}`,
                                                                    zIndex: 1,
                                                                    marginBottom: '8px'
                                                                }}></div>

                                                                {/* Stop Name */}
                                                                <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '100%', overflow: 'hidden' }}>
                                                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#000', lineHeight: '1.2', textOverflow: 'ellipsis' }}>
                                                                        {stop.toUpperCase()}
                                                                    </div>
                                                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3F51B5', opacity: isScheduled ? 0.7 : 1, marginTop: '4px' }}>
                                                                        {statusLabel}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Departure Column */}
                                                            <div style={{ paddingTop: '10px', textAlign: 'right' }}>
                                                                {isDestination ? (
                                                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{t.destination}</span>
                                                                ) : (
                                                                <>
                                                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000' }}>{dispDeparture}</div>
                                                                    {!isScheduled && (
                                                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e' }}>{dispDeparture}</div>
                                                                    )}
                                                                </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrackByServiceNumber;
