import React, { useState } from 'react';
import { MessageSquare, Star, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';

const Feedback = ({ lang }) => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [category, setCategory] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = {
        ENG: {
            title: 'Passenger Feedback',
            subtitle: 'Help us improve TNSTC services',
            thanks: 'Thank You!',
            recorded: 'Your feedback has been recorded successfully.',
            howRide: 'How was your ride?',
            whatImprove: 'What can we improve?',
            shareExp: 'Share your experience (Optional)',
            submit: 'Submit Feedback',
            submitting: 'Submitting...',
            reporting: 'Reporting an Issue?',
            emergencyInfo: 'For accidents or breakdowns, please use the Emergency Helpline in the SOS section.',
            categories: {
                cleanliness: 'Cleanliness',
                punctuality: 'Punctuality',
                safety: 'Driving/Safety',
                staff: 'Staff Behavior'
            }
        },
        TAM: {
            title: 'பயணிகளின் கருத்து',
            subtitle: 'த.நா.அ.போ.க சேவைகளை மேம்படுத்த எங்களுக்கு உதவுங்கள்',
            thanks: 'நன்றி!',
            recorded: 'உங்கள் கருத்து வெற்றிகரமாக பதிவு செய்யப்பட்டது.',
            howRide: 'உங்கள் பயணம் எப்படி இருந்தது?',
            whatImprove: 'நாங்கள் எதை மேம்படுத்தலாம்?',
            shareExp: 'உங்கள் அனுபவத்தைப் பகிரவும் (விருப்பத்தேர்வு)',
            submit: 'கருத்தைச் சமர்ப்பிக்கவும்',
            submitting: 'சமர்ப்பிக்கிறது...',
            reporting: 'பிரச்சினையைப் புகாரளிக்கிறீர்களா?',
            emergencyInfo: 'விபத்துக்கள் அல்லது பழுதான நிகழ்வுகளுக்கு, SOS பிரிவில் உள்ள அவசர உதவி எண்ணைப் பயன்படுத்தவும்.',
            categories: {
                cleanliness: 'தூய்மை',
                punctuality: 'சரியான நேரம்',
                safety: 'ஓட்டுநர்/பாதுகாப்பு',
                staff: 'ஊழியர்களின் நடத்தை'
            }
        }
    }[lang] || {
        title: 'Passenger Feedback', subtitle: 'Help us improve TNSTC services', thanks: 'Thank You!', recorded: 'Your feedback has been recorded successfully.', howRide: 'How was your ride?', whatImprove: 'What can we improve?', shareExp: 'Share your experience (Optional)', submit: 'Submit Feedback', submitting: 'Submitting...', reporting: 'Reporting an Issue?', emergencyInfo: 'For accidents or breakdowns, please use the Emergency Helpline in the SOS section.',
        categories: { cleanliness: 'Cleanliness', punctuality: 'Punctuality', safety: 'Driving/Safety', staff: 'Staff Behavior' }
    };

    const handleSubmit = async (e) => {
        // ... same handleSubmit logic
        e.preventDefault();
        if (rating === 0) {
            alert(lang === 'TAM' ? "தயவுசெய்து நட்சத்திர மதிப்பீட்டை வழங்கவும்." : "Please provide a star rating.");
            return;
        }

        setIsSubmitting(true);
        try {
            const feedbackRef = ref(db, 'feedback');
            const newFeedbackRef = push(feedbackRef);
            await set(newFeedbackRef, {
                rating,
                category,
                comment,
                timestamp: new Date().toISOString(),
                istDisplay: new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
                lang: lang
            });
            
            setSubmitted(true);
            setRating(0);
            setCategory('');
            setComment('');
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error("Feedback error:", error);
            alert(lang === 'TAM' ? "கருத்தைச் சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்." : "Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        { id: 'cleanliness', label: t.categories.cleanliness, icon: '🧼' },
        { id: 'punctuality', label: t.categories.punctuality, icon: '⏰' },
        { id: 'safety', label: t.categories.safety, icon: '🛡️' },
        { id: 'staff', label: t.categories.staff, icon: '🤵' },
    ];

    return (
        <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '100px' }}>
            <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{t.title}</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{t.subtitle}</p>
            </div>

            <AnimatePresence>
                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="card"
                        style={{
                            backgroundColor: 'var(--success)',
                            color: 'white',
                            textAlign: 'center',
                            padding: '30px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '15px'
                        }}
                    >
                        <CheckCircle2 size={48} />
                        <div>
                            <h3>{t.thanks}</h3>
                            <p style={{ opacity: 0.9 }}>{t.recorded}</p>
                        </div>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h4 style={{ marginBottom: '15px' }}>{t.howRide}</h4>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Star
                                            size={32}
                                            fill={rating >= s ? 'var(--secondary)' : 'none'}
                                            color={rating >= s ? 'var(--secondary)' : '#ccc'}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.9rem', marginBottom: '10px', fontWeight: 500 }}>{t.whatImprove}</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategory(cat.id)}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '10px',
                                                border: category === cat.id ? '2px solid var(--primary)' : '1px solid #eee',
                                                backgroundColor: category === cat.id ? 'rgba(0, 132, 80, 0.05)' : 'white',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontSize: '0.80rem'
                                            }}
                                        >
                                            <span>{cat.icon}</span>
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <textarea
                                    placeholder={t.shareExp}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        borderRadius: '10px',
                                        border: '1px solid #eee',
                                        padding: '12px',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        resize: 'none'
                                    }}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
                                <Send size={18} /> {isSubmitting ? t.submitting : t.submit}
                            </button>
                        </div>

                        <div className="card" style={{
                            border: '1px solid rgba(211, 47, 47, 0.2)',
                            backgroundColor: 'rgba(211, 47, 47, 0.02)',
                            display: 'flex',
                            gap: '12px'
                        }}>
                            <AlertTriangle color="var(--error)" size={24} />
                            <div>
                                <h4 style={{ margin: 0, color: 'var(--error)' }}>{t.reporting}</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                    {t.emergencyInfo}
                                </p>
                            </div>
                        </div>
                    </form>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Feedback;
