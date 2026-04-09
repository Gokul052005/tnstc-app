import React, { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Bus, ChevronLeft, ArrowRight, X } from 'lucide-react';
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
            currentLoc: 'Current location',
            passed: 'Bus passed',
            approaching: 'Approaching...',
            trackAnother: 'Track Another Route'
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
            currentLoc: 'தற்போதைய இடம்',
            passed: 'பேருந்து கடந்துவிட்டது',
            approaching: 'நெருங்குகிறது...',
            trackAnother: 'மற்றொரு வழியைத் தேடுங்கள்'
        }
    }[lang] || {
        title: 'Track By Route', subtitle: 'Enter route details to see live bus progress and arrival timings.', from: 'From', to: 'To', userStop: 'Your Stop Name', fromPlaceholder: 'Departure Station', toPlaceholder: 'Destination Station', userStopPlaceholder: 'e.g. Pachampalayam', showMe: 'Show Me', loading: 'Loading Database...', fillFields: 'Please fill all fields', noMatching: 'No matching route found in the current database', activeRoute: 'Active Route', etaTo: 'ETA to', liveProgress: 'Live Progress', currentLoc: 'Current location', passed: 'Bus passed', approaching: 'Approaching...', trackAnother: 'Track Another Route'
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
                                <h3 style={{ margin: 0, color: 'var(--success)' }}>{results.eta}</h3>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', marginBottom: '5px' }}>
                            {results.timings.map((tm) => (
                                <div key={tm} style={{ backgroundColor: '#f0f2f5', padding: '6px 12px', borderRadius: '15px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                    {tm}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bus size={18} color="var(--primary)" /> {t.liveProgress}
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
                            {results.passedStops.map((stop, i) => (
                                <div key={stop} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', minHeight: '60px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
                                        {i < results.passedStops.length - 1 && (
                                            <div style={{ width: 2, height: '48px', backgroundColor: 'var(--success)' }}></div>
                                        )}
                                    </div>
                                    <div style={{ paddingBottom: '15px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{stop}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>
                                            {stop === results.currentLocation ? t.currentLoc : t.passed}
                                        </div>
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
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedUserStop?.name ?? userStop}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>{t.approaching}</div>
                                </div>
                            </div>
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
