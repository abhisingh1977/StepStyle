import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiAdjustments, HiSortDescending, HiSearch, HiShoppingBag } from 'react-icons/hi';
import { RiCoinsFill } from 'react-icons/ri';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';

const categoryLabels = { men: 'Men', women: 'Women', electronics: 'Electronics', beauty: 'Beauty', shoes: 'Shoes' };
const categoryDescriptions = {
    men: 'Premium menswear curated for the modern athlete. Earn coins with every step.',
    women: 'Activewear and fashion designed for women who move. Style meets performance.',
    electronics: 'Smart gadgets and fitness tech to track, train, and transform.',
    beauty: 'Post-workout skincare and recovery essentials for your glow-up.',
    shoes: 'Walking, running, and lifestyle shoes built for every step of your journey.',
};

export default function ShopPage() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('');
    const [priceRange, setPriceRange] = useState([0, 20000]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (sort) params.set('sort', sort);
        if (priceRange[0] > 0) params.set('minPrice', priceRange[0]);
        if (priceRange[1] < 20000) params.set('maxPrice', priceRange[1]);
        API.get(`/products?${params.toString()}`).then(r => { setProducts(r.data.products); setLoading(false); }).catch(() => setLoading(false));
    }, [category, sort, priceRange]);

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '64px' }}>
            {/* ═══════ SHOP HERO / HEADER ═══════ */}
            <section style={{
                padding: '48px 24px 40px',
                maxWidth: '1280px', margin: '0 auto',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                marginBottom: '32px',
            }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <Link to="/" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: '#374151', fontSize: '13px' }}>›</span>
                        <Link to={`/shop/${category}`} style={{ fontSize: '13px', color: '#a78bfa', textDecoration: 'none', fontWeight: 500 }}>
                            {categoryLabels[category] || 'All'}
                        </Link>
                    </div>

                    {/* Title + Count */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                {categoryLabels[category] || 'All Products'}
                            </h1>
                            <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '500px', lineHeight: 1.6 }}>
                                {categoryDescriptions[category] || 'Browse our curated collection of premium products.'}
                            </p>
                        </div>
                        <div style={{
                            padding: '8px 16px', borderRadius: '12px',
                            background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)',
                        }}>
                            <span style={{ color: '#a78bfa', fontSize: '14px', fontWeight: 600 }}>{products.length}</span>
                            <span style={{ color: '#6b7280', fontSize: '13px', marginLeft: '4px' }}>products</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                {/* ═══════ TOOLBAR ═══════ */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 500,
                            color: showFilters ? '#a78bfa' : '#d1d5db', cursor: 'pointer',
                            background: showFilters ? 'rgba(124,58,237,0.08)' : 'rgba(19,19,26,0.7)',
                            border: showFilters ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <HiAdjustments style={{ fontSize: '16px' }} /> Filters
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HiSortDescending style={{ color: '#6b7280', fontSize: '16px' }} />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            style={{
                                background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px', padding: '10px 16px', fontSize: '13px', color: '#d1d5db',
                                outline: 'none', cursor: 'pointer', backdropFilter: 'blur(20px)',
                            }}
                        >
                            <option value="" style={{ background: '#13131a' }}>Newest</option>
                            <option value="price_asc" style={{ background: '#13131a' }}>Price: Low → High</option>
                            <option value="price_desc" style={{ background: '#13131a' }}>Price: High → Low</option>
                            <option value="rating" style={{ background: '#13131a' }}>Top Rated</option>
                            <option value="discount" style={{ background: '#13131a' }}>Best Discount</option>
                        </select>
                    </div>
                </div>

                {/* ═══════ FILTERS PANEL ═══════ */}
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{
                            borderRadius: '16px', padding: '24px', marginBottom: '32px',
                            background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(124,58,237,0.1)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Range</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input
                                        type="number" value={priceRange[0]}
                                        onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                                        placeholder="Min"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#fff', outline: 'none' }}
                                    />
                                    <span style={{ color: '#4b5563' }}>—</span>
                                    <input
                                        type="number" value={priceRange[1]}
                                        onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                                        placeholder="Max"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ═══════ PRODUCTS GRID ═══════ */}
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
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</p>
                        <p style={{ color: '#6b7280', fontSize: '16px' }}>No products found in this category</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                        {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
