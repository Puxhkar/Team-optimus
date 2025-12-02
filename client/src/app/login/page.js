"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import Link from 'next/link';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const role = user.role?.toLowerCase();
            if (role === 'admin') router.push('/admin');
            else router.push('/menu');
        }
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Dispatch login event
            window.dispatchEvent(new Event('user-login'));

            // Redirect based on role
            const role = res.data.user.role?.toLowerCase();
            if (role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/menu');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
                {error && <div className="badge badge-danger" style={{ display: 'block', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                    Don't have an account? <Link href="/register" style={{ color: 'var(--primary)' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
