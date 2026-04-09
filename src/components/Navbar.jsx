import React from 'react';
import { Home, MapPin, Route, MessageSquare, Bell } from 'lucide-react';

const Navbar = ({ lang, activeTab, setActiveTab }) => {
    const t = {
        ENG: { home: 'Home', track: 'Track', route: 'Route', feedback: 'Feedback' },
        TAM: { home: 'முகப்பு', track: 'கண்காணி', route: 'வழித்தடம்', feedback: 'கருத்து' }
    }[lang] || { home: 'Home', track: 'Track', route: 'Route', feedback: 'Feedback' };

    const tabs = [
        { id: 'home', label: t.home, icon: Home },
        { id: 'track', label: t.track, icon: MapPin },
        { id: 'planner', label: t.route, icon: Route },
        { id: 'feedback', label: t.feedback, icon: MessageSquare },
    ];

    return (
        <nav className="glass" style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'var(--navbar-height)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 10px',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            zIndex: 1000,
            backgroundColor: 'white'
        }}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: isActive ? 'var(--primary)' : 'var(--text-light)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            flex: 1,
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            backgroundColor: isActive ? 'rgba(0, 132, 80, 0.1)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                        }}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: isActive ? 600 : 400
                        }}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default Navbar;
