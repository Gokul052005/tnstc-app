import React from 'react';
import {
    MapPin,
    Navigation,
    Bus,
    QrCode,
    PhoneCall,
    Star,
    Search,
    Route,
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = ({ lang, onTrackBus, onRouteTrackingClick, onBusStopsNearMeClick, onPlannerClick, onTrackServiceClick, onAdminClick }) => {
    const t = {
        ENG: {
            stops: 'Search for bus stops near me',
            plannerText: 'Search For Buses Between',
            plannerSub: 'Two Locations (From-To)',
            trackResText: 'Track Bus By Reservation',
            trackResSub: 'Service Number',
            trackVehText: 'Track Bus',
            trackVehSub: 'By Vehicle Route',
            emergency: 'Emergency',
            favs: 'My Favourites',
            powered: 'Real-time tracking powered by TNSTC IS',
            admin: 'Admin Access'
        },
        TAM: {
            stops: 'அருகிலுள்ள பேருந்து நிறுத்தங்களைத் தேடுங்கள்',
            plannerText: 'இரண்டு இடங்களுக்கு இடையிலான',
            plannerSub: 'பேருந்துகள் (இருந்து-வரை)',
            trackResText: 'முன்பதிவு சேவை எண் மூலம்',
            trackResSub: 'பேருந்து கண்காணிப்பு',
            trackVehText: 'வாகன வழித்தடம் மூலம்',
            trackVehSub: 'பேருந்து கண்காணிப்பு',
            emergency: 'அவசரம்',
            favs: 'எனது பிடித்தவை',
            powered: 'நேரடி கண்காணிப்பு த.நா.அ.போ.க மூலம் வழங்கப்படுகிறது',
            admin: 'நிர்வாக அணுகல்'
        }
    }[lang] || {
        stops: 'Search for bus stops near me',
        plannerText: 'Search For Buses Between',
        plannerSub: 'Two Locations (From-To)',
        trackResText: 'Track Bus By Reservation',
        trackResSub: 'Service Number',
        trackVehText: 'Track Bus',
        trackVehSub: 'By Vehicle Route',
        emergency: 'Emergency',
        favs: 'My Favourites',
        powered: 'Real-time tracking powered by TNSTC IS',
        admin: 'Admin Access'
    };

    const actions = [
        {
            id: 'stops',
            title: t.stops,
            icon: MapPin,
            color: '#0288D1', // Deeper blue
            bg: '#E1F5FE'
        },
        {
            id: 'planner',
            title: t.plannerText + ' ' + t.plannerSub,
            icon: Route,
            color: '#00897B', // Deeper teal
            bg: '#E0F2F1'
        },
        {
            id: 'track-res',
            title: t.trackResText + ' ' + t.trackResSub,
            icon: Bus,
            color: '#3F51B5', // Indigo
            bg: '#E8EAF6'
        },
        {
            id: 'track-veh',
            title: t.trackVehText + ' ' + t.trackVehSub,
            icon: QrCode,
            color: '#F4511E', // Deep orange
            bg: '#FBE9E7'
        },
        {
            id: 'emergency',
            title: t.emergency,
            icon: PhoneCall,
            color: '#E53935', // Red
            bg: '#FFEBEE'
        },
        {
            id: 'favs',
            title: t.favs,
            icon: Star,
            color: '#8E24AA', // Purple
            bg: '#F3E5F5'
        },
    ];

    return (
        <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px'
            }}>
                {actions.map((action, i) => {
                    const Icon = action.icon;
                    const isNearbyStops = action.id === 'stops';
                    const isPlanner = action.id === 'planner';
                    const isTrackVeh = action.id === 'track-veh';
                    const isTrackRes = action.id === 'track-res';

                    return (
                        <motion.div
                            key={action.id}
                            whileTap={{ scale: 0.95 }}
                            className="card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between', 
                                textAlign: 'center',
                                padding: '20px 15px',
                                height: '210px', 
                                border: '1px solid #eee',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                borderRadius: '18px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                            }}
                            onClick={() => {
                                if (action.id === 'planner') onPlannerClick();
                                if (action.id === 'track-veh') onRouteTrackingClick();
                                if (action.id === 'stops') onBusStopsNearMeClick();
                                if (action.id === 'track-res') onTrackServiceClick();
                            }}
                        >
                            <div style={{
                                width: '100px', 
                                height: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                {isNearbyStops ? (
                                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', border: '1px dashed #B2DFDB', borderRadius: '50%', transform: 'scale(1.1)' }}></div>
                                        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', border: '1px dashed #E1F5FE', borderRadius: '50%', transform: 'scale(1.25) rotate(45deg)' }}></div>
                                        
                                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                                            <rect x="25" y="45" width="50" height="35" rx="8" stroke="#0288D1" strokeWidth="2.5" fill="white" />
                                            <rect x="30" y="50" width="40" height="15" rx="2" stroke="#0288D1" strokeWidth="2" fill="#E1F5FE" />
                                            <circle cx="35" cy="74" r="5" stroke="#0288D1" strokeWidth="2.5" fill="white" />
                                            <circle cx="65" cy="74" r="5" stroke="#0288D1" strokeWidth="2.5" fill="white" />
                                            <path d="M75 40V80H80" stroke="#0288D1" strokeWidth="2.5" strokeLinecap="round" />
                                            <path d="M15 50V80H20" stroke="#0288D1" strokeWidth="2.5" strokeLinecap="round" />
                                            <rect x="18" y="30" width="15" height="40" rx="2" stroke="#00897B" strokeWidth="2" strokeDasharray="2 2" />
                                            <circle cx="20" cy="20" r="2" fill="#00897B" />
                                            <circle cx="80" cy="25" r="3" fill="#E1F5FE" />
                                        </svg>
                                    </div>
                                ) : isPlanner ? (
                                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                                            <path d="M15 70C25 60 40 85 50 70C60 55 75 80 85 60" stroke="#80CBC4" strokeWidth="2" strokeDasharray="3 3" />
                                            <circle cx="15" cy="70" r="6" stroke="#00897B" strokeWidth="2" fill="white" />
                                            <circle cx="15" cy="70" r="2" fill="#00897B" />
                                            <circle cx="85" cy="60" r="6" stroke="#00897B" strokeWidth="2" fill="white" />
                                            <circle cx="85" cy="60" r="2" fill="#00897B" />
                                            <rect x="35" y="25" width="30" height="35" rx="6" stroke="#00897B" strokeWidth="2.5" fill="white" />
                                            <rect x="39" y="30" width="22" height="12" rx="2" stroke="#00897B" strokeWidth="2" fill="#E0F2F1" />
                                            <rect x="42" y="52" width="6" height="3" rx="1" fill="#00897B" />
                                            <rect x="52" y="52" width="6" height="3" rx="1" fill="#00897B" />
                                            <path d="M35 50H65" stroke="#00897B" strokeWidth="1.5" />
                                            <circle cx="25" cy="15" r="2" fill="#B2DFDB" />
                                            <circle cx="75" cy="15" r="3" fill="#E0F2F1" />
                                        </svg>
                                    </div>
                                ) : isTrackVeh ? (
                                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                        <circle cx="50" cy="50" r="35" stroke="#FFCCBC" strokeWidth="1" strokeDasharray="4 4" style={{ position: 'absolute' }} />
                                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                                            <path d="M20 80C20 80 30 30 80 20" stroke="#F4511E" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                                            <circle cx="80" cy="20" r="5" fill="#F4511E" opacity="0.3">
                                                <animate attributeName="r" values="5;8;5" dur="1.5s" repeatCount="indefinite" />
                                                <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="80" cy="20" r="3" fill="#F4511E" />
                                            <rect x="25" y="35" width="45" height="30" rx="4" stroke="#F4511E" strokeWidth="2.5" fill="white" />
                                            <rect x="30" y="40" width="35" height="12" rx="1" stroke="#F4511E" strokeWidth="1.5" fill="#FBE9E7" />
                                            <path d="M47.5 45C47.5 42.2386 49.7386 40 52.5 40C55.2614 40 57.5 42.2386 57.5 45C57.5 47.7614 52.5 53 52.5 53C52.5 53 47.5 47.7614 47.5 45Z" fill="#F4511E" />
                                        </svg>
                                    </div>
                                ) : isTrackRes ? (
                                    <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {/* Decorative background glass circles from image */}
                                        <div style={{ position: 'absolute', width: '65px', height: '65px', borderRadius: '50%', backgroundColor: '#F1F5F9', opacity: 0.8, top: '5px', right: '-5px', zIndex: 0 }}></div>
                                        <div style={{ position: 'absolute', width: '65px', height: '65px', borderRadius: '50%', backgroundColor: '#F1F5F9', opacity: 0.6, bottom: '5px', left: '-5px', zIndex: 0 }}></div>
                                        
                                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
                                            {/* Bus Side Profile */}
                                            <path d="M15 40H85V70H15V40Z" fill="white" stroke="#3F51B5" strokeWidth="2.5" />
                                            <path d="M15 40H35V70" stroke="#3F51B5" strokeWidth="2.5" />
                                            <rect x="40" y="45" width="40" height="15" rx="2" stroke="#3F51B5" strokeWidth="1.5" fill="#E8EAF6" />
                                            
                                            {/* Service Number Badge from image */}
                                            <rect x="45" y="58" width="22" height="9" rx="1.5" fill="#3F51B5" />
                                            <text x="48" y="64.5" fontSize="6" fill="white" fontWeight="800" style={{ pointerEvents: 'none' }}>5369</text>
                                            
                                            {/* Detail elements */}
                                            <rect x="80" y="48" width="3" height="12" rx="1" fill="#3F51B5" />
                                            <circle cx="28" cy="70" r="5" stroke="#3F51B5" strokeWidth="2.5" fill="white" />
                                            <circle cx="72" cy="70" r="5" stroke="#3F51B5" strokeWidth="2.5" fill="white" />
                                            
                                            {/* Decorative floating pluses and dots from image */}
                                            <g opacity="0.8">
                                                <path d="M50 8V16M46 12H54" stroke="#80CBC4" strokeWidth="1.5" />
                                                <path d="M50 84V92M46 88H54" stroke="#80CBC4" strokeWidth="1.5" />
                                                <circle cx="78" cy="22" r="2" fill="#80CBC4" />
                                                <circle cx="22" cy="35" r="2" fill="#80CBC4" />
                                                <circle cx="70" cy="15" r="1.5" fill="#E8EAF6" />
                                            </g>
                                        </svg>
                                    </div>
                                ) : (
                                    <div style={{
                                        width: '70px',
                                        height: '70px',
                                        borderRadius: '50%',
                                        backgroundColor: action.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            border: `1px dashed ${action.color}`,
                                            opacity: 0.3,
                                            transform: 'scale(1.2)'
                                        }}></div>
                                        <Icon size={32} color={action.color} />
                                    </div>
                                )}
                            </div>
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                lineHeight: '1.4',
                                color: '#334155',
                                padding: '0 5px'
                            }}>
                                {isTrackRes ? (
                                    <>{t.trackResText}<br />{t.trackResSub}</>
                                ) : isTrackVeh ? (
                                    <>{t.trackVehText}<br />{t.trackVehSub}</>
                                ) : isPlanner ? (
                                    <>{t.plannerText}<br />{t.plannerSub}</>
                                ) : (
                                    action.title
                                )}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer Info Area */}
            <div style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: 'var(--radius)',
                textAlign: 'center',
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <p style={{ fontSize: '0.85rem', color: '#888' }}>
                    {t.powered}
                </p>
                <div onClick={onAdminClick} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '12px', color: '#aaa', cursor: 'pointer', fontSize: '0.8rem', padding: '5px' }}>
                    <Lock size={14} /> {t.admin}
                </div>
            </div>
        </div>
    );
};

export default Home;
