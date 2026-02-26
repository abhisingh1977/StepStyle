import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HiShoppingBag, HiMenu, HiX, HiLogout, HiClipboardList, HiSearch } from 'react-icons/hi';
import { RiCoinsFill, RiWalletFill, RiFootprintFill } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinks = [
    { name: 'Men', path: '/shop/men' },
    { name: 'Women', path: '/shop/women' },
    { name: 'Electronics', path: '/shop/electronics' },
    { name: 'Beauty', path: '/shop/beauty' },
    { name: 'Shoes', path: '/shop/shoes' },
    { name: 'Rewards', path: '/rewards' },
    { name: 'Deals', path: '/deals' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location]);

    if (!user) return null;

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: scrolled ? 'rgba(10,10,15,0.92)' : 'rgba(10,10,15,0.75)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            borderBottom: scrolled ? '1px solid rgba(124,58,237,0.12)' : '1px solid transparent',
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
            transition: 'all 0.4s ease',
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                            <RiFootprintFill style={{ color: '#fff', fontSize: '18px' }} />
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                            Step<span style={{ color: '#4ade80' }}>Style</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden lg:flex">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link key={link.name} to={link.path} style={{
                                    padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                                    color: isActive ? '#4ade80' : '#d1d5db', textDecoration: 'none',
                                    background: isActive ? 'rgba(74,222,128,0.08)' : 'transparent',
                                    transition: 'all 0.2s ease', position: 'relative', whiteSpace: 'nowrap',
                                }}>
                                    {link.name}
                                    {isActive && (
                                        <div style={{ position: 'absolute', bottom: '2px', left: '16px', right: '16px', height: '2px', borderRadius: '2px', background: 'linear-gradient(to right, #7c3aed, #4ade80)' }} />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

                        {/* Coin Balance */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 14px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(234,179,8,0.08), rgba(234,179,8,0.04))',
                            border: '1px solid rgba(234,179,8,0.15)',
                        }} className="hidden sm:flex">
                            <RiCoinsFill style={{ color: '#facc15', fontSize: '14px' }} />
                            <span style={{ color: '#fde68a', fontSize: '13px', fontWeight: 700 }}>{user.coins?.toLocaleString() || 0}</span>
                        </div>

                        {/* Level Badge */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '6px 12px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(124,58,237,0.05))',
                            border: '1px solid rgba(124,58,237,0.15)',
                        }} className="hidden md:flex">
                            <span style={{ fontSize: '12px' }}>⚡</span>
                            <span style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 600 }}>Lvl {user.level || 1}</span>
                        </div>

                        {/* Cart */}
                        <Link to="/cart" style={{ position: 'relative', padding: '10px', borderRadius: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HiShoppingBag style={{ fontSize: '20px', color: '#d1d5db' }} />
                            {totalItems > 0 && (
                                <span style={{
                                    position: 'absolute', top: '2px', right: '2px',
                                    width: '18px', height: '18px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '10px', fontWeight: 700, color: '#fff',
                                    boxShadow: '0 2px 8px rgba(124,58,237,0.4)',
                                }}>
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Profile */}
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setProfileOpen(!profileOpen)} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '4px 4px 4px 12px', borderRadius: '12px',
                                background: profileOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                            }}>
                                <span style={{ fontSize: '13px', color: '#d1d5db', fontWeight: 500 }} className="hidden sm:block">{user.name?.split(' ')[0]}</span>
                                <div style={{
                                    width: '34px', height: '34px', borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: '14px', fontWeight: 700,
                                    boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
                                }}>
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <>
                                        <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setProfileOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            style={{
                                                position: 'absolute', right: 0, marginTop: '8px', width: '240px',
                                                borderRadius: '16px', overflow: 'hidden', zIndex: 100,
                                                background: 'rgba(19,19,26,0.95)', backdropFilter: 'blur(24px)',
                                                border: '1px solid rgba(124,58,237,0.15)',
                                                boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
                                            }}
                                        >
                                            {/* User Info */}
                                            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{user.name}</p>
                                                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{user.email}</p>
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                                    <div style={{ flex: 1, padding: '8px', borderRadius: '10px', background: 'rgba(234,179,8,0.06)', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                            <RiCoinsFill style={{ color: '#facc15', fontSize: '12px' }} />
                                                            <span style={{ color: '#fde68a', fontSize: '14px', fontWeight: 700 }}>{user.coins?.toLocaleString() || 0}</span>
                                                        </div>
                                                        <span style={{ color: '#6b7280', fontSize: '10px' }}>Coins</span>
                                                    </div>
                                                    <div style={{ flex: 1, padding: '8px', borderRadius: '10px', background: 'rgba(124,58,237,0.06)', textAlign: 'center' }}>
                                                        <span style={{ color: '#a78bfa', fontSize: '14px', fontWeight: 700 }}>{user.totalSteps?.toLocaleString() || 0}</span>
                                                        <br />
                                                        <span style={{ color: '#6b7280', fontSize: '10px' }}>Steps</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div style={{ padding: '8px' }}>
                                                <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', color: '#d1d5db', textDecoration: 'none' }}>
                                                    <HiClipboardList style={{ fontSize: '16px', color: '#a78bfa' }} /> My Orders
                                                </Link>
                                                <Link to="/rewards" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', color: '#d1d5db', textDecoration: 'none' }}>
                                                    <RiWalletFill style={{ fontSize: '16px', color: '#4ade80' }} /> Wallet & Rewards
                                                </Link>
                                            </div>

                                            {/* Logout */}
                                            <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                <button onClick={() => { logout(); navigate('/'); }} style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                                                    padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                    fontSize: '13px', color: '#f87171', background: 'transparent',
                                                }}>
                                                    <HiLogout style={{ fontSize: '16px' }} /> Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ padding: '8px', borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer' }} className="lg:hidden">
                            {mobileOpen ? <HiX style={{ fontSize: '24px', color: '#fff' }} /> : <HiMenu style={{ fontSize: '24px', color: '#d1d5db' }} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div style={{ padding: '12px 16px' }}>
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path} style={{
                                    display: 'block', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
                                    color: location.pathname === link.path ? '#4ade80' : '#d1d5db', textDecoration: 'none',
                                    background: location.pathname === link.path ? 'rgba(74,222,128,0.06)' : 'transparent',
                                }}>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
