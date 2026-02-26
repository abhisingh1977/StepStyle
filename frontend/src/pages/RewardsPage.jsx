import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RiCoinsFill, RiFootprintFill, RiFireFill, RiMedalFill, RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri';
import { HiSparkles, HiTrendingUp, HiLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const levelData = [
    { level: 1, name: 'Starter', steps: 10000, color: 'from-gray-400 to-gray-500', gradient: 'linear-gradient(135deg, #9ca3af, #6b7280)' },
    { level: 2, name: 'Walker', steps: 50000, color: 'from-blue-400 to-blue-600', gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)' },
    { level: 3, name: 'Runner', steps: 150000, color: 'from-purple-400 to-purple-600', gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)' },
    { level: 4, name: 'Athlete', steps: 500000, color: 'from-yellow-400 to-orange-500', gradient: 'linear-gradient(135deg, #facc15, #f97316)' },
    { level: 5, name: 'Legend', steps: Infinity, color: 'from-green-400 to-emerald-500', gradient: 'linear-gradient(135deg, #4ade80, #10b981)' },
];

function AnimatedCounter({ value, duration = 2 }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value || 0;
        const step = end / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setDisplay(end); clearInterval(timer); }
            else setDisplay(Math.floor(start));
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <>{display.toLocaleString()}</>;
}

export default function RewardsPage() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            API.get('/wallet').then(r => { setWallet(r.data); setLoading(false); }).catch(() => setLoading(false));
        } else { setLoading(false); }
    }, [user]);

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
                <div style={{ textAlign: 'center' }}>
                    <HiLockClosed style={{ fontSize: '48px', color: '#4b5563', margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Login to view Rewards</h2>
                    <p style={{ color: '#6b7280' }}>Sign in to check your coins and level progress</p>
                    <Link to="/login" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 32px', borderRadius: '12px', background: 'linear-gradient(to right, #7c3aed, #6d28d9)', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '32px', height: '32px', border: '2px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;
    }

    const data = wallet || { coins: user.coins, level: user.level, totalSteps: user.totalSteps, stepsToday: user.stepsToday, streak: user.streak, badges: user.badges || [], progress: 50, nextLevelSteps: 150000, transactions: [] };
    const currentLevel = levelData[data.level - 1] || levelData[0];

    const statCards = [
        { icon: RiCoinsFill, label: 'Total Coins', value: data.coins, color: '#facc15', bg: 'rgba(234,179,8,0.08)', suffix: '' },
        { icon: RiFootprintFill, label: 'Steps Today', value: data.stepsToday, color: '#4ade80', bg: 'rgba(74,222,128,0.08)', suffix: '' },
        { icon: RiFireFill, label: 'Day Streak', value: data.streak, color: '#fb923c', bg: 'rgba(251,146,60,0.08)', suffix: ' days' },
        { icon: HiTrendingUp, label: 'Total Steps', value: data.totalSteps, color: '#a78bfa', bg: 'rgba(124,58,237,0.08)', suffix: '' },
    ];

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '64px' }}>
            {/* ═══════ PAGE HEADER ═══════ */}
            <section style={{ padding: '48px 24px 40px', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '40px' }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <Link to="/" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: '#374151', fontSize: '13px' }}>›</span>
                        <span style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 500 }}>Rewards</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>Rewards & Wallet</h1>
                    <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '500px', lineHeight: 1.6 }}>
                        Track your steps, earn coins, and level up. Every step brings you closer to amazing rewards.
                    </p>
                </motion.div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                {/* ═══════ STATS GRID ═══════ */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
                    {statCards.map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            style={{
                                borderRadius: '20px', padding: '24px',
                                background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: stat.bg }}>
                                    <stat.icon style={{ fontSize: '20px', color: stat.color }} />
                                </div>
                                <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>{stat.label}</span>
                            </div>
                            <p style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}><AnimatedCounter value={stat.value} />{stat.suffix}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ═══════ LEVEL PROGRESS ═══════ */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    style={{
                        borderRadius: '20px', padding: '32px',
                        background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)', marginBottom: '40px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Level {data.level} — {currentLevel.name}</h3>
                            <p style={{ fontSize: '13px', color: '#6b7280' }}>
                                {data.level < 5 ? `${(data.nextLevelSteps - data.totalSteps).toLocaleString()} steps to next level` : 'Maximum level reached! 🏆'}
                            </p>
                        </div>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: currentLevel.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                            <span style={{ color: '#fff', fontSize: '22px', fontWeight: 900 }}>{data.level}</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', height: '10px', marginBottom: '8px', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${data.progress}%` }} transition={{ duration: 1.5, ease: 'easeOut' }}
                            style={{ height: '10px', borderRadius: '9999px', background: currentLevel.gradient }} />
                    </div>
                    <p style={{ textAlign: 'right', fontSize: '13px', color: '#6b7280' }}>{data.progress}% complete</p>
                </motion.div>

                {/* ═══════ LEVELS OVERVIEW ═══════ */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '40px' }}>
                    {levelData.map((lvl, i) => {
                        const unlocked = data.level >= lvl.level;
                        return (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.08 }}
                                style={{
                                    borderRadius: '20px', padding: '24px', textAlign: 'center',
                                    background: 'rgba(19,19,26,0.7)',
                                    border: unlocked ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(255,255,255,0.04)',
                                    backdropFilter: 'blur(20px)',
                                    opacity: unlocked ? 1 : 0.5,
                                }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: lvl.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: unlocked ? '0 8px 20px rgba(0,0,0,0.3)' : 'none' }}>
                                    {unlocked
                                        ? <RiMedalFill style={{ color: '#fff', fontSize: '20px' }} />
                                        : <HiLockClosed style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px' }} />
                                    }
                                </div>
                                <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{lvl.name}</h4>
                                <p style={{ color: '#6b7280', fontSize: '12px' }}>Level {lvl.level}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ═══════ BADGES ═══════ */}
                {data.badges?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                        style={{
                            borderRadius: '20px', padding: '32px',
                            background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)',
                            backdropFilter: 'blur(20px)', marginBottom: '40px',
                        }}
                    >
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HiSparkles style={{ color: '#facc15' }} /> Badges Earned
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {data.badges.map((badge, i) => (
                                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                                    style={{
                                        padding: '10px 20px', borderRadius: '9999px',
                                        background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.04))',
                                        border: '1px solid rgba(124,58,237,0.15)',
                                        color: '#c4b5fd', fontSize: '13px', fontWeight: 500,
                                    }}
                                >
                                    🏅 {badge}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ═══════ TRANSACTION HISTORY ═══════ */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                    style={{
                        borderRadius: '20px', padding: '32px',
                        background: 'rgba(19,19,26,0.7)', border: '1px solid rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>Coin History</h3>
                    {data.transactions?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {data.transactions.map((tx, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '14px', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tx.type === 'earned' ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)' }}>
                                            {tx.type === 'earned' ? <RiArrowUpLine style={{ color: '#4ade80', fontSize: '16px' }} /> : <RiArrowDownLine style={{ color: '#f87171', fontSize: '16px' }} />}
                                        </div>
                                        <div>
                                            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{tx.description}</p>
                                            <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{new Date(tx.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: '14px', color: tx.type === 'earned' ? '#4ade80' : '#f87171' }}>
                                        {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <p style={{ fontSize: '36px', marginBottom: '12px' }}>👟</p>
                            <p style={{ color: '#6b7280', fontSize: '14px' }}>No transactions yet. Start walking to earn coins!</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
