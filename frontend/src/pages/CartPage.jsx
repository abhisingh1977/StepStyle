import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiTrash, HiPlus, HiMinus, HiShoppingBag, HiArrowRight, HiArrowLeft, HiCheck, HiLocationMarker } from 'react-icons/hi';
import { RiCoinsFill, RiBankCardFill, RiQrCodeLine, RiSmartphoneLine, RiBankLine } from 'react-icons/ri';
import ReactConfetti from 'react-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const STEPS = ['Cart', 'Address', 'Payment'];

const paymentMethods = [
    { id: 'gpay', name: 'Google Pay', icon: '💳', desc: 'Pay instantly with GPay UPI', color: '#4285F4' },
    { id: 'phonepe', name: 'PhonePe', icon: '📱', desc: 'PhonePe UPI payment', color: '#5f259f' },
    { id: 'upi', name: 'UPI ID', icon: '🏦', desc: 'Enter your UPI ID', color: '#00897B' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏛️', desc: 'All major banks supported', color: '#1565C0' },
    { id: 'card', name: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Rupay', color: '#E65100' },
    { id: 'qr', name: 'Scan QR Code', icon: '📷', desc: 'Scan and pay with any UPI app', color: '#2E7D32' },
];

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, total, totalItems } = useCart();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [coinsToUse, setCoinsToUse] = useState(0);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(0); // 0=Cart, 1=Address, 2=Payment
    const [selectedPayment, setSelectedPayment] = useState('');
    const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '' });

    const maxCoins = Math.min(user?.coins || 0, Math.floor(total));
    const finalTotal = Math.max(0, Math.round(total - coinsToUse));

    const handleCheckout = async () => {
        if (!user) return navigate('/login');
        if (!selectedPayment) return;
        setProcessing(true);
        try {
            const items = cart.map(item => ({
                product: item._id, name: item.name, image: item.images?.[0],
                price: Math.round(item.price * (1 - (item.discountPercent || 0) / 100)),
                quantity: item.quantity,
            }));
            await API.post('/orders', { items, subtotal: Math.round(total), coinsUsed: coinsToUse, paymentMethod: selectedPayment, shippingAddress: address });
            updateUser({ coins: (user.coins || 0) - coinsToUse });
            clearCart();
            setOrderSuccess(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Checkout failed');
        }
        setProcessing(false);
    };

    const isAddressValid = address.name && address.phone && address.street && address.city && address.state && address.pincode;

    // ═══════ ORDER SUCCESS ═══════
    if (orderSuccess) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
                <ReactConfetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} colors={['#7c3aed', '#39ff14', '#fbbf24', '#a78bfa']} />
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }} style={{ textAlign: 'center' }}>
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.3 }} style={{ fontSize: '72px', marginBottom: '24px' }}>🎉</motion.div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Order Confirmed!</h1>
                    <p style={{ color: '#9ca3af', marginBottom: '8px' }}>Payment via {paymentMethods.find(m => m.id === selectedPayment)?.name || 'Razorpay'}</p>
                    {coinsToUse > 0 && <p style={{ color: '#fde68a', fontSize: '14px', marginBottom: '24px' }}>🪙 {coinsToUse} coins redeemed</p>}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
                        <Link to="/orders" style={{ textDecoration: 'none' }}>
                            <button style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(to right, #7c3aed, #6d28d9)', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '14px' }}>View Orders</button>
                        </Link>
                        <Link to="/shop/men" style={{ textDecoration: 'none' }}>
                            <button style={{ padding: '12px 28px', borderRadius: '12px', background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Continue Shopping</button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ═══════ EMPTY CART ═══════
    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', padding: '80px 40px', borderRadius: '20px', background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', maxWidth: '420px', width: '100%' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <HiShoppingBag style={{ fontSize: '32px', color: '#6b7280' }} />
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Your cart is empty</h2>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Looks like you haven't added anything yet</p>
                    <Link to="/shop/men" style={{ textDecoration: 'none' }}>
                        <button style={{ padding: '14px 36px', borderRadius: '12px', background: 'linear-gradient(to right, #7c3aed, #6d28d9)', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '14px', boxShadow: '0 8px 24px rgba(124,58,237,0.2)' }}>Start Shopping</button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    // ═══════ CART WITH ITEMS ═══════
    return (
        <div style={{ minHeight: '100vh', paddingBottom: '64px' }}>
            {/* Page Header */}
            <section style={{ padding: '48px 24px 32px', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '40px' }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <Link to="/" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: '#374151', fontSize: '13px' }}>›</span>
                        <span style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 500 }}>Checkout</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '24px' }}>Checkout</h1>

                    {/* ──── STEP INDICATOR ──── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0', maxWidth: '500px' }}>
                        {STEPS.map((s, i) => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: i < step ? 'pointer' : 'default' }}
                                    onClick={() => { if (i < step) setStep(i); }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '13px', fontWeight: 700, flexShrink: 0,
                                        background: i <= step ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.04)',
                                        color: i <= step ? '#fff' : '#6b7280',
                                        border: i === step ? '2px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.06)',
                                        boxShadow: i === step ? '0 0 16px rgba(124,58,237,0.3)' : 'none',
                                    }}>
                                        {i < step ? <HiCheck style={{ fontSize: '14px' }} /> : i + 1}
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: i === step ? 600 : 400, color: i <= step ? '#fff' : '#6b7280', whiteSpace: 'nowrap' }}>{s}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ flex: 1, height: '2px', margin: '0 12px', background: i < step ? '#7c3aed' : 'rgba(255,255,255,0.06)', borderRadius: '2px', transition: 'background 0.3s' }} />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>

                    {/* ═══════ LEFT PANEL (changes per step) ═══════ */}
                    <div>
                        <AnimatePresence mode="wait">
                            {/* ──── STEP 0: CART REVIEW ──── */}
                            {step === 0 && (
                                <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {cart.map((item) => {
                                        const discounted = Math.round(item.price * (1 - (item.discountPercent || 0) / 100));
                                        return (
                                            <div key={item._id} style={{
                                                display: 'flex', gap: '20px', padding: '24px', borderRadius: '20px',
                                                background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
                                            }}>
                                                <div style={{ width: '120px', height: '120px', borderRadius: '14px', overflow: 'hidden', background: '#1a1a25', flexShrink: 0 }}>
                                                    <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{item.brand}</p>
                                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h3>
                                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>₹{discounted.toLocaleString()}</span>
                                                            {item.discountPercent > 0 && <span style={{ fontSize: '13px', color: '#4b5563', textDecoration: 'line-through' }}>₹{item.price.toLocaleString()}</span>}
                                                            {item.discountPercent > 0 && <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600 }}>-{item.discountPercent}%</span>}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#d1d5db', cursor: 'pointer' }}>
                                                                <HiMinus style={{ fontSize: '14px' }} />
                                                            </button>
                                                            <span style={{ width: '40px', textAlign: 'center', color: '#fff', fontWeight: 600, fontSize: '15px' }}>{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#d1d5db', cursor: 'pointer' }}>
                                                                <HiPlus style={{ fontSize: '14px' }} />
                                                            </button>
                                                        </div>
                                                        <button onClick={() => removeFromCart(item._id)}
                                                            style={{ padding: '8px', borderRadius: '10px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px' }}
                                                            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                                                            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                                                            <HiTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}

                            {/* ──── STEP 1: ADDRESS ──── */}
                            {step === 1 && (
                                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        borderRadius: '20px', padding: '32px',
                                        background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                                        <HiLocationMarker style={{ color: '#a78bfa', fontSize: '20px' }} />
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Delivery Address</h3>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        {[
                                            { key: 'name', label: 'Full Name', placeholder: 'John Doe', full: false },
                                            { key: 'phone', label: 'Phone Number', placeholder: '9876543210', full: false },
                                            { key: 'street', label: 'Street Address', placeholder: '123, MG Road, Apt 4B', full: true },
                                            { key: 'city', label: 'City', placeholder: 'Mumbai', full: false },
                                            { key: 'state', label: 'State', placeholder: 'Maharashtra', full: false },
                                            { key: 'pincode', label: 'Pincode', placeholder: '400001', full: false },
                                        ].map(f => (
                                            <div key={f.key} style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                                                <input
                                                    type="text" value={address[f.key]} placeholder={f.placeholder}
                                                    onChange={e => setAddress({ ...address, [f.key]: e.target.value })}
                                                    style={{
                                                        width: '100%', padding: '14px 16px', borderRadius: '12px', fontSize: '14px', color: '#fff',
                                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                                        outline: 'none', transition: 'border-color 0.2s',
                                                    }}
                                                    onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.3)'}
                                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* ──── STEP 2: PAYMENT ──── */}
                            {step === 2 && (
                                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        borderRadius: '20px', padding: '32px',
                                        background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                                        <RiBankCardFill style={{ color: '#4ade80', fontSize: '20px' }} />
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Select Payment Method</h3>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {paymentMethods.map(method => {
                                            const isSelected = selectedPayment === method.id;
                                            return (
                                                <div key={method.id} onClick={() => setSelectedPayment(method.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', borderRadius: '14px',
                                                        cursor: 'pointer', transition: 'all 0.2s',
                                                        background: isSelected ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
                                                        border: isSelected ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.04)',
                                                        boxShadow: isSelected ? '0 0 20px rgba(124,58,237,0.08)' : 'none',
                                                    }}>
                                                    {/* Radio */}
                                                    <div style={{
                                                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                                        border: isSelected ? '2px solid #7c3aed' : '2px solid rgba(255,255,255,0.12)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7c3aed' }} />}
                                                    </div>
                                                    {/* Icon */}
                                                    <div style={{
                                                        width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: `${method.color}15`, fontSize: '22px', flexShrink: 0,
                                                    }}>
                                                        {method.icon}
                                                    </div>
                                                    {/* Info */}
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>{method.name}</p>
                                                        <p style={{ color: '#6b7280', fontSize: '12px' }}>{method.desc}</p>
                                                    </div>
                                                    {isSelected && <HiCheck style={{ color: '#7c3aed', fontSize: '18px', flexShrink: 0 }} />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ═══════ ORDER SUMMARY (always visible) ═══════ */}
                    <div style={{ position: 'sticky', top: '88px' }}>
                        <div style={{
                            borderRadius: '20px', padding: '28px',
                            background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>Order Summary</h3>

                            {/* Mini items list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                {cart.map(item => {
                                    const dp = Math.round(item.price * (1 - (item.discountPercent || 0) / 100));
                                    return (
                                        <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#1a1a25', flexShrink: 0 }}>
                                                <img src={item.images?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: '13px', color: '#d1d5db', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                                <p style={{ fontSize: '11px', color: '#6b7280' }}>Qty: {item.quantity}</p>
                                            </div>
                                            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600, flexShrink: 0 }}>₹{(dp * item.quantity).toLocaleString()}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Totals */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#9ca3af' }}>Subtotal</span>
                                    <span style={{ color: '#fff', fontWeight: 500 }}>₹{Math.round(total).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#9ca3af' }}>Shipping</span>
                                    <span style={{ color: '#4ade80', fontWeight: 500 }}>Free</span>
                                </div>
                            </div>

                            {/* Coin Slider (only on step 0) */}
                            {user && step === 0 && (
                                <div style={{ padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <RiCoinsFill style={{ color: '#facc15', fontSize: '14px' }} />
                                            <span style={{ fontSize: '13px', color: '#d1d5db', fontWeight: 500 }}>Apply Coins</span>
                                        </div>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{user.coins?.toLocaleString()} available</span>
                                    </div>
                                    <input type="range" min={0} max={maxCoins} value={coinsToUse} onChange={e => setCoinsToUse(+e.target.value)}
                                        style={{ width: '100%', height: '6px', borderRadius: '9999px', appearance: 'none', background: `linear-gradient(to right, #7c3aed ${(coinsToUse / (maxCoins || 1)) * 100}%, rgba(255,255,255,0.06) ${(coinsToUse / (maxCoins || 1)) * 100}%)`, cursor: 'pointer', outline: 'none' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                        <span style={{ fontSize: '12px', color: '#fde68a' }}>{coinsToUse} coins = ₹{coinsToUse} off</span>
                                        <button onClick={() => setCoinsToUse(maxCoins)} style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Use Max</button>
                                    </div>
                                </div>
                            )}

                            {/* Coins applied indicator (steps 1-2) */}
                            {coinsToUse > 0 && step > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <RiCoinsFill style={{ color: '#facc15', fontSize: '12px' }} />
                                        <span style={{ color: '#fde68a' }}>Coins Applied</span>
                                    </div>
                                    <span style={{ color: '#4ade80', fontWeight: 600 }}>-₹{coinsToUse}</span>
                                </div>
                            )}

                            {/* Total */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.04)', marginBottom: '20px' }}>
                                <span style={{ color: '#9ca3af', fontWeight: 500, fontSize: '14px' }}>Total</span>
                                <span style={{ fontSize: '26px', fontWeight: 900, color: '#fff' }}>₹{finalTotal.toLocaleString()}</span>
                            </div>

                            {/* Navigation Buttons */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {step > 0 && (
                                    <button onClick={() => setStep(step - 1)}
                                        style={{ flex: '0 0 auto', padding: '14px 18px', borderRadius: '14px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#d1d5db' }}>
                                        <HiArrowLeft style={{ fontSize: '16px' }} /> Back
                                    </button>
                                )}
                                {step < 2 ? (
                                    <button
                                        onClick={() => {
                                            if (step === 0) { if (!user) return navigate('/login'); setStep(1); }
                                            else if (step === 1 && isAddressValid) setStep(2);
                                        }}
                                        disabled={step === 1 && !isAddressValid}
                                        style={{
                                            flex: 1, padding: '16px', borderRadius: '14px', border: 'none', cursor: step === 1 && !isAddressValid ? 'not-allowed' : 'pointer',
                                            background: step === 1 && !isAddressValid ? '#374151' : 'linear-gradient(to right, #7c3aed, #6d28d9)', color: '#fff',
                                            fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            boxShadow: step === 1 && !isAddressValid ? 'none' : '0 8px 24px rgba(124,58,237,0.2)',
                                            opacity: step === 1 && !isAddressValid ? 0.5 : 1,
                                        }}>
                                        {step === 0 ? 'Proceed to Address' : 'Proceed to Payment'} <HiArrowRight style={{ fontSize: '16px' }} />
                                    </button>
                                ) : (
                                    <button onClick={handleCheckout} disabled={processing || !selectedPayment}
                                        style={{
                                            flex: 1, padding: '16px', borderRadius: '14px', border: 'none',
                                            cursor: processing || !selectedPayment ? 'not-allowed' : 'pointer',
                                            background: !selectedPayment ? '#374151' : 'linear-gradient(to right, #22c55e, #16a34a)', color: '#fff',
                                            fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            boxShadow: !selectedPayment ? 'none' : '0 8px 24px rgba(34,197,94,0.2)',
                                            opacity: processing || !selectedPayment ? 0.5 : 1,
                                        }}>
                                        {processing ? 'Processing...' : <>Place Order — ₹{finalTotal.toLocaleString()} <HiCheck style={{ fontSize: '16px' }} /></>}
                                    </button>
                                )}
                            </div>

                            <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '12px', marginTop: '12px' }}>🔒 Secure checkout • SSL encrypted</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
