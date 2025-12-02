"use client";
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Star, MessageSquare, User } from 'lucide-react';

export default function Feedback() {
    const [role, setRole] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchUserAndFeedback = async () => {
            try {
                // 1. Get User Role (We can decode token or fetch profile)
                // For simplicity, let's fetch profile
                const profileRes = await api.get('/profile');
                setRole(profileRes.data.role);

                // 2. If Admin, fetch all feedback
                if (profileRes.data.role === 'ADMIN') {
                    const feedbackRes = await api.get('/feedback');
                    setFeedbacks(feedbackRes.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndFeedback();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/feedback', { rating, comment });
            alert("Thank you for your feedback!");
            setComment("");
            setRating(5);
        } catch (err) {
            alert(err.response?.data?.message || "Error submitting feedback");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    marginBottom: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    {role === 'ADMIN' ? 'Student Feedback' : 'Share Your Experience'}
                </h2>
                <p style={{ color: 'var(--gray-dark)', fontSize: '1.1rem' }}>
                    {role === 'ADMIN' ? 'Review what students are saying' : 'Help us improve our service'}
                </p>
            </div>

            {role === 'ADMIN' ? (
                // ADMIN VIEW
                <div className="grid gap-4">
                    {feedbacks.length === 0 ? (
                        <p className="text-center text-gray-500">No feedback yet.</p>
                    ) : (
                        feedbacks.map((fb) => (
                            <div key={fb.id} className="card" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <div style={{
                                    background: 'var(--light)',
                                    padding: '10px',
                                    borderRadius: '50%',
                                    color: 'var(--primary)'
                                }}>
                                    <User size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <h4 style={{ fontWeight: 'bold' }}>{fb.user.name}</h4>
                                        <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < fb.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.95rem' }}>{fb.comment}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '8px' }}>
                                        {new Date(fb.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                // STUDENT VIEW
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Rate your experience</label>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={32}
                                        onClick={() => setRating(star)}
                                        fill={star <= rating ? "#fbbf24" : "none"}
                                        color={star <= rating ? "#fbbf24" : "#cbd5e1"}
                                        style={{ transition: 'all 0.2s' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Your Comments</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us what you liked or how we can improve..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    minHeight: '120px',
                                    resize: 'vertical'
                                }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                            disabled={submitting}
                        >
                            <MessageSquare size={20} />
                            {submitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
