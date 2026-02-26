import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingBag, HiHeart, HiOutlineHeart, HiStar, HiArrowLeft } from 'react-icons/hi';
import { RiCoinsFill } from 'react-icons/ri';
import { useCart } from '../context/CartContext';
import API from '../utils/api';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWished, setIsWished] = useState(false);
    const [added, setAdded] = useState(false);
    const [coinSlider, setCoinSlider] = useState(0);
    const { addToCart } = useCart();

    useEffect(() => {
        API.get(`/products/${id}`).then(r => { setProduct(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '32px', height: '32px', border: '2px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>😕</p>
                    <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '24px' }}>Product not found</p>
                    <Link to="/shop/men" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 500 }}>← Back to shop</Link>
                </div>
            </div>
        );
    }

    const discountedPrice = Math.round(product.price * (1 - product.discountPercent / 100));
    const finalPrice = Math.max(0, discountedPrice - coinSlider);
    const savings = product.price - discountedPrice;

    const handleAdd = () => { addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 2000); };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '64px' }}>
            {/* ═══════ PAGE HEADER ═══════ */}
            <section style={{ padding: '48px 24px 32px', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '48px' }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Link to="/shop/men" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: '#374151', fontSize: '13px' }}>›</span>
                        <Link to={`/shop/${product.category}`} style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>
                            {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Shop'}
                        </Link>
                        <span style={{ color: '#374151', fontSize: '13px' }}>›</span>
                        <span style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
                    </div>
                    <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <HiArrowLeft style={{ fontSize: '14px' }} /> Back to results
                    </button>
                </motion.div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'start' }}>

                    {/* ═══════ PRODUCT IMAGE ═══════ */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'relative' }}>
                        <div style={{
                            aspectRatio: '1/1', borderRadius: '24px', overflow: 'hidden',
                            background: '#13131a', border: '1px solid rgba(255,255,255,0.04)',
                            position: 'relative',
                        }}>
                            <img
                                src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {/* Discount Badge */}
                            {product.discountPercent > 0 && (
                                <div style={{
                                    position: 'absolute', top: '16px', left: '16px',
                                    padding: '6px 14px', borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    color: '#fff', fontSize: '13px', fontWeight: 700,
                                    boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
                                }}>
                                    -{product.discountPercent}% OFF
                                </div>
                            )}

                            {/* Wishlist */}
                            <button onClick={() => setIsWished(!isWished)} style={{
                                position: 'absolute', top: '16px', right: '16px',
                                width: '44px', height: '44px', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(19,19,26,0.6)', backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer', transition: 'transform 0.2s',
                            }}>
                                {isWished ? <HiHeart style={{ color: '#ef4444', fontSize: '20px' }} /> : <HiOutlineHeart style={{ color: '#fff', fontSize: '20px' }} />}
                            </button>
                        </div>
                    </motion.div>

                    {/* ═══════ PRODUCT DETAILS ═══════ */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>

                        {/* Brand */}
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{product.brand}</p>

                        {/* Name */}
                        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>{product.name}</h1>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <HiStar key={i} style={{ fontSize: '18px', color: i < Math.round(product.rating) ? '#facc15' : '#374151' }} />
                                ))}
                            </div>
                            <span style={{ fontSize: '14px', color: '#facc15', fontWeight: 600 }}>{product.rating}</span>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>({product.reviewCount} reviews)</span>
                        </div>

                        {/* ──── PRICE CARD ──── */}
                        <div style={{
                            borderRadius: '20px', padding: '28px',
                            background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)',
                            backdropFilter: 'blur(20px)', marginBottom: '28px',
                        }}>
                            {/* Main Price */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '36px', fontWeight: 900, color: '#fff' }}>₹{discountedPrice.toLocaleString()}</span>
                                {product.discountPercent > 0 && (
                                    <span style={{ fontSize: '18px', color: '#4b5563', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>
                                )}
                            </div>
                            {product.discountPercent > 0 && (
                                <p style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600, marginBottom: '16px' }}>
                                    You save ₹{savings.toLocaleString()} ({product.discountPercent}% off)
                                </p>
                            )}

                            {/* Coin Slider */}
                            {product.maxCoinsUsable > 0 && (
                                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <RiCoinsFill style={{ color: '#facc15', fontSize: '16px' }} />
                                            <span style={{ fontSize: '14px', color: '#d1d5db', fontWeight: 500 }}>Apply Coins</span>
                                        </div>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Max: {product.maxCoinsUsable}</span>
                                    </div>
                                    <input
                                        type="range" min={0} max={product.maxCoinsUsable} value={coinSlider}
                                        onChange={e => setCoinSlider(+e.target.value)}
                                        style={{
                                            width: '100%', height: '6px', borderRadius: '9999px', appearance: 'none',
                                            background: `linear-gradient(to right, #facc15 ${(coinSlider / product.maxCoinsUsable) * 100}%, rgba(255,255,255,0.06) ${(coinSlider / product.maxCoinsUsable) * 100}%)`,
                                            cursor: 'pointer', outline: 'none',
                                        }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'baseline' }}>
                                        <span style={{ fontSize: '13px', color: '#fde68a' }}>{coinSlider} coins = ₹{coinSlider} off</span>
                                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Final: ₹{finalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.8, marginBottom: '28px' }}>{product.description}</p>

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                                {product.tags.map((tag, i) => (
                                    <span key={i} style={{
                                        padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500,
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                        color: '#9ca3af',
                                    }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button onClick={handleAdd}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                fontSize: '16px', fontWeight: 700,
                                background: added ? 'linear-gradient(to right, #22c55e, #16a34a)' : 'linear-gradient(to right, #7c3aed, #6d28d9)',
                                color: '#fff',
                                boxShadow: added ? '0 8px 24px rgba(34,197,94,0.2)' : '0 8px 24px rgba(124,58,237,0.25)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <HiShoppingBag style={{ fontSize: '20px' }} />
                            {added ? 'Added to Cart!' : 'Add to Cart'}
                        </button>

                        {/* Info Bar */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
                            {['Free Shipping', 'Easy Returns', 'Secure Payment'].map((info, i) => (
                                <span key={i} style={{ fontSize: '12px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ color: '#4ade80' }}>✓</span> {info}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
