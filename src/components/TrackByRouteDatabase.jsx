import React, { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Bus, ChevronLeft, ArrowRight, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    findTrackingResult,
    formatStopOption,
    getAllStops,
    initializeBusDatabase,
} from '../data/busDatabaseRuntime';

const TrackByRouteDatabase = ({ lang, onBack }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [userStop, setUserStop] = useState('');
    const [selectedFrom, setSelectedFrom] = useState(null);
    const [selectedTo, setSelectedTo] = useState(null);
    const [selectedUserStop, setSelectedUserStop] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [results, setResults] = useState(null);
    const [stops, setStops] = useState([]);
    const [activeField, setActiveField] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const t = {
        ENG: {
            title: 'Track By Route',
            subtitle: 'Enter route details to see live bus progress and arrival timings.',
            from: 'From',
            to: 'To',
            userStop: 'Your Stop Name',
            fromPlaceholder: 'Departure Station',
            toPlaceholder: 'Destination Station',
            userStopPlaceholder: 'e.g. Pachampalayam',
            showMe: 'Show Me',
            loading: 'Loading Database...',
            fillFields: 'Please fill all fields',
            noMatching: 'No matching route found in the current database',
            activeRoute: 'Active Route',
            etaTo: 'ETA to',
            liveProgress: 'Live Progress',
            currentLoc: 'At Station',
            departed: 'Departed',
            passed: 'Bus passed',
            approaching: 'Approaching...',
            trackAnother: 'Track Another Route',
            notStarted: 'Bus not started yet',
            allFinished: 'All trips finished for today',
            checkBack: 'Check back tomorrow for morning services',
            liveUpdate: 'Live Sync',
            estArrival: 'Expected at',
            arrivingSoon: 'Arriving Soon!'
        },
        TAM: {
            title: 'வழித்தடம் மூலம் கண்காணி',
            subtitle: 'நேரடி பேருந்து முன்னேற்றம் மற்றும் வரும் நேரங்களைக் காண வழித்தட விவரங்களை உள்ளிடவும்.',
            from: 'இருந்து',
            to: 'வரை',
            userStop: 'உங்கள் நிறுத்தத்தின் பெயர்',
            fromPlaceholder: 'புறப்படும் நிலையம்',
            toPlaceholder: 'சேருமிடம் நிலையம்',
            userStopPlaceholder: 'எ.கா. பாச்சம்பாளையம்',
            showMe: 'தேடல்',
            loading: 'தரவுத்தளம் ஏற்றப்படுகிறது...',
            fillFields: 'தயவுசெய்து அனைத்து இடங்களையும் நிரப்பவும்',
            noMatching: 'தற்போதைய தரவுத்தளத்தில் பொருத்தமான வழித்தடம் எதுவும் இல்லை',
            activeRoute: 'தற்போதைய வழித்தடம்',
            etaTo: 'இங்கு வருவதற்கான நேரம்:',
            liveProgress: 'நேரடி முன்னேற்றம்',
            currentLoc: 'நிலையத்தில் உள்ளது',
            departed: 'கிளம்பிவிட்டது',
            passed: 'பேருந்து கடந்துவிட்டது',
            approaching: 'நெருங்குகிறது...',
            trackAnother: 'மற்றொரு வழியைத் தேடுங்கள்',
            notStarted: 'பேருந்து இன்னும் தொடங்கவில்லை',
            allFinished: 'இன்றைய அனைத்து பயணங்களும் முடிந்துவிட்டன',
            checkBack: 'காலை சேவைகளுக்கு நாளை மீண்டும் சரிபார்க்கவும்',
            liveUpdate: 'நேரடி புதுப்பிப்பு',
            estArrival: 'எதிர்பார்க்கப்படும் நேரம்',
            arrivingSoon: 'விரைவில் வருகிறது!'
        }
    }[lang] || {
        title: 'Track By Route', subtitle: 'Enter route details to see live bus progress and arrival timings.', from: 'From', to: 'To', userStop: 'Your Stop Name', fromPlaceholder: 'Departure Station', toPlaceholder: 'Destination Station', userStopPlaceholder: 'e.g. Pachampalayam', showMe: 'Show Me', loading: 'Loading Database...', fillFields: 'Please fill all fields', noMatching: 'No matching route found in the current database', activeRoute: 'Active Route', etaTo: 'ETA to', liveProgress: 'Live Progress', currentLoc: 'At Station', departed: 'Departed', passed: 'Bus passed', approaching: 'Approaching...', trackAnother: 'Track Another Route', notStarted: 'Bus not started yet', liveUpdate: 'Live Sync', estArrival: 'Expected at', arrivingSoon: 'Arriving Soon!'
    };

    useEffect(() => {
        let isMounted = true;

        const loadDatabase = async () => {
            try {
                await initializeBusDatabase();
                const allStops = await getAllStops();

                if (isMounted) {
                    setStops(allStops);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadDatabase();

        return () => {
            isMounted = false;
        };
    }, []);

    const suggestions = useMemo(() => {
        if (!activeField) {
            return [];
        }

        const queryMap = {
            from,
            to,
            userStop,
        };

        const query = queryMap[activeField].toLowerCase();
        const filtered = stops.filter((stop) => {
            if (activeField === 'to' && stop.id === selectedFrom?.id) {
                return false;
            }

            if (activeField === 'from' && stop.id === selectedTo?.id) {
                return false;
            }

            if (activeField === 'userStop' && (stop.id === selectedFrom?.id || stop.id === selectedTo?.id)) {
                return false;
            }

            return formatStopOption(stop).toLowerCase().includes(query);
        });

        return filtered.slice(0, 12);
    }, [activeField, from, selectedFrom, selectedTo, stops, to, userStop]);

    useEffect(() => {
        setShowSuggestions(Boolean(activeField && suggestions.length > 0));
    }, [activeField, suggestions]);

    const handleSelect = (stop) => {
        if (activeField === 'from') {
            setSelectedFrom(stop);
            setFrom(formatStopOption(stop));
        }

        if (activeField === 'to') {
            setSelectedTo(stop);
            setTo(formatStopOption(stop));
        }

        if (activeField === 'userStop') {
            setSelectedUserStop(stop);
            setUserStop(formatStopOption(stop));
        }

        setActiveField(null);
        setShowSuggestions(false);
    };

    const handleShowMe = async () => {
        if (!selectedFrom || !selectedTo || !selectedUserStop) {
            alert(t.fillFields);
            return;
        }

        const nextResults = await findTrackingResult(
            selectedFrom.name,
            selectedTo.name,
            selectedUserStop.name
        );

        if (!nextResults) {
            alert(t.noMatching);
            return;
        }

        setResults(nextResults);
    };

    // Auto-refresh logic (every 10 seconds)
    useEffect(() => {
        let interval;
        if (results && (results.status === 'live' || results.status === 'upcoming')) {
            interval = setInterval(async () => {
                const nextResults = await findTrackingResult(
                    selectedFrom.name,
                    selectedTo.name,
                    selectedUserStop.name
                );
                if (nextResults) {
                    setResults(nextResults);
                }
            }, 10000);
        }
        return () => clearInterval(interval);
    }, [results, selectedFrom, selectedTo, selectedUserStop]);

    const renderSuggestions = () => (
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
                        overflowY: 'auto',
                    }}
                >
                    {suggestions.map((stop) => (
                        <div
                            key={stop.id}
                            onClick={() => handleSelect(stop)}
                            style={{
                                padding: '12px 15px',
                                borderBottom: '1px solid #f5f5f5',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                            }}
                        >
                            {formatStopOption(stop)}
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <ChevronLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{t.title}</h2>
            </div>

            {!results ? (
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '10px' }}>
                        {t.subtitle}
                    </p>

                    <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '5px', display: 'block' }}>{t.from}</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                            <MapPin size={18} color="var(--primary)" />
                            <input
                                value={from}
                                onChange={(e) => {
                                    setFrom(e.target.value);
                                    setSelectedFrom(null);
                                }}
                                onFocus={() => setActiveField('from')}
                                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                                placeholder={t.fromPlaceholder}
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem' }}
                            />
                            {from && (
                                <X 
                                    size={18} 
                                    color="#94A3B8" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={() => {
                                        setFrom('');
                                        setSelectedFrom(null);
                                    }}
                                />
                            )}
                        </div>
                        {activeField === 'from' && renderSuggestions()}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '5px', display: 'block' }}>{t.to}</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                            <MapPin size={18} color="var(--accent)" />
                            <input
                                value={to}
                                onChange={(e) => {
                                    setTo(e.target.value);
                                    setSelectedTo(null);
                                }}
                                onFocus={() => setActiveField('to')}
                                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                                placeholder={t.toPlaceholder}
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem' }}
                            />
                            {to && (
                                <X 
                                    size={18} 
                                    color="#94A3B8" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={() => {
                                        setTo('');
                                        setSelectedTo(null);
                                    }}
                                />
                            )}
                        </div>
                        {activeField === 'to' && renderSuggestions()}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '5px', display: 'block' }}>{t.userStop}</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                            <Search size={18} color="var(--text-light)" />
                            <input
                                value={userStop}
                                onChange={(e) => {
                                    setUserStop(e.target.value);
                                    setSelectedUserStop(null);
                                }}
                                onFocus={() => setActiveField('userStop')}
                                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                                placeholder={t.userStopPlaceholder}
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem' }}
                            />
                            {userStop && (
                                <X 
                                    size={18} 
                                    color="#94A3B8" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={() => {
                                        setUserStop('');
                                        setSelectedUserStop(null);
                                    }}
                                />
                            )}
                        </div>

                        {activeField === 'userStop' && renderSuggestions()}
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '10px' }}
                        onClick={handleShowMe}
                        disabled={isLoading}
                    >
                        {isLoading ? t.loading : t.showMe}
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{t.activeRoute}</span>
                                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{results.busRoute}</h3>
                                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>{selectedFrom?.name ?? from} <ArrowRight size={10} style={{ display: 'inline' }} /> {selectedTo?.name ?? to}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{t.etaTo} {selectedUserStop?.name ?? userStop}</span>
                                <h3 style={{ margin: 0, color: results.eta === "Arrived" || results.eta === "Arriving Soon" ? 'var(--success)' : (results.status === 'live' ? 'var(--warning)' : 'var(--text)') }}>{results.eta}</h3>
                                {results.estimatedArrivalTime && (
                                    <div style={{ 
                                        fontSize: '0.7rem', 
                                        color: 'var(--text-light)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'flex-end', 
                                        gap: '4px',
                                        marginTop: '2px'
                                    }}>
                                        <Clock size={12} /> {t.estArrival} {results.estimatedArrivalTime}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '5px', padding: '5px 0' }}>
                            {results.timings.map((tm) => (
                                <div 
                                    key={tm} 
                                    style={{ 
                                        backgroundColor: tm === results.activeTrip ? 'var(--primary)' : '#f0f2f5', 
                                        color: tm === results.activeTrip ? 'white' : 'var(--text-light)',
                                        padding: '6px 14px', 
                                        borderRadius: '20px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: tm === results.activeTrip ? 700 : 500,
                                        whiteSpace: 'nowrap',
                                        boxShadow: tm === results.activeTrip ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {tm}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Bus size={18} color="var(--primary)" /> {t.liveProgress}
                            </h4>
                            {results.status === 'live' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>
                                    <div className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
                                    {t.liveUpdate}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
                            {results.status === 'finished' ? (
                                <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>{t.allFinished}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{t.checkBack}</div>
                                </div>
                            ) : results.status === 'upcoming' ? (
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ backgroundColor: '#F0F9FF', color: '#0369A1', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #BAE6FD' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0EA5E9' }}></div>
                                        Next bus starts at {results.activeTrip}
                                    </div>
                                    <div style={{ margin: '20px 0 20px 15px', borderLeft: '2px dashed #CBD5E1', paddingLeft: '25px', position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#CBD5E1' }}></div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedUserStop?.name ?? userStop}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Expected arrival: ~{results.activeTrip}</div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {results.orderedStops.map((stop, i) => {
                                        const isPassed = results.passedStops.includes(stop);
                                        const isCurrent = stop === results.currentLocation;
                                        const isTarget = i === results.userStopIndex;
                                        const isDepartedStatus = results.locationStatus === "Departed";
                                        const isArrivingSoon = isTarget && results.eta === "Arriving Soon";
                                        
                                        const iconColor = isPassed ? '#EF4444' : (isCurrent ? 'var(--primary)' : '#CBD5E1');
                                        const lineColor = isPassed ? '#EF4444' : '#CBD5E1';
                                        
                                        return (
                                            <div key={stop + i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', minHeight: '60px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <div style={{ 
                                                        width: isTarget || isCurrent ? 16 : 12, 
                                                        height: isTarget || isCurrent ? 16 : 12, 
                                                        borderRadius: '50%', 
                                                        backgroundColor: (isCurrent || isArrivingSoon) ? 'white' : iconColor,
                                                        border: (isCurrent || isTarget || isArrivingSoon) ? `2px solid ${isArrivingSoon ? 'var(--success)' : iconColor}` : 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        position: 'relative',
                                                        zIndex: 2
                                                    }}>
                                                        {(isCurrent || isTarget || isArrivingSoon) && (
                                                            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: isArrivingSoon ? 'var(--success)' : iconColor }}></div>
                                                        )}
                                                        {isArrivingSoon && (
                                                            <div className="pulse" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--success)', zIndex: -1 }}></div>
                                                        )}
                                                    </div>
                                                    {i < results.orderedStops.length - 1 && (
                                                        <motion.div 
                                                            style={{ 
                                                                width: 2, 
                                                                height: '48px', 
                                                                backgroundColor: lineColor,
                                                                opacity: (isCurrent && isDepartedStatus) ? 0.6 : 1
                                                            }}
                                                            animate={(isCurrent && isDepartedStatus) ? { opacity: [1, 0.4, 1] } : {}}
                                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                                        ></motion.div>
                                                    )}
                                                </div>
                                                <div style={{ paddingBottom: '15px' }}>
                                                    <div style={{ 
                                                        fontSize: '0.85rem', 
                                                        fontWeight: isTarget || isCurrent || isArrivingSoon ? 700 : 500,
                                                        color: isArrivingSoon ? 'var(--success)' : (isPassed ? '#EF4444' : (isCurrent ? 'var(--primary)' : '#1E293B'))
                                                    }}>
                                                        {stop} {isTarget && <span style={{ fontSize: '0.7rem', color: isArrivingSoon ? 'var(--success)' : 'var(--primary)', marginLeft: '5px' }}>(Your Stop)</span>}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: isArrivingSoon ? 'var(--success)' : (isPassed ? '#EF4444' : (isCurrent ? 'var(--primary)' : '#94A3B8')) }}>
                                                        {isCurrent ? (isDepartedStatus ? t.departed : t.currentLoc) : (isPassed ? t.passed : (isArrivingSoon ? t.arrivingSoon : ''))}
                                                        {isTarget && !isPassed && !isCurrent && !isArrivingSoon && t.approaching}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        className="btn"
                        style={{ backgroundColor: '#eee', color: 'var(--text)', fontWeight: 600 }}
                        onClick={() => setResults(null)}
                    >
                        {t.trackAnother}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrackByRouteDatabase;
