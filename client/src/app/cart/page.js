"use client";
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
        calculateTotal(savedCart);
    }, []);

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(sum);
    };

    const updateQuantity = (id, delta) => {
        const newCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        calculateTotal(newCart);
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        calculateTotal(newCart);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        router.push('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Your cart is empty</h2>
                <p>Go to the menu to add some delicious food!</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Your Cart</h2>
            <div className="card">
                {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gray)', padding: '15px 0' }}>
                        <div>
                            <h4>{item.name}</h4>
                            <p>₹{item.price} x {item.quantity}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => updateQuantity(item.id, -1)} className="btn btn-outline" style={{ padding: '5px 10px' }}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="btn btn-outline" style={{ padding: '5px 10px' }}>+</button>
                            </div>
                            <button onClick={() => removeItem(item.id)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <h3>Total: ₹{total}</h3>
                    <button onClick={handleCheckout} className="btn btn-primary" style={{ marginTop: '15px' }}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
