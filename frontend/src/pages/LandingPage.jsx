import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RiCoinsFill, RiFootprintFill, RiShoppingBag3Fill, RiArrowRightLine, RiStarFill } from 'react-icons/ri';
import { HiSparkles, HiTrendingUp } from 'react-icons/hi';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';

gsap.registerPlugin(ScrollTrigger);

const levels = [
    { level: 1, name: 'Starter', steps: '0 – 10K', color: 'from-gray-500 to-gray-600', coins: 50 },
    { level: 2, name: 'Walker', steps: '10K – 50K', color: 'from-blue-500 to-blue-600', coins: 150 },
    { level: 3, name: 'Runner', steps: '50K – 150K', color: 'from-purple-500 to-purple-600', coins: 400 },
    { level: 4, name: 'Athlete', steps: '150K – 500K', color: 'from-yellow-500 to-orange-500', coins: 800 },
    { level: 5, name: 'Legend', steps: '500K+', color: 'from-green-400 to-emerald-500', coins: 2000 },
];

export default function LandingPage() {
    const heroRef = useRef(null);
    const [trending, setTrending] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        API.get('/products?trending=true&limit=6').then(r => setTrending(r.data.products)).catch(() => { });
        API.get('/products?newArrival=true&limit=8').then(r => setNewArrivals(r.data.products)).catch(() => { });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.hero-bg', {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div style={{ overflowX: 'hidden' }}>
            {/* ═══════════ HERO SECTION ═══════════ */}
            <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div className="hero-bg" style={{ position: 'absolute', inset: 0 }}>
                    <img src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&q=80" alt="Runner" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.7), rgba(10,10,15,0.8), #0a0a0f)' }} />
                </div>

                {/* Floating Coins — very subtle background */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
                    {[
                        { top: '10%', left: '5%', size: 28 },
                        { top: '20%', right: '8%', size: 22 },
                        { top: '65%', left: '12%', size: 32 },
                        { top: '75%', right: '6%', size: 26 },
                    ].map((c, i) => (
                        <motion.div key={i} style={{ position: 'absolute', opacity: 0.1, top: c.top, left: c.left, right: c.right }}
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}>
                            <div style={{ width: c.size, height: c.size, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i % 2 === 0 ? 'rgba(234,179,8,0.5)' : 'rgba(124,58,237,0.5)' }}>
                                <RiCoinsFill style={{ color: '#fff', fontSize: c.size * 0.5 }} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Hero Content */}
                <div style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '9999px', marginBottom: '32px' }}>
                        <HiSparkles style={{ color: '#facc15' }} />
                        <span style={{ fontSize: '14px', color: '#d1d5db', fontWeight: 500 }}>Gamified Shopping Experience</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '32px' }}>
                        <span style={{ display: 'block', background: 'linear-gradient(to right, #fff, #e9d5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Walk More.</span>
                        <span style={{ display: 'block', background: 'linear-gradient(to right, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earn More.</span>
                        <span style={{ display: 'block', background: 'linear-gradient(to right, #4ade80, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shop Smarter.</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
                        style={{ fontSize: '18px', color: '#9ca3af', maxWidth: '560px', margin: '0 auto 48px', lineHeight: 1.7 }}>
                        Every step you take earns you coins. Redeem them for real discounts on premium products. Your fitness journey just became your shopping advantage.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '64px' }}>
                        <Link to="/login">
                            <button style={{ minWidth: '220px', padding: '18px 48px', borderRadius: '16px', background: 'linear-gradient(to right, #7c3aed, #6d28d9)', color: '#fff', fontWeight: 700, fontSize: '18px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(124,58,237,0.25)' }}>
                                Get Started <RiArrowRightLine style={{ fontSize: '20px' }} />
                            </button>
                        </Link>
                        <Link to="/login">
                            <button className="glass" style={{ minWidth: '220px', padding: '18px 48px', borderRadius: '16px', color: '#fff', fontWeight: 700, fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <RiCoinsFill style={{ color: '#facc15', fontSize: '20px' }} /> Rewards
                            </button>
                        </Link>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
                        style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
                        {[{ n: '50K+', l: 'Steps Tracked' }, { n: '10K+', l: 'Coins Earned' }, { n: '500+', l: 'Products' }].map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{s.n}</p>
                                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{s.l}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '128px', background: 'linear-gradient(to top, #0a0a0f, transparent)', zIndex: 6 }} />
            </section>

            {/* ═══════════ TRENDING ═══════════ */}
            {trending.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 24px 60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <HiTrendingUp style={{ color: '#a78bfa' }} />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trending</span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#fff' }}>Popular Right Now</h2>
                        </div>
                        <Link to="/shop/men" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#a78bfa', fontWeight: 500, textDecoration: 'none' }}>
                            View All <RiArrowRightLine />
                        </Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                        {trending.slice(0, 6).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                    </div>
                </motion.section>
            )}

            {/* ═══════════ NEW ARRIVALS (GRID — same size as Trending) ═══════════ */}
            {newArrivals.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                    style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <RiStarFill style={{ color: '#facc15' }} />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.1em' }}>New Arrivals</span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#fff' }}>Fresh Drops</h2>
                        </div>
                        <Link to="/shop/shoes" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#facc15', fontWeight: 500, textDecoration: 'none' }}>
                            View All <RiArrowRightLine />
                        </Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                        {newArrivals.slice(0, 8).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                    </div>
                </motion.section>
            )}

            {/* ═══════════ HOW IT WORKS ═══════════ */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em' }}>How It Works</span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: '#fff', marginTop: '12px' }}>Three Simple Steps</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
                    {[
                        { icon: RiFootprintFill, title: 'Walk', desc: 'Track your daily steps with the StepStyle mobile app. Every step counts towards your rewards.', color: '#a78bfa', bg: 'rgba(124,58,237,0.12)', num: '01' },
                        { icon: RiCoinsFill, title: 'Earn Coins', desc: 'Convert your steps into StepStyle coins. The more you walk, the more coins you earn.', color: '#facc15', bg: 'rgba(234,179,8,0.12)', num: '02' },
                        { icon: RiShoppingBag3Fill, title: 'Redeem', desc: 'Use your earned coins as discounts when shopping. Get real savings on premium products.', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', num: '03' },
                    ].map((step, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="glass" style={{ borderRadius: '20px', padding: '40px 32px', textAlign: 'center', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '16px', right: '24px', fontSize: '48px', fontWeight: 900, color: 'rgba(255,255,255,0.03)', userSelect: 'none' }}>{step.num}</div>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', background: step.bg }}>
                                <step.icon style={{ fontSize: '24px', color: step.color }} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>{step.title}</h3>
                            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.7 }}>{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ═══════════ LEVELS PREVIEW ═══════════ */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rewards & Levels</span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: '#fff', marginTop: '12px' }}>Level Up Your Rewards</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', maxWidth: '1000px', margin: '0 auto' }}>
                    {levels.map((lvl, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 25, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="glass" style={{ borderRadius: '20px', padding: '24px 16px', textAlign: 'center' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}
                                className={`bg-gradient-to-br ${lvl.color}`}>
                                <span style={{ color: '#fff', fontWeight: 900, fontSize: '18px' }}>{lvl.level}</span>
                            </div>
                            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{lvl.name}</h3>
                            <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', marginBottom: '12px' }}>{lvl.steps} steps</p>
                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', height: '6px', marginBottom: '12px', overflow: 'hidden' }}>
                                <div className={`bg-gradient-to-r ${lvl.color}`} style={{ height: '6px', borderRadius: '9999px', width: `${20 * lvl.level}%` }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <RiCoinsFill style={{ color: '#facc15', fontSize: '12px' }} />
                                <span style={{ color: '#fde68a', fontSize: '14px', fontWeight: 600 }}>{lvl.coins}</span>
                                <span style={{ color: '#4b5563', fontSize: '11px' }}>/day</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ═══════════ CTA SECTION ═══════════ */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 24px 140px' }}>
                <div className="glass" style={{ borderRadius: '24px', padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(74,222,128,0.05))' }} />
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '256px', height: '256px', background: 'rgba(124,58,237,0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '256px', height: '256px', background: 'rgba(74,222,128,0.05)', borderRadius: '50%', filter: 'blur(100px)' }} />
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Ready to Start Walking?</h2>
                        <p style={{ color: '#9ca3af', fontSize: '18px', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                            Download the StepStyle app and start earning coins with every step you take. Your fitness journey starts here.
                        </p>
                        <Link to="/login">
                            <button style={{ minWidth: '260px', padding: '20px 56px', borderRadius: '16px', background: 'linear-gradient(to right, #7c3aed, #6d28d9)', color: '#fff', fontWeight: 700, fontSize: '18px', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(124,58,237,0.25)' }}>
                                Get Started Free
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
