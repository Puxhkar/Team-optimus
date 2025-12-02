"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import { CreditCard, Banknote, QrCode, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
        const sum = savedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(sum);
    }, []);

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderItems = cart.map(item => ({
                menuItemId: item.id,
                quantity: item.quantity
            }));

            await api.post('/orders', {
                orderItems,
                totalAmount: total,
                paymentMethod: paymentMethod
            });

            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cart-updated')); // Update navbar count
            setOrderPlaced(true);

            // Redirect after a short delay to show success message
            setTimeout(() => {
                router.push('/orders');
            }, 2000);
        } catch (err) {
            alert('Order failed: ' + (err.response?.data?.message || err.message));
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--success)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: 'white'
                }}>
                    <CheckCircle size={40} />
                </div>
                <h2 style={{ marginBottom: '10px' }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--gray-dark)' }}>Redirecting to your orders...</p>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <p>Please add items to your cart before checking out.</p>
                <Link href="/menu" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                    Go to Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link href="/cart" style={{ color: 'var(--dark)', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 style={{ margin: 0 }}>Checkout</h1>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '30px' }}>
                {/* Order Summary */}
                <div className="card">
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--gray)', paddingBottom: '10px' }}>Order Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: '600' }}>{item.quantity}x</span> {item.name}
                                </div>
                                <div>₹{item.price * item.quantity}</div>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid var(--gray)', paddingTop: '15px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary)' }}>₹{total}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="card">
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--gray)', paddingBottom: '10px' }}>Payment Method</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px',
                            border: `2px solid ${paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--gray)'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: paymentMethod === 'UPI' ? 'rgba(108, 92, 231, 0.05)' : 'transparent'
                        }}>
                            <input
                                type="radio"
                                name="payment"
                                value="UPI"
                                checked={paymentMethod === 'UPI'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                <QrCode size={24} color="var(--dark)" />
                                <span style={{ fontWeight: '600' }}>UPI / QR Code</span>
                            </div>
                        </label>

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px',
                            border: `2px solid ${paymentMethod === 'Card' ? 'var(--primary)' : 'var(--gray)'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: paymentMethod === 'Card' ? 'rgba(108, 92, 231, 0.05)' : 'transparent'
                        }}>
                            <input
                                type="radio"
                                name="payment"
                                value="Card"
                                checked={paymentMethod === 'Card'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                <CreditCard size={24} color="var(--dark)" />
                                <span style={{ fontWeight: '600' }}>Credit / Debit Card</span>
                            </div>
                        </label>

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px',
                            border: `2px solid ${paymentMethod === 'Cash' ? 'var(--primary)' : 'var(--gray)'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: paymentMethod === 'Cash' ? 'rgba(108, 92, 231, 0.05)' : 'transparent'
                        }}>
                            <input
                                type="radio"
                                name="payment"
                                value="Cash"
                                checked={paymentMethod === 'Cash'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                <Banknote size={24} color="var(--dark)" />
                                <span style={{ fontWeight: '600' }}>Cash on Delivery</span>
                            </div>
                        </label>
                    </div>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    className="btn btn-primary"
                    style={{
                        padding: '15px',
                        fontSize: '1.2rem',
                        borderRadius: '10px',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : `Pay ₹${total} & Place Order`}
                </button>
            </div>
        </div>
    );
}
