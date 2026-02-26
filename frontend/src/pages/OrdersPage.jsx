import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingBag, HiClock } from 'react-icons/hi';
import { RiCoinsFill } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const statusConfig = {
    processing: { color: '#facc15', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.15)' },
    shipped: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.15)' },
    delivered: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.15)' },
    cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' },
};

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            API.get('/orders/my').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
        }
    }, [user]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '32px', height: '32px', border: '2px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '64px' }}>
            {/* ═══════ PAGE HEADER ═══════ */}
            <section style={{ padding: '48px 24px 40px', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '40px' }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <Link to="/" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: '#374151', fontSize: '13px' }}>›</span>
                        <span style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 500 }}>My Orders</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>My Orders</h1>
                            <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '500px', lineHeight: 1.6 }}>
                                Track your purchases and order history. All your StepStyle orders in one place.
                            </p>
                        </div>
                        <div style={{
                            padding: '8px 16px', borderRadius: '12px',
                            background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)',
                        }}>
                            <span style={{ color: '#a78bfa', fontSize: '14px', fontWeight: 600 }}>{orders.length}</span>
                            <span style={{ color: '#6b7280', fontSize: '13px', marginLeft: '4px' }}>orders</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                {orders.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                            textAlign: 'center', padding: '80px 24px', borderRadius: '20px',
                            background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <HiShoppingBag style={{ fontSize: '32px', color: '#6b7280' }} />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No orders yet</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>Start shopping to see your orders here</p>
                        <Link to="/shop/men" style={{
                            display: 'inline-block', padding: '12px 32px', borderRadius: '12px',
                            background: 'linear-gradient(to right, #7c3aed, #6d28d9)',
                            color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                            boxShadow: '0 8px 24px rgba(124,58,237,0.2)',
                        }}>
                            Browse Shop
                        </Link>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map((order, i) => {
                            const status = statusConfig[order.status] || statusConfig.processing;
                            return (
                                <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                    style={{
                                        borderRadius: '20px', padding: '28px',
                                        background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)',
                                        backdropFilter: 'blur(20px)',
                                    }}
                                >
                                    {/* Order Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, letterSpacing: '0.04em' }}>
                                                ORDER #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                                <HiClock style={{ fontSize: '13px' }} />
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span style={{
                                            padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                                            textTransform: 'capitalize', color: status.color, background: status.bg,
                                            border: `1px solid ${status.border}`,
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* Order Items */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                        {order.items?.map((item, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{
                                                    width: '52px', height: '52px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0,
                                                    background: '#1a1a25',
                                                }}>
                                                    {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                                    <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                                                </div>
                                                <p style={{ color: '#d1d5db', fontSize: '14px', fontWeight: 600, flexShrink: 0 }}>
                                                    ₹{(item.quantity * item.price)?.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {order.coinsUsed > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.1)' }}>
                                                    <RiCoinsFill style={{ color: '#facc15', fontSize: '12px' }} />
                                                    <span style={{ color: '#fde68a', fontSize: '12px', fontWeight: 500 }}>{order.coinsUsed} coins used</span>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '2px' }}>Total</p>
                                            <p style={{ color: '#fff', fontSize: '20px', fontWeight: 800 }}>₹{order.totalAmount?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
