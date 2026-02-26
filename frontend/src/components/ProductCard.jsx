import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingBag, HiHeart, HiOutlineHeart, HiStar } from 'react-icons/hi';
import { RiCoinsFill } from 'react-icons/ri';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, index = 0 }) {
    const [isWished, setIsWished] = useState(false);
    const [added, setAdded] = useState(false);
    const cardRef = useRef(null);
    const { addToCart } = useCart();

    const discountedPrice = Math.round(product.price * (1 - product.discountPercent / 100));
    const maxCoinSave = Math.min(product.maxCoinsUsable, discountedPrice);
    const finalPrice = discountedPrice - maxCoinSave;

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (card) {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.borderColor = 'rgba(255,255,255,0.04)';
            card.style.boxShadow = 'none';
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.12)'; }}
                    style={{
                        background: '#13131a', borderRadius: '20px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.12s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                    className="group"
                >
                    {/* Image */}
                    <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#1a1a25' }}>
                        <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            loading="lazy"
                            className="group-hover:scale-110"
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(19,19,26,0.7), transparent 50%)', pointerEvents: 'none' }} />

                        {/* Discount Badge */}
                        {product.discountPercent > 0 && (
                            <div style={{
                                position: 'absolute', top: '12px', left: '12px',
                                padding: '5px 10px', borderRadius: '8px',
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                color: '#fff', fontSize: '12px', fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                            }}>
                                -{product.discountPercent}%
                            </div>
                        )}

                        {/* Wishlist */}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsWished(!isWished); }}
                            style={{
                                position: 'absolute', top: '12px', right: '12px',
                                width: '36px', height: '36px', borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(19,19,26,0.6)', backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer', opacity: 0, transition: 'opacity 0.3s',
                            }}
                            className="group-hover:!opacity-100"
                        >
                            {isWished ? <HiHeart style={{ color: '#ef4444', fontSize: '16px' }} /> : <HiOutlineHeart style={{ color: '#fff', fontSize: '16px' }} />}
                        </button>

                        {/* Quick Add Button — bottom of image */}
                        <button
                            onClick={handleAdd}
                            style={{
                                position: 'absolute', bottom: '12px', right: '12px',
                                padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '12px', fontWeight: 600,
                                background: added ? '#22c55e' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                color: '#fff', opacity: 0, transition: 'opacity 0.3s',
                                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                            }}
                            className="group-hover:!opacity-100"
                        >
                            <HiShoppingBag style={{ fontSize: '14px' }} />
                            {added ? 'Added!' : 'Add to Cart'}
                        </button>
                    </div>

                    {/* Product Info */}
                    <div style={{ padding: '20px' }}>
                        {/* Brand */}
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                            {product.brand}
                        </p>

                        {/* Name */}
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '12px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.name}
                        </h3>

                        {/* Rating */}
                        {product.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                                <HiStar style={{ color: '#facc15', fontSize: '14px' }} />
                                <span style={{ color: '#fde68a', fontSize: '12px', fontWeight: 600 }}>{product.rating}</span>
                                <span style={{ color: '#4b5563', fontSize: '11px' }}>({product.reviewCount})</span>
                            </div>
                        )}

                        {/* Price Row */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>₹{discountedPrice.toLocaleString()}</span>
                            {product.discountPercent > 0 && (
                                <span style={{ fontSize: '13px', color: '#4b5563', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Coins Row */}
                        {product.maxCoinsUsable > 0 && (
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 12px', borderRadius: '10px',
                                background: 'rgba(234,179,8,0.04)',
                                border: '1px solid rgba(234,179,8,0.08)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <RiCoinsFill style={{ color: '#facc15', fontSize: '14px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '12px', color: '#fde68a' }}>
                                        Use up to <strong>{product.maxCoinsUsable}</strong> coins
                                    </span>
                                </div>
                                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, flexShrink: 0 }}>
                                    → ₹{finalPrice.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
