import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, Info, Clock, Map as MapIcon, ChevronLeft } from 'lucide-react';

// Fix for default marker icon in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
});

const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const TrackBus = ({ lang, selectedBus, onBack }) => {
    const t = {
        ENG: {
            bus: 'Bus',
            from: 'From:',
            to: 'To:',
            onTime: 'On time',
            mins: 'mins',
            youAreHere: 'You are here',
            searchPlaceholder: 'Find nearby buses...',
            nearby: 'Nearby:',
            arrivingSoon: 'buses arriving soon',
            notifyMe: 'Notify Me'
        },
        TAM: {
            bus: 'பேருந்து',
            from: 'இருந்து:',
            to: 'வரை:',
            onTime: 'நேரத்தில்',
            mins: 'நிமிடம்',
            youAreHere: 'நீங்கள் இங்கே இருக்கிறீர்கள்',
            searchPlaceholder: 'அருகிலுள்ள பேருந்துகளைத் தேடுங்கள்...',
            nearby: 'அருகில்:',
            arrivingSoon: 'பேருந்துகள் விரைவில் வருகின்றன',
            notifyMe: 'அறிவிக்கவும்'
        }
    }[lang] || {
        bus: 'Bus', from: 'From:', to: 'To:', onTime: 'On time', mins: 'mins', youAreHere: 'You are here', searchPlaceholder: 'Find nearby buses...', nearby: 'Nearby:', arrivingSoon: 'buses arriving soon', notifyMe: 'Notify Me'
    };

    const [buses, setBuses] = useState([
        { id: 1, pos: [13.0827, 80.2707], route: 'C70', from: 'Guindy', to: 'CMBT', delay: `2 ${t.mins}` },
        { id: 2, pos: [13.0067, 80.2206], route: '570', from: 'Kelambakkam', to: 'CMBT', delay: t.onTime },
        { id: 3, pos: [12.9815, 80.2185], route: '21G', from: 'Vandalur', to: 'Broadway', delay: `5 ${t.mins}` },
    ]);

    const center = selectedBus ? selectedBus.pos || [13.0827, 80.2707] : [13.0827, 80.2707];

    return (
        <div className="animate-fade-in" style={{ flex: 1, height: '100%', width: '100%', position: 'relative' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {buses.map(bus => (
                    <Marker key={bus.id} position={bus.pos} icon={busIcon}>
                        <Popup>
                            <div style={{ padding: '5px' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: 'var(--primary)' }}>{t.bus} {bus.route}</h4>
                                <p style={{ margin: '0', fontSize: '0.8rem' }}><strong>{t.from}</strong> {bus.from}</p>
                                <p style={{ margin: '0', fontSize: '0.8rem' }}><strong>{t.to}</strong> {bus.to}</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: bus.delay === t.onTime ? 'var(--success)' : 'var(--error)' }}>
                                    {bus.delay}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <Marker position={[13.0400, 80.2300]} icon={userIcon}>
                    <Popup>{t.youAreHere}</Popup>
                </Marker>
            </MapContainer>

            {/* Overlays */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {selectedBus && (
                    <button
                        onClick={onBack}
                        className="glass"
                        style={{
                            alignSelf: 'flex-start',
                            padding: '10px',
                            borderRadius: '50%',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow)'
                        }}
                    >
                        <ChevronLeft size={24} color="var(--primary)" />
                    </button>
                )}

                <div className="glass card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Navigation size={20} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
                    />
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <div className="glass card" style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                            <h4 style={{ margin: 0 }}>{t.nearby} T-Nagar Terminus</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>3 {t.arrivingSoon}</p>
                        </div>
                        <button className="btn-primary" style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                            {t.notifyMe}
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                minWidth: '100px',
                                padding: '10px',
                                backgroundColor: 'rgba(0, 132, 80, 0.05)',
                                borderRadius: '8px',
                                border: '1px solid rgba(0, 132, 80, 0.1)'
                            }}>
                                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>C70</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{i * 4} {t.mins}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackBus;
