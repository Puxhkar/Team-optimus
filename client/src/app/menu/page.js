"use client";
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Search, Filter, ShoppingCart, Plus, Minus, Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedOutlet, setSelectedOutlet] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menuRes, outletsRes] = await Promise.all([
                    api.get('/menu'),
                    api.get('/menu/outlets')
                ]);
                setMenuItems(menuRes.data);
                setFilteredItems(menuRes.data);
                setOutlets(outletsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let result = menuItems;

        // Filter by search term
        if (searchTerm) {
            result = result.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            result = result.filter(item => item.category === selectedCategory);
        }

        // Filter by outlet
        if (selectedOutlet !== 'All') {
            result = result.filter(item => item.outletId === selectedOutlet);
        }

        setFilteredItems(result);
    }, [searchTerm, selectedCategory, selectedOutlet, menuItems]);

    const addToCart = (item) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find((i) => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
        alert('Added to cart!');
    };

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    if (loading) return (
        <div style={{
            textAlign: 'center',
            marginTop: '100px',
            fontSize: '1.2rem',
            color: 'var(--gray-dark)'
        }}>
            Loading delicious items...
        </div>
    );

    return (
        <div style={{ padding: '40px 20px' }}>
            <div className="container">
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '3rem',
                        marginBottom: '10px',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Our Menu
                    </h2>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '1.2rem' }}>
                        Explore our delicious offerings
                    </p>
                </div>

                {/* Search and Filter - Modern Card Design */}
                <div style={{
                    marginBottom: '50px',
                    maxWidth: '900px',
                    margin: '0 auto 50px'
                }}>
                    {/* Search Bar */}
                    <div style={{
                        position: 'relative',
                        marginBottom: '24px',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden'
                    }}>
                        <Search
                            size={20}
                            style={{
                                position: 'absolute',
                                left: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9CA3AF'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search for delicious food..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '18px 20px 18px 52px',
                                border: 'none',
                                borderRadius: '16px',
                                fontSize: '1rem',
                                color: '#1F2937',
                                outline: 'none',
                                backgroundColor: 'transparent'
                            }}
                        />
                    </div>

                    {/* Filters Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        {/* Outlet Selector */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            paddingBottom: '20px',
                            borderBottom: '1px solid #F3F4F6'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                minWidth: '120px',
                                color: '#6B7280',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                                <span>Location</span>
                            </div>

                            <select
                                value={selectedOutlet}
                                onChange={(e) => setSelectedOutlet(e.target.value === 'All' ? 'All' : parseInt(e.target.value))}
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #E5E7EB',
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    color: '#1F2937',
                                    backgroundColor: '#F9FAFB',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    appearance: 'none',
                                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '20px',
                                    paddingRight: '40px'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.backgroundColor = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.borderColor = '#E5E7EB';
                                    e.target.style.backgroundColor = '#F9FAFB';
                                }}
                            >
                                <option value="All">All Outlets</option>
                                {outlets.map(outlet => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filters */}
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '16px',
                                color: '#6B7280',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                <Filter size={18} style={{ color: 'var(--primary)' }} />
                                <span>Category</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '10px',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            border: selectedCategory === cat ? 'none' : '2px solid #E5E7EB',
                                            background: selectedCategory === cat
                                                ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                                                : '#F9FAFB',
                                            color: selectedCategory === cat ? 'white' : '#6B7280',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: selectedCategory === cat
                                                ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                                                : 'none',
                                            transform: selectedCategory === cat ? 'translateY(-2px)' : 'none'
                                        }}
                                        onMouseOver={(e) => {
                                            if (selectedCategory !== cat) {
                                                e.target.style.borderColor = 'var(--primary)';
                                                e.target.style.backgroundColor = '#F3F4F6';
                                                e.target.style.transform = 'translateY(-1px)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (selectedCategory !== cat) {
                                                e.target.style.borderColor = '#E5E7EB';
                                                e.target.style.backgroundColor = '#F9FAFB';
                                                e.target.style.transform = 'none';
                                            }
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="card" style={{
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Category Badge */}
                            <span className="badge badge-warning" style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                zIndex: 1
                            }}>
                                {item.category}
                            </span>

                            <div style={{ marginBottom: '15px' }}>
                                <h3 style={{
                                    fontSize: '1.4rem',
                                    marginBottom: '8px',
                                    color: 'var(--dark)',
                                    fontWeight: '700'
                                }}>
                                    {item.name}
                                </h3>

                                {item.outlet && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '13px',
                                        color: 'var(--gray-dark)',
                                        marginBottom: '8px'
                                    }}>
                                        <MapPin size={14} />
                                        {item.outlet.name}
                                    </div>
                                )}
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '20px',
                                fontSize: '14px',
                                color: 'var(--gray-dark)'
                            }}>
                                <Clock size={16} />
                                {item.preparationTime || 'N/A'}
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 'auto'
                            }}>
                                <span style={{
                                    fontWeight: '800',
                                    fontSize: '1.8rem',
                                    color: 'var(--primary)'
                                }}>
                                    ₹{item.price}
                                </span>

                                <button
                                    onClick={() => addToCart(item)}
                                    className="btn btn-secondary"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 20px',
                                        borderRadius: '50px'
                                    }}
                                    disabled={!item.isAvailable}
                                >
                                    <ShoppingCart size={18} />
                                    {item.isAvailable ? 'Add' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--gray-dark)' }}>
                        <p>No items found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
