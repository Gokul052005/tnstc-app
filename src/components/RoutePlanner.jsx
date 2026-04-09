import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Star, ChevronRight, ArrowDownUp, Search, Clock3, MapPinned, BusFront, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DISTRICT_STOPS = {
    Ariyalur: ['Ariyalur Bus Stand', 'Jayankondam', 'Sendurai', 'Andimadam', 'Udayarpalayam'],
    Chengalpattu: ['Chengalpattu', 'Tambaram', 'Madurantakam', 'Guduvancheri', 'Thirukazhukundram'],
    Chennai: ['CMBT', 'Broadway', 'Tambaram', 'T. Nagar', 'Velachery'],
    Coimbatore: ['Coimbatore Gandhipuram', 'Mettupalayam', 'Pollachi', 'Avinashi', 'Sulur', 'Annur'],
    Cuddalore: ['Cuddalore', 'Panruti', 'Neyveli', 'Vriddhachalam', 'Chidambaram'],
    Dharmapuri: ['Dharmapuri', 'Harur', 'Palacode', 'Pennagaram', 'Pappireddipatti'],
    Dindigul: ['Dindigul', 'Palani', 'Oddanchatram', 'Natham', 'Vedasandur'],
    Erode: ['Pachampalayam', 'Padaiveedu', 'Erode Central', 'Gobichettipalayam', 'Sathyamangalam', 'Bhavani', 'Perundurai'],
    Kallakurichi: ['Kallakurichi', 'Sankarapuram', 'Chinnasalem', 'Ulundurpet', 'Rishivandiyam'],
    Kancheepuram: ['Kancheepuram', 'Uthiramerur', 'Walajabad', 'Kundrathur', 'Sriperumbudur'],
    Kanyakumari: ['Nagercoil', 'Marthandam', 'Kanyakumari', 'Colachel', 'Kuzhithurai'],
    Karur: ['Karur', 'Kulithalai', 'Aravakurichi', 'Krishnarayapuram', 'Paramathi'],
    Krishnagiri: ['Krishnagiri', 'Hosur', 'Denkanikottai', 'Uthangarai', 'Bargur'],
    Madurai: ['Madurai Periyar', 'Melur', 'Usilampatti', 'Thirumangalam', 'Vadipatti'],
    Mayiladuthurai: ['Mayiladuthurai', 'Sirkazhi', 'Kuthalam', 'Tharangambadi', 'Vaitheeswarankoil'],
    Nagapattinam: ['Nagapattinam', 'Velankanni', 'Vedaranyam', 'Kilvelur', 'Thirukkuvalai'],
    Namakkal: ['Namakkal', 'Tiruchengode', 'Rasipuram', 'Kumarapalayam', 'Kaundanur', 'Pachampalayam', 'ICL', 'Paramathi Velur', 'Mohanur', 'Senthamangalam'],
    Nilgiris: ['Udhagamandalam', 'Coonoor', 'Kotagiri', 'Gudalur', 'Pandalur'],
    Perambalur: ['Perambalur', 'Kunnam', 'Veppanthattai', 'Alathur', 'Labbaikudikadu'],
    Pudukkottai: ['Pudukkottai', 'Aranthangi', 'Alangudi', 'Iluppur', 'Keeranur'],
    Ramanathapuram: ['Ramanathapuram', 'Paramakudi', 'Rameswaram', 'Keelakarai', 'Mudukulathur'],
    Ranipet: ['Ranipet', 'Arcot', 'Arakkonam', 'Walajah', 'Sholinghur'],
    Salem: ['Salem Junction', 'Sankagiri', 'Mettur', 'Attur', 'Omalur', 'Edappadi', 'Yercaud Foothills'],
    Sivaganga: ['Sivaganga', 'Karaikudi', 'Devakottai', 'Manamadurai', 'Tirupathur'],
    Tenkasi: ['Tenkasi', 'Sankarankovil', 'Courtallam', 'Shencottai', 'Kadayanallur'],
    Thanjavur: ['Thanjavur', 'Kumbakonam', 'Papanasam', 'Pattukkottai', 'Orathanadu'],
    Theni: ['Theni', 'Periyakulam', 'Cumbum', 'Bodinayakanur', 'Andipatti'],
    Thoothukudi: ['Thoothukudi', 'Tiruchendur', 'Kovilpatti', 'Ettayapuram', 'Kayalpattinam'],
    Tiruchirappalli: ['Trichy Central', 'Srirangam', 'Lalgudi', 'Musiri', 'Thuraiyur'],
    Tirunelveli: ['Tirunelveli', 'Ambasamudram', 'Nanguneri', 'Cheranmahadevi', 'Palayamkottai'],
    Tirupathur: ['Tirupathur', 'Vaniyambadi', 'Ambur', 'Natrampalli', 'Jolarpettai'],
    Tiruppur: ['Tiruppur', 'Dharapuram', 'Kangeyam', 'Udumalaipettai', 'Palladam'],
    Tiruvallur: ['Tiruvallur', 'Ponneri', 'Avadi', 'Pattabiram', 'Tiruttani'],
    Tiruvannamalai: ['Tiruvannamalai', 'Arani', 'Polur', 'Chengam', 'Vandavasi'],
    Tiruvarur: ['Tiruvarur', 'Mannargudi', 'Kodavasal', 'Needamangalam', 'Thiruthuraipoondi'],
    Vellore: ['Vellore', 'Katpadi', 'Gudiyatham', 'Pernambut', 'Anaicut'],
    Viluppuram: ['Viluppuram', 'Tindivanam', 'Gingee', 'Kallakurichi', 'Marakkanam'],
    Virudhunagar: ['Virudhunagar', 'Sivakasi', 'Rajapalayam', 'Aruppukkottai', 'Sattur'],
};

const NO_DISTRICT_OPTION = 'No District';

const STOP_TALUKS = {
    'Erode:Pachampalayam': 'Bhavani Taluk',
    'Namakkal:Pachampalayam': 'Kumarapalayam Taluk',
    'Namakkal:Kumarapalayam': 'Kumarapalayam Taluk',
    'Erode:Kumarapalayam': 'Kumarapalayam Circle',
    'Namakkal:Kaundanur': 'Namakkal Taluk',
    'Namakkal:ICL': 'Kumarapalayam Industrial Area',
    'Salem:Sankagiri': 'Sankagiri Taluk',
    'Erode:Bhavani': 'Bhavani Taluk',
};

const ROUTE_TIMINGS = [
    {
        id: 'S2',
        from: 'Bhavani',
        to: 'Sankagiri',
        stops: ['Bhavani', 'Pachampalayam', 'Padaiveedu', 'Sankagiri'],
        buses: [
            { tripNo: '5370', serviceType: 'TNSTC EXPRESS', depot: 'Sankagiri Branch', departure: '06:10 AM', arrival: '07:05 AM' },
            { tripNo: '5583', serviceType: 'TNSTC EXPRESS', depot: 'Sankagiri Branch', departure: '08:45 AM', arrival: '09:40 AM' },
            { tripNo: '5366', serviceType: 'TNSTC EXPRESS', depot: 'Sankagiri Branch', departure: '12:30 PM', arrival: '01:25 PM' },
            { tripNo: '5585', serviceType: 'TNSTC EXPRESS', depot: 'Sankagiri Branch', departure: '05:40 PM', arrival: '06:35 PM' },
        ],
    },
    {
        id: 'E14',
        from: 'Pachampalayam',
        to: 'Salem Junction',
        stops: ['Pachampalayam', 'Bhavani', 'Sankagiri', 'Salem Junction'],
        buses: [
            { tripNo: '4112', serviceType: 'TNSTC ULTRA', depot: 'Bhavani Branch', departure: '07:00 AM', arrival: '08:35 AM' },
            { tripNo: '4118', serviceType: 'TNSTC ULTRA', depot: 'Bhavani Branch', departure: '10:20 AM', arrival: '11:55 AM' },
            { tripNo: '4124', serviceType: 'TNSTC ULTRA', depot: 'Bhavani Branch', departure: '02:15 PM', arrival: '03:50 PM' },
        ],
    },
    {
        id: 'NS7',
        from: 'Erode Central',
        to: 'Salem Junction',
        stops: ['Erode Central', 'Perundurai', 'Sankagiri', 'Salem Junction'],
        buses: [
            { tripNo: '2871', serviceType: 'TNSTC EXPRESS', depot: 'Erode Central Branch', departure: '05:55 AM', arrival: '07:20 AM' },
            { tripNo: '2874', serviceType: 'TNSTC EXPRESS', depot: 'Erode Central Branch', departure: '09:10 AM', arrival: '10:35 AM' },
            { tripNo: '2880', serviceType: 'TNSTC EXPRESS', depot: 'Erode Central Branch', departure: '06:05 PM', arrival: '07:30 PM' },
        ],
    },
    {
        id: 'C11',
        from: 'Coimbatore Gandhipuram',
        to: 'Salem Junction',
        stops: ['Coimbatore Gandhipuram', 'Avinashi', 'Sankagiri', 'Salem Junction'],
        buses: [
            { tripNo: '6210', serviceType: 'TNSTC EXPRESS', depot: 'Coimbatore Branch', departure: '06:30 AM', arrival: '09:10 AM' },
            { tripNo: '6218', serviceType: 'TNSTC EXPRESS', depot: 'Coimbatore Branch', departure: '11:15 AM', arrival: '01:55 PM' },
            { tripNo: '6226', serviceType: 'TNSTC EXPRESS', depot: 'Coimbatore Branch', departure: '04:45 PM', arrival: '07:25 PM' },
        ],
    },
    {
        id: 'N5',
        from: 'Namakkal',
        to: 'Salem Junction',
        stops: ['Namakkal', 'Rasipuram', 'Salem Junction'],
        buses: [
            { tripNo: '3451', serviceType: 'TNSTC TOWN', depot: 'Namakkal Branch', departure: '07:40 AM', arrival: '08:45 AM' },
            { tripNo: '3458', serviceType: 'TNSTC TOWN', depot: 'Namakkal Branch', departure: '01:00 PM', arrival: '02:05 PM' },
            { tripNo: '3464', serviceType: 'TNSTC TOWN', depot: 'Namakkal Branch', departure: '07:10 PM', arrival: '08:15 PM' },
        ],
    },
];

const districts = Object.keys(DISTRICT_STOPS);
const districtChoices = [NO_DISTRICT_OPTION, ...districts];
const stopOptions = districts.flatMap((district) =>
    DISTRICT_STOPS[district].map((name) => ({
        id: `${district}:${name}`,
        name,
        district,
        taluk: STOP_TALUKS[`${district}:${name}`] ?? '',
    }))
);

const formatStopOption = (stop) => {
    const parts = [stop.name];
    if (stop.taluk) parts.push(stop.taluk);
    parts.push(stop.district);
    return parts.join(' • ');
};

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

const RoutePlanner = ({ onBack }) => {
    const [selectedDistrict, setSelectedDistrict] = useState(NO_DISTRICT_OPTION);
    const [districtQuery, setDistrictQuery] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [selectedFrom, setSelectedFrom] = useState(null);
    const [selectedTo, setSelectedTo] = useState(null);
    const [activeField, setActiveField] = useState(null);
    const [searchTriggered, setSearchTriggered] = useState(false);

    const districtStops = useMemo(() => {
        if (selectedDistrict === NO_DISTRICT_OPTION) {
            return stopOptions;
        }

        return stopOptions.filter((stop) => stop.district === selectedDistrict);
    }, [selectedDistrict]);

    const districtSuggestions = useMemo(() => {
        if (activeField !== 'district') return [];
        const query = districtQuery.toLowerCase();
        const filtered = districtChoices.filter((district) => district.toLowerCase().includes(query));
        return filtered.length > 0 ? filtered : ['No matches found'];
    }, [activeField, districtQuery]);

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
    }, [activeField, districtStops, from, selectedFrom, selectedTo, to]);

    const availableRoutes = useMemo(() => {
        if (!selectedFrom || !selectedTo) return [];

        return ROUTE_TIMINGS.filter((route) => {
            const fromIndex = route.stops.indexOf(selectedFrom.name);
            const toIndex = route.stops.indexOf(selectedTo.name);
            return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
        });
    }, [selectedFrom, selectedTo]);

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
                <h1 style={{ fontSize: '1.2rem', fontWeight: 500, margin: 0 }}>Search Buses By Location</h1>
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
                        Select District
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
                        placeholder="Example: Salem or select No District"
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
                        Start typing a district name, or choose No District if you are unsure.
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
                            <span style={{ fontSize: '1.1rem', color: '#666' }}>From</span>
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
                                        ? 'Select from any place'
                                        : `Select stop in ${selectedDistrict}`
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
                                    ? 'All places are shown here. District and taluk labels help distinguish duplicate place names.'
                                    : `All available stops from ${selectedDistrict} district appear here, including smaller stops.`}
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
                            <span style={{ fontSize: '1.1rem', color: '#666' }}>To</span>
                            <input
                                value={to}
                                onChange={(e) => {
                                    setTo(e.target.value);
                                    setSelectedTo(null);
                                }}
                                onFocus={() => setActiveField('to')}
                                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                                placeholder="Select any destination"
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
                                Destination can be in any district, including Salem.
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
                    {selectedDistrict} District Stops
                </button>

                <button
                    onClick={() => setSearchTriggered(true)}
                    disabled={!canSearch}
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
                        backgroundColor: canSearch ? 'var(--primary)' : '#A9BFCC',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        cursor: canSearch ? 'pointer' : 'not-allowed',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    Search Bus <Search size={20} />
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <MapPinned size={18} color="var(--primary)" />
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#243746' }}>
                                    {selectedFrom?.name ?? from} to {selectedTo?.name ?? to}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#6A7E8F' }}>
                                    Showing available bus routes and timings
                                </div>
                            </div>
                        </div>

                        {availableRoutes.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {availableRoutes.map((route) => (
                                    <div
                                        key={route.id}
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '16px',
                                            padding: '14px',
                                            border: '1px solid #E6EDF3',
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {route.buses.map((bus) => (
                                                <div
                                                    key={`${route.id}-${bus.tripNo}`}
                                                    style={{
                                                        border: '1px solid #D5DCE4',
                                                        borderRadius: '18px',
                                                        padding: '16px',
                                                        backgroundColor: '#FFFFFF',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            justifyContent: 'space-between',
                                                            gap: '12px',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <BusFront size={18} color="var(--primary)" />
                                                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1D2D3A' }}>
                                                                Service No : {route.id}
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                padding: '10px 14px',
                                                                borderRadius: '999px',
                                                                backgroundColor: '#E9E9FF',
                                                                color: '#32325A',
                                                                fontWeight: 700,
                                                                fontSize: '0.82rem',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            {bus.serviceType}
                                                        </div>
                                                    </div>

                                                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1D2D3A', marginBottom: '8px' }}>
                                                        {(selectedFrom?.name ?? from).toUpperCase()} - {(selectedTo?.name ?? to).toUpperCase()}
                                                    </div>

                                                    <div style={{ fontSize: '0.96rem', color: '#455768', marginBottom: '12px' }}>
                                                        Depot Name : {bus.depot}
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'stretch',
                                                            justifyContent: 'space-between',
                                                            gap: '16px',
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'stretch', gap: '16px' }}>
                                                            <div>
                                                                <div style={{ fontSize: '0.95rem', color: '#455768', marginBottom: '6px' }}>
                                                                    Schedule Departure
                                                                </div>
                                                                <div style={{ fontSize: '0.95rem', color: '#455768' }}>
                                                                    Schedule Arrival
                                                                </div>
                                                            </div>
                                                            <div style={{ width: '1px', backgroundColor: '#C8D0D9' }}></div>
                                                            <div>
                                                                <div style={{ fontSize: '1rem', color: '#2A3E50', marginBottom: '6px' }}>
                                                                    {bus.departure}
                                                                </div>
                                                                <div style={{ fontSize: '1rem', color: '#2A3E50' }}>
                                                                    {bus.arrival}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={28} color="#1D2D3A" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
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
                                No direct bus routes were found between these locations. We are continuously adding more routes to our database.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoutePlanner;
