import React, { useState } from 'react';
import { ChevronDown, Bell, User, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.svg';

const Header = ({ lang, setLang, title }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const languages = [
        { code: 'ENG', label: 'English', native: 'English' },
        { code: 'TAM', label: 'Tamil', native: 'தமிழ்' }
    ];

    const content = {
        ENG: {
            title: 'TNSTC',
            subtitle: 'Tamil Nadu State Transport Corporation'
        },
        TAM: {
            title: 'த.நா.அ.போ.க',
            subtitle: 'தமிழ்நாடு அரசு போக்குவரத்துக் கழகம்'
        }
    };

    return (
        <header style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '15px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderBottomLeftRadius: '25px',
            borderBottomRightRadius: '25px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            zIndex: 1000,
            position: 'sticky',
            top: 0
        }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div style={{ width: 24 }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{title}</h2>
                <div style={{ position: 'relative' }}>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            border: '1px solid rgba(255,255,255,0.4)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            backgroundColor: isDropdownOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Globe size={14} />
                        {lang} <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                style={{
                                    position: 'absolute',
                                    top: '40px',
                                    right: 0,
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                    overflow: 'hidden',
                                    width: '120px',
                                    zIndex: 1100
                                }}
                            >
                                {languages.map((l) => (
                                    <div 
                                        key={l.code}
                                        onClick={() => {
                                            setLang(l.code);
                                            setIsDropdownOpen(false);
                                        }}
                                        style={{
                                            padding: '12px 15px',
                                            color: lang === l.code ? 'var(--primary)' : '#444',
                                            backgroundColor: lang === l.code ? '#F0F9FF' : 'white',
                                            fontSize: '0.9rem',
                                            fontWeight: lang === l.code ? 700 : 500,
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #f0f0f0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <span style={{ fontSize: '0.85rem' }}>{l.label}</span>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{l.native}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Info Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>{content[lang].title}</h1>
                    <p style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '4px', maxWidth: '220px', lineHeight: 1.3 }}>
                        {content[lang].subtitle}
                    </p>
                </div>
                <div style={{
                    width: 80,
                    height: 80,
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    border: '2px solid rgba(255,255,255,0.2)'
                }}>
                    <img src={logo} alt="TN Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            </div>
        </header>
    );
};

export default Header;
