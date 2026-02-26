import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLightningBolt } from 'react-icons/hi';
import { RiCoinsFill } from 'react-icons/ri';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function DealsPage() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/products?deal=true&limit=20').then(r => { setDeals(r.data.products); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '64px' }}>
            {/* ═══════ PAGE HEADER ═══════ */}
            <section style={{ padding: '48px 24px 40px', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '32px' }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <Link to="/" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: '#374151', fontSize: '13px' }}>›</span>
                        <span style={{ fontSize: '13px', color: '#facc15', fontWeight: 500 }}>Deals</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>Hot Deals</h1>
                            <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '500px', lineHeight: 1.6 }}>
                                Grab the best discounts before they're gone. Use your coins for even bigger savings!
                            </p>
                        </div>
                        <div style={{
                            padding: '8px 16px', borderRadius: '12px',
                            background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.1)',
                        }}>
                            <span style={{ color: '#facc15', fontSize: '14px', fontWeight: 600 }}>{deals.length}</span>
                            <span style={{ color: '#6b7280', fontSize: '13px', marginLeft: '4px' }}>deals</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                {/* ═══════ PROMO BANNER ═══════ */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{
                        borderRadius: '20px', padding: '40px 32px', marginBottom: '40px',
                        background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden',
                    }}
                >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,58,237,0.08), transparent, rgba(234,179,8,0.04))' }} />
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '200px', height: '200px', background: 'rgba(234,179,8,0.06)', borderRadius: '50%', filter: 'blur(60px)' }} />
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <HiLightningBolt style={{ color: '#facc15', fontSize: '20px' }} />
                            <span style={{ color: '#facc15', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Limited Time Offers</span>
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Save Big with Coin Discounts</h2>
                        <p style={{ color: '#9ca3af', fontSize: '14px', maxWidth: '480px', lineHeight: 1.6 }}>
                            All deal items support extra coin discounts. The more coins you use, the lower the price!
                        </p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.12)' }}>
                            <RiCoinsFill style={{ color: '#facc15', fontSize: '14px' }} />
                            <span style={{ color: '#fde68a', fontSize: '13px', fontWeight: 500 }}>Extra coin discounts on all deal items</span>
                        </div>
                    </div>
                </motion.div>

                {/* ═══════ DEALS GRID ═══════ */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{ background: '#13131a', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <div style={{ aspectRatio: '1/1', background: '#1a1a25' }} className="shimmer" />
                                <div style={{ padding: '20px' }}>
                                    <div style={{ height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', width: '60px', marginBottom: '10px' }} className="shimmer" />
                                    <div style={{ height: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', width: '100%', marginBottom: '10px' }} className="shimmer" />
                                    <div style={{ height: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', width: '100px' }} className="shimmer" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : deals.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</p>
                        <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>No deals available right now</p>
                        <p style={{ color: '#4b5563', fontSize: '14px' }}>Check back soon for hot new offers!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                        {deals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
