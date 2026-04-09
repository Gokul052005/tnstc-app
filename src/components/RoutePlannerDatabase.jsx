import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Star, ChevronRight, ArrowDownUp, Search, MapPinned, BusFront, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    findRoutesBetweenStops,
    formatStopOption,
    initializeBusDatabase,
} from '../data/busDatabaseRuntime';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

const NO_DISTRICT_OPTION = 'No District';

const suggestionBoxStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#fff',
    zIndex: 50,
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    maxHeight: '180px',
    overflowY: 'auto',
    border: '1px solid #eee',
};

const normalizeForCompare = (value) =>
    typeof value === 'string' ? value.trim().toLowerCase() : '';

const RoutePlannerDatabase = ({ lang, onBack }) => {
    const t = {
        ENG: {
            title: 'Search Buses By Location',
            districtLabel: 'Select District',
            districtPlaceholder: 'Example: Salem or select No District',
            districtHint: 'Start typing a district name, or choose No District if you are unsure.',
            from: 'From',
            to: 'To',
            fromPlaceholderAny: 'Select from any place',
            fromPlaceholderDist: (dist) => `Select stop in ${dist}`,
            toPlaceholder: 'Select any destination',
            fromHintAny: 'All places are shown here. District and taluk labels help distinguish duplicate place names.',
            fromHintDist: (dist) => `All available stops from ${dist} district appear here, including smaller stops.`,
            toHint: 'Destination can be in any district, including Salem.',
            districtStops: (dist) => `${dist} District Stops`,
            searchBus: 'Search Bus',
            loadingRoutes: 'Loading Routes...',
            showingAvailable: 'Showing available bus routes and timings',
            istTime: 'IST TIME',
            serviceNo: 'Service No',
            depot: 'Depot',
            estDep: 'Est. Departure',
            estArr: 'Est. Arrival',
            next: 'NEXT',
            past: 'PAST',
            intermediate: 'INTERMEDIATE STOPS',
            noRoutes: 'No direct bus routes were found between these locations. We are continuously adding more routes to our database.',
            dbError: 'Database Error: Bus schedules failed to process. Check console for exact stop name mismatches.',
            noMatches: 'No matches found'
        },
        TAM: {
            title: 'இடம் மூலம் பேருந்துகளைத் தேடுங்கள்',
            districtLabel: 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
            districtPlaceholder: 'உதாரணம்: சேலம் அல்லது மாவட்டம் இல்லை என்பதைத் தேர்ந்தெடுக்கவும்',
            districtHint: 'மாவட்டப் பெயரைத் தட்டச்சு செய்யத் தொடங்குங்கள், அல்லது உங்களுக்குத் தெரியாவிட்டால் மாவட்டம் இல்லை என்பதைத் தேர்ந்தெடுக்கவும்.',
            from: 'இருந்து',
            to: 'வரை',
            fromPlaceholderAny: 'ஏதேனும் ஒரு இடத்தைத் தேர்ந்தெடுக்கவும்',
            fromPlaceholderDist: (dist) => `${dist} மாவட்டத்தில் நிறுத்தத்தைத் தேர்ந்தெடுக்கவும்`,
            toPlaceholder: 'ஏதேனும் ஒரு இலக்கைத் தேர்ந்தெடுக்கவும்',
            fromHintAny: 'அனைத்து இடங்களும் இங்கே காட்டப்பட்டுள்ளன. ஒரே மாதிரியான இடப் பெயர்களை வேறுபடுத்தி அறிய மாவட்ட மற்றும் தாலுகா லேபிள்கள் உதவுகின்றன.',
            fromHintDist: (dist) => `${dist} மாவட்டத்திலிருந்து கிடைக்கும் அனைத்து நிறுத்தங்களும் இங்கே தோன்றும்.`,
            toHint: 'இலக்கு சேலம் உட்பட எந்த மாவட்டத்திலும் இருக்கலாம்.',
            districtStops: (dist) => `${dist} மாவட்ட நிறுத்தங்கள்`,
            searchBus: 'பேருந்து தேடல்',
            loadingRoutes: 'வழித்தடங்கள் ஏற்றப்படுகின்றன...',
            showingAvailable: 'கிடைக்கும் பேருந்து வழித்தடங்கள் மற்றும் நேரங்களைக் காட்டுகிறது',
            istTime: 'சரியான நேரம்',
            serviceNo: 'சேவை எண்',
            depot: 'பணிமனை',
            estDep: 'புறப்படும் நேரம்',
            estArr: 'சேரும் நேரம்',
            next: 'அடுத்து',
            past: 'கடந்தது',
            intermediate: 'இடைநிலை நிறுத்தங்கள்',
            noRoutes: 'இந்த இடங்களுக்கு இடையே நேரடி பேருந்து வழித்தடங்கள் எதுவும் காணப்படவில்லை. எங்கள் தரவுத்தளத்தில் தொடர்ந்து கூடுதல் வழித்தடங்களைச் சேர்த்து வருகிறோம்.',
            dbError: 'தரவுத்தள பிழை: பேருந்து அட்டவணைகளைச் செயல்படுத்த முடியவில்லை. நிறுத்தப் பெயர்களில் உள்ள பொருத்தமின்மைகளுக்கு கன்சோலைச் சரிபார்க்கவும்.',
            noMatches: 'பொருத்தம் எதுவும் இல்லை'
        }
    }[lang] || {
        title: 'Search Buses By Location', districtLabel: 'Select District', districtPlaceholder: 'Example: Salem or select No District', districtHint: 'Start typing a district name, or choose No District if you are unsure.', from: 'From', to: 'To', fromPlaceholderAny: 'Select from any place', fromPlaceholderDist: (dist) => `Select stop in ${dist}`, toPlaceholder: 'Select any destination', fromHintAny: 'All places are shown here. District and taluk labels help distinguish duplicate place names.', fromHintDist: (dist) => `All available stops from ${dist} district appear here, including smaller stops.`, toHint: 'Destination can be in any district, including Salem.', districtStops: (dist) => `${dist} District Stops`, searchBus: 'Search Bus', loadingRoutes: 'Loading Routes...', showingAvailable: 'Showing available bus routes and timings', istTime: 'IST TIME', serviceNo: 'Service No', depot: 'Depot', estDep: 'Est. Departure', estArr: 'Est. Arrival', next: 'NEXT', past: 'PAST', intermediate: 'INTERMEDIATE STOPS', noRoutes: 'No direct bus routes were found between these locations. We are continuously adding more routes to our database.', dbError: 'Database Error: Bus schedules failed to process. Check console for exact stop name mismatches.', noMatches: 'No matches found'
    };
    const [districtChoices, setDistrictChoices] = useState([NO_DISTRICT_OPTION]);
    const [stopOptions, setStopOptions] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(NO_DISTRICT_OPTION);
    const [districtQuery, setDistrictQuery] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [selectedFrom, setSelectedFrom] = useState(null);
    const [selectedTo, setSelectedTo] = useState(null);
    const [activeField, setActiveField] = useState(null);
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedBuses, setExpandedBuses] = useState({});

    const toggleBus = (busKey) => {
        setExpandedBuses((prev) => ({ ...prev, [busKey]: !prev[busKey] }));
    };

    useEffect(() => {
        let isMounted = true;
        let unsubscribeRoutes = () => {};
        let unsubscribeStops = () => {};
        
        initializeBusDatabase().then(() => {
            if (!isMounted) return;

            const routesRef = ref(db, 'routes');
            const stopsRef = ref(db, 'stops');

            unsubscribeRoutes = onValue(routesRef, (routesSnapshot) => {
                unsubscribeStops = onValue(stopsRef, (stopsSnapshot) => {
                    if (!isMounted) return;

                const baseStopsArr = stopsSnapshot.exists() ? Object.values(stopsSnapshot.val()) : [];
                const routesArr = routesSnapshot.exists() ? Object.values(routesSnapshot.val()) : [];
                
                const stopMap = new Map();
                baseStopsArr.forEach((s) => {
                    const stopName = typeof s?.name === 'string' ? s.name.trim() : '';
                    if (!stopName) return;
                    stopMap.set(stopName.toLowerCase(), { ...s, name: stopName });
                });
                
                routesArr.forEach(route => {
                    if (route.stops) {
                        route.stops.forEach((stopName) => {
                            if (typeof stopName !== 'string') return;
                            const trimmedStopName = stopName.trim();
                            if (!trimmedStopName) return;
                            const lower = trimmedStopName.toLowerCase();
                            if (!stopMap.has(lower)) {
                                stopMap.set(lower, {
                                    id: `AutoGend:${trimmedStopName}`, 
                                    name: trimmedStopName,
                                    district: 'No District', 
                                    taluk: ''
                                });
                            }
                        });
                    }
                });

                const finalStops = Array.from(stopMap.values()).sort((a, b) => a.name.localeCompare(b.name));
                const finalDistricts = [...new Set(finalStops.map((stop) => stop.district).filter(d => d && d !== 'No District'))].sort();
                
                setDistrictChoices([NO_DISTRICT_OPTION, ...finalDistricts]);
                setStopOptions(finalStops);
                setIsLoading(false);
                });
            });
        });

        return () => {
            isMounted = false;
            unsubscribeRoutes();
            unsubscribeStops();
        };
    }, []);

    const districtStops = useMemo(() => {
        if (selectedDistrict === NO_DISTRICT_OPTION) {
            return stopOptions;
        }

        return stopOptions.filter((stop) => stop.district === selectedDistrict);
    }, [selectedDistrict, stopOptions]);

    const districtSuggestions = useMemo(() => {
        if (activeField !== 'district') return [];
        const query = districtQuery.toLowerCase();
        const filtered = districtChoices.filter((district) => district.toLowerCase().includes(query));
        return filtered.length > 0 ? filtered : ['No matches found'];
    }, [activeField, districtChoices, districtQuery]);

    useEffect(() => {
        if (
            selectedFrom &&
            selectedDistrict !== NO_DISTRICT_OPTION &&
            selectedFrom.district !== selectedDistrict
        ) {
            setSelectedFrom(null);
            setFrom('');
        }

        setSearchTriggered(false);
    }, [districtStops, selectedDistrict, selectedFrom]);

    const suggestions = useMemo(() => {
        if (activeField === 'from') {
            const query = from.toLowerCase();
            const filtered = districtStops.filter(
                (stop) =>
                    formatStopOption(stop).toLowerCase().includes(query) &&
                    stop.id !== selectedTo?.id
            );
            return filtered.length > 0 ? filtered : ['No matches found'];
        }

        if (activeField === 'to') {
            const query = to.toLowerCase();
            const filtered = stopOptions.filter(
                (stop) =>
                    formatStopOption(stop).toLowerCase().includes(query) &&
                    stop.id !== selectedFrom?.id
            );
            return filtered.length > 0 ? filtered : ['No matches found'];
        }

        return [];
    }, [activeField, districtStops, from, selectedFrom, selectedTo, stopOptions, to]);

    const canSwap =
        selectedTo &&
        (selectedDistrict === NO_DISTRICT_OPTION || selectedTo.district === selectedDistrict);
    const canSearch = Boolean(selectedDistrict && selectedFrom && selectedTo);
    const hasSearchResults = searchTriggered && canSearch;

    const handleSwap = () => {
        if (!canSwap) {
            return;
        }

        const nextFrom = selectedTo;
        const nextTo = selectedFrom;
        setSelectedFrom(nextFrom);
        setSelectedTo(nextTo);
        setFrom(formatStopOption(nextFrom));
        setTo(nextTo ? formatStopOption(nextTo) : '');
        setSearchTriggered(false);
    };

    const handleSelect = (value) => {
        if (value === 'No matches found') return;

        if (activeField === 'district') {
            setSelectedDistrict(value);
            setDistrictQuery(value);
            setActiveField(null);
            return;
        }

        if (activeField === 'from') {
            setSelectedFrom(value);
            setFrom(formatStopOption(value));
        }

        if (activeField === 'to') {
            setSelectedTo(value);
            setTo(formatStopOption(value));
        }

        setActiveField(null);
        setSearchTriggered(false);
    };

    const handleDistrictChange = (district) => {
        setSelectedDistrict(district);
        setDistrictQuery(district === NO_DISTRICT_OPTION ? '' : district);
        setActiveField(null);
    };

    const handleSearch = async () => {
        if (!canSearch) {
            return;
        }

        try {
            const rawRoutes = await findRoutesBetweenStops(selectedFrom.name, selectedTo.name);
            
            // LOGICAL DEDUPLICATION: Group by ID, From, To to prevent Ghost/Duplicate entries from old data
            const deduplicatedMap = {};
            
            rawRoutes.forEach(route => {
                // Create a stable key for identity
                const identityKey = `${route.id}_${route.from}_${route.to}`.toLowerCase().replace(/\s+/g, '');
                
                if (!deduplicatedMap[identityKey]) {
                    deduplicatedMap[identityKey] = { 
                        ...route, 
                        // Ensure buses is a clean copy
                        buses: route.buses ? [...route.buses] : [] 
                    };
                } else {
                    // Merge unique buses from the duplicate entry if any
                    (route.buses || []).forEach(newBus => {
                        const isDuplicateBus = deduplicatedMap[identityKey].buses.some(
                            existingBus => existingBus.departure === newBus.departure && existingBus.tripNo === newBus.tripNo
                        );
                        if (!isDuplicateBus) {
                            deduplicatedMap[identityKey].buses.push(newBus);
                        }
                    });
                }
            });

            const uniqueRoutes = Object.values(deduplicatedMap);
            setAvailableRoutes(uniqueRoutes);
            setSearchTriggered(true);
        } catch (error) {
            console.error("Search failed completely:", error);
            alert(t.dbError);
            setAvailableRoutes([]);
            setSearchTriggered(true);
        }
    };

    const addMinutesToTime = (timeStr, minsToAdd) => {
        if (!timeStr) return '';
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return timeStr;
        let [ , h, m, ampm ] = match;
        h = parseInt(h, 10);
        m = parseInt(m, 10);
        if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
        if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
        
        let totalMins = h * 60 + m + minsToAdd;
        let newH = Math.floor(totalMins / 60) % 24;
        let newM = totalMins % 60;
        
        let newAmpm = newH >= 12 ? 'PM' : 'AM';
        let displayH = newH % 12;
        if (displayH === 0) displayH = 12;
        
        return `${displayH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')} ${newAmpm}`;
    };

    const timeToMinutes = (timeStr) => {
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

    const getCurrentISTMinutes = () => {
        const now = new Date();
        const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        return istTime.getHours() * 60 + istTime.getMinutes();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#fff' }}>
            <div
                style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '15px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <ArrowLeft size={24} onClick={onBack} style={{ cursor: 'pointer' }} />
                <h1 style={{ fontSize: '1.2rem', fontWeight: 500, margin: 0 }}>{t.title}</h1>
                <Star size={24} style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div
                    style={{
                        backgroundColor: '#F8FBFF',
                        borderRadius: '18px',
                        border: '1px solid #DCEAF7',
                        padding: '16px',
                        position: 'relative',
                    }}
                >
                    <span style={{ display: 'block', fontSize: '0.95rem', color: '#4E6B86', marginBottom: '12px' }}>
                        {t.districtLabel}
                    </span>
                    <input
                        value={districtQuery}
                        onChange={(e) => setDistrictQuery(e.target.value)}
                        onFocus={() => setActiveField('district')}
                        onBlur={() => setTimeout(() => {
                            if (districtChoices.includes(districtQuery)) {
                                handleDistrictChange(districtQuery);
                            } else {
                                setDistrictQuery(selectedDistrict === NO_DISTRICT_OPTION ? '' : selectedDistrict);
                            }
                            setActiveField(null);
                        }, 200)}
                        placeholder={t.districtPlaceholder}
                        style={{
                            width: '100%',
                            border: '1px solid #CFE0EF',
                            borderRadius: '12px',
                            padding: '12px 14px',
                            fontSize: '1rem',
                            outline: 'none',
                            color: '#243746',
                            backgroundColor: '#fff',
                        }}
                    />
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#6A7E8F', marginTop: '8px' }}>
                        {t.districtHint}
                    </span>

                    <AnimatePresence>
                        {activeField === 'district' && districtSuggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                style={{ ...suggestionBoxStyle, top: 'calc(100% - 6px)' }}
                            >
                                {districtSuggestions.map((suggestion) => (
                                    <div
                                        key={suggestion}
                                        onClick={() => handleSelect(suggestion)}
                                        style={{
                                            padding: '12px 15px',
                                            borderBottom: '1px solid #f5f5f5',
                                            color: suggestion === 'No matches found' ? '#999' : '#333',
                                            cursor: suggestion === 'No matches found' ? 'default' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>{suggestion}</span>
                                        {suggestion !== 'No matches found' && <ChevronRight size={18} color="#7A8A99" />}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ position: 'relative', marginTop: '10px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: '20px',
                            position: 'relative',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                            <span style={{ fontSize: '1.1rem', color: '#666' }}>{t.from}</span>
                            <input
                                value={from}
                                onChange={(e) => {
                                    setFrom(e.target.value);
                                    setSelectedFrom(null);
                                }}
                                onFocus={() => setActiveField('from')}
                                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                                placeholder={
                                    selectedDistrict === NO_DISTRICT_OPTION
                                        ? t.fromPlaceholderAny
                                        : t.fromPlaceholderDist(selectedDistrict)
                                }
                                style={{
                                    fontSize: '1.1rem',
                                    color: '#222',
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    padding: 0,
                                }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#7A8A99' }}>
                                {selectedDistrict === NO_DISTRICT_OPTION
                                    ? t.fromHintAny
                                    : t.fromHintDist(selectedDistrict)}
                            </span>

                            <AnimatePresence>
                                {activeField === 'from' && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        style={suggestionBoxStyle}
                                    >
                                        {suggestions.map((suggestion) => (
                                            <div
                                                key={typeof suggestion === 'string' ? suggestion : suggestion.id}
                                                onClick={() => handleSelect(suggestion)}
                                                style={{
                                                    padding: '12px 15px',
                                                    borderBottom: '1px solid #f5f5f5',
                                                    color: suggestion === 'No matches found' ? '#999' : '#333',
                                                    cursor: suggestion === 'No matches found' ? 'default' : 'pointer',
                                                }}
                                            >
                                                {typeof suggestion === 'string' ? suggestion : formatStopOption(suggestion)}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {from && (
                                <X 
                                    size={20} 
                                    color="#99A6B2" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setFrom('');
                                        setSelectedFrom(null);
                                        setSearchTriggered(false);
                                    }} 
                                    style={{ cursor: 'pointer' }} 
                                />
                            )}
                            <ChevronRight size={24} color="#000" />
                        </div>
                    </div>

                    <div style={{ position: 'relative', margin: '5px 0' }}>
                        <div style={{ borderBottom: '1px dashed #bbb', width: '100%' }}></div>
                        <div
                            onClick={handleSwap}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: '#fff',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: canSwap ? 'pointer' : 'not-allowed',
                                opacity: canSwap ? 1 : 0.45,
                            }}
                            title={
                                canSwap
                                    ? 'Swap locations'
                                    : selectedDistrict === NO_DISTRICT_OPTION
                                      ? 'Swap locations'
                                      : `To swap, destination must also be in ${selectedDistrict}`
                            }
                        >
                            <ArrowDownUp size={20} color="var(--primary)" />
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '20px',
                            paddingBottom: '20px',
                            position: 'relative',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                            <span style={{ fontSize: '1.1rem', color: '#666' }}>{t.to}</span>
                            <input
                                value={to}
                                onChange={(e) => {
                                    setTo(e.target.value);
                                    setSelectedTo(null);
                                }}
                                onFocus={() => setActiveField('to')}
                                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                                placeholder={t.toPlaceholder}
                                style={{
                                    fontSize: '1.1rem',
                                    color: '#222',
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    padding: 0,
                                }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#7A8A99' }}>
                                {t.toHint}
                            </span>

                            <AnimatePresence>
                                {activeField === 'to' && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        style={suggestionBoxStyle}
                                    >
                                        {suggestions.map((suggestion) => (
                                            <div
                                                key={typeof suggestion === 'string' ? suggestion : suggestion.id}
                                                onClick={() => handleSelect(suggestion)}
                                                style={{
                                                    padding: '12px 15px',
                                                    borderBottom: '1px solid #f5f5f5',
                                                    color: suggestion === 'No matches found' ? '#999' : '#333',
                                                    cursor: suggestion === 'No matches found' ? 'default' : 'pointer',
                                                }}
                                            >
                                                {typeof suggestion === 'string' ? suggestion : formatStopOption(suggestion)}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {to && (
                                <X 
                                    size={20} 
                                    color="#99A6B2" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setTo('');
                                        setSelectedTo(null);
                                        setSearchTriggered(false);
                                    }} 
                                    style={{ cursor: 'pointer' }} 
                                />
                            )}
                            <ChevronRight size={24} color="#000" />
                        </div>
                    </div>

                    <div style={{ borderBottom: '1px dashed #bbb', width: '100%' }}></div>
                </div>

                <button
                    style={{
                        display: 'block',
                        width: '70%',
                        margin: '0 auto 10px',
                        padding: '12px',
                        borderRadius: '30px',
                        border: '1px solid var(--primary)',
                        backgroundColor: 'transparent',
                        color: 'var(--primary)',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        cursor: 'default',
                    }}
                >
                    {t.districtStops(selectedDistrict)}
                </button>

                <button
                    onClick={handleSearch}
                    disabled={!canSearch || isLoading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        width: '70%',
                        margin: '0 auto',
                        padding: '12px',
                        borderRadius: '30px',
                        border: 'none',
                        backgroundColor: canSearch && !isLoading ? 'var(--primary)' : '#A9BFCC',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        cursor: canSearch && !isLoading ? 'pointer' : 'not-allowed',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    {isLoading ? t.loadingRoutes : t.searchBus} <Search size={20} />
                </button>

                {hasSearchResults && (
                    <div
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#F9FBFC',
                            borderRadius: '20px',
                            padding: '18px',
                            border: '1px solid #E2E8EE',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPinned size={18} color="var(--primary)" />
                                <div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#243746' }}>
                                        {selectedFrom?.name ?? from} to {selectedTo?.name ?? to}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#6A7E8F' }}>
                                        {t.showingAvailable}
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: '#6A7E8F', fontWeight: 600 }}>{t.istTime}</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                                    {new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata", hour: '2-digit', minute: '2-digit'})}
                                </div>
                            </div>
                        </div>

                        {availableRoutes.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {availableRoutes.map((route) => {
                                    // Calculate stop indices for intelligent ETA
                                    const fromNameRaw = selectedFrom?.name ?? from;
                                    const toNameRaw = selectedTo?.name ?? to;
                                    const normalizedFrom = normalizeForCompare(fromNameRaw);
                                    const normalizedTo = normalizeForCompare(toNameRaw);
                                    const fromIndex = route.orderedStops
                                        ? route.orderedStops.findIndex((s) => normalizeForCompare(s) === normalizedFrom)
                                        : 0;
                                    const toIndex = route.orderedStops
                                        ? route.orderedStops.findIndex((s) => normalizeForCompare(s) === normalizedTo)
                                        : 0;
                                    
                                    const exactFromStopStr = route.orderedStops?.[fromIndex];
                                    const exactToStopStr = route.orderedStops?.[toIndex];

                                    // Average hop time in minutes
                                    const HOP_MINS = 9;
                                    const fromMins = Math.max(0, fromIndex) * HOP_MINS;
                                    const toMins = Math.max(0, toIndex) * HOP_MINS;

                                    return (
                                    <div
                                        key={route.id}
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            border: '1px solid #E6EDF3',
                                            marginBottom: '15px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                            <BusFront size={20} color="var(--primary)" />
                                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1D2D3A' }}>
                                                {t.serviceNo} : {route.id}
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1D2D3A', marginBottom: '15px', borderBottom: '1px solid #f0f4f9', paddingBottom: '10px' }}>
                                            {(selectedFrom?.name || from).toUpperCase()} ↔ {(selectedTo?.name || to).toUpperCase()}
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {[...route.buses].map(bus => {
                                                const mappedFromTime = (exactFromStopStr && bus.stopTimings) ? bus.stopTimings[exactFromStopStr] : null;
                                                const mappedToTime = (exactToStopStr && bus.stopTimings) ? bus.stopTimings[exactToStopStr] : null;
                                                const estDep = mappedFromTime || addMinutesToTime(bus.departure, fromMins);
                                                const estArr = mappedToTime || addMinutesToTime(bus.departure, toMins);
                                                const depMins = timeToMinutes(estDep);
                                                return { ...bus, estDep, estArr, depMins };
                                            }).sort((a, b) => {
                                                const now = getCurrentISTMinutes();
                                                const aDiff = a.depMins - now;
                                                const bDiff = b.depMins - now;
                                                if (aDiff >= 0 && bDiff < 0) return -1;
                                                if (bDiff >= 0 && aDiff < 0) return 1;
                                                if (aDiff >= 0 && bDiff >= 0) return aDiff - bDiff;
                                                return a.depMins - b.depMins;
                                            }).map((bus, busIdx, busesArr) => {
                                                const now = getCurrentISTMinutes();
                                                const isPast = bus.depMins < now;
                                                const isNext = !isPast && (busIdx === 0 || busesArr[busIdx-1].depMins < now);
                                                
                                                return (
                                                <div
                                                    key={`${route.id}-${bus.tripNo}`}
                                                    style={{
                                                        border: isNext ? '2px solid var(--primary)' : '1px solid #D5DCE4',
                                                        borderRadius: '15px',
                                                        padding: '12px',
                                                        backgroundColor: isNext ? '#F5F5FF' : (isPast ? '#F9FBFC' : '#FFFFFF'),
                                                        opacity: isPast ? 0.7 : 1,
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            gap: '12px',
                                                            marginBottom: '8px',
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {isNext && <span style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{t.next}</span>}
                                                            {isPast && <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{t.past}</span>}
                                                        </div>
                                                        <div
                                                            style={{
                                                                padding: '4px 10px',
                                                                borderRadius: '999px',
                                                                backgroundColor: '#E9E9FF',
                                                                color: '#32325A',
                                                                fontWeight: 700,
                                                                fontSize: '0.75rem',
                                                            }}
                                                        >
                                                            {bus.serviceType}
                                                        </div>
                                                    </div>
                                                    
                                                    <div style={{ fontSize: '0.85rem', color: '#6A7E8F', marginBottom: '8px' }}>
                                                        {t.depot}: {bus.depot}
                                                    </div>
```javascript
// No Changes to line 763
```

                                                    <div
                                                        onClick={() => toggleBus(`${route.id}-${bus.tripNo}`)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            gap: '16px',
                                                            cursor: 'pointer',
                                                            userSelect: 'none',
                                                            padding: '4px 0'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'stretch', gap: '16px' }}>
                                                            <div>
                                                                <div style={{ fontSize: '0.95rem', color: '#455768', marginBottom: '6px' }}>
                                                                    {t.estDep}
                                                                </div>
                                                                <div style={{ fontSize: '0.95rem', color: '#455768' }}>
                                                                    {t.estArr}
                                                                </div>
                                                            </div>
                                                            <div style={{ width: '1px', backgroundColor: '#C8D0D9' }}></div>
                                                            <div>
                                                                <div style={{ fontSize: '1rem', color: isPast ? '#455768' : '#2A3E50', marginBottom: '6px', fontWeight: 600 }}>
                                                                    {bus.estDep}
                                                                </div>
                                                                <div style={{ fontSize: '1rem', color: isPast ? '#455768' : '#2A3E50', fontWeight: 600 }}>
                                                                    {bus.estArr}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ChevronRight 
                                                            size={28} 
                                                            color={isPast ? "#64748B" : "#1D2D3A"}
                                                            style={{ 
                                                                transform: expandedBuses[`${route.id}-${bus.tripNo}`] ? 'rotate(90deg)' : 'none', 
                                                                transition: 'transform 0.2s ease-in-out' 
                                                            }} 
                                                        />
                                                    </div>

                                                    <AnimatePresence>
                                                        {expandedBuses[`${route.id}-${bus.tripNo}`] && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                style={{ overflow: 'hidden' }}
                                                            >
                                                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #D5DCE4' }}>
                                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6A7E8F', marginBottom: '12px' }}>{t.intermediate}</div>
                                                                    
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                        {route.orderedStops.slice(fromIndex, toIndex + 1).map((stopName, idx) => {
                                                                            const globalIdx = fromIndex + idx;
                                                                            const minsOffset = Math.max(0, globalIdx) * HOP_MINS;
                                                                            const mappedTime = (bus.stopTimings && bus.stopTimings[stopName]) ? bus.stopTimings[stopName] : addMinutesToTime(bus.departure, minsOffset);
                                                                            const isStartEnd = (idx === 0) || (idx === (toIndex - fromIndex));
                                                                            
                                                                            return (
                                                                                <div key={stopName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' }}>
                                                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isStartEnd ? (isPast ? '#64748B' : 'var(--primary)') : '#A9BFCC' }}></div>
                                                                                        <span style={{ fontSize: '0.95rem', color: isStartEnd ? (isPast ? '#455768' : '#1D2D3A') : '#455768', fontWeight: isStartEnd ? 600 : 400 }}>{stopName}</span>
                                                                                    </div>

                                                                                        {/* Bus Road Pattern with Running Animation */}
                                                                                        <div style={{ 
                                                                                            flex: 1, 
                                                                                            height: '28px', 
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            position: 'relative',
                                                                                            margin: '0 8px',
                                                                                            overflow: 'hidden'
                                                                                        }}>
                                                                                            <div style={{
                                                                                                position: 'absolute',
                                                                                                left: 0,
                                                                                                right: 0,
                                                                                                top: '55%',
                                                                                                borderBottom: '2px dashed #CBD5E1',
                                                                                                zIndex: 0
                                                                                            }}></div>
                                                                                            <motion.div 
                                                                                                animate={{ backgroundPositionX: ['120px', '0px'] }}
                                                                                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                                                                                style={{ 
                                                                                                    width: '100%',
                                                                                                    height: '100%', 
                                                                                                    backgroundImage: 'url(/bus_pattern.png)', 
                                                                                                    backgroundRepeat: 'repeat-x', 
                                                                                                    backgroundSize: '45px auto', 
                                                                                                    backgroundPosition: 'center',
                                                                                                    zIndex: 1,
                                                                                                    opacity: isPast ? 0.3 : 1
                                                                                                }}
                                                                                            />
                                                                                        </div>

                                                                                    <span style={{ fontSize: '0.95rem', fontWeight: isStartEnd ? 700 : 600, color: isStartEnd ? 'var(--primary)' : '#2A3E50', whiteSpace: 'nowrap' }}>{mappedTime}</span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    border: '1px dashed #D5E2EC',
                                    color: '#5E7384',
                                    lineHeight: 1.5,
                                }}
                            >
                                {t.noRoutes}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoutePlannerDatabase;
