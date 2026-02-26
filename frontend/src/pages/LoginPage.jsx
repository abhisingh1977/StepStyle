import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Make sure the backend server is running.');
        }
        setLoading(false);
    };

    const fillDemo = () => {
        setEmail('demo@stepstyle.com');
        setPassword('Demo@123');
        setIsLogin(true);
        setError('');
    };

    const inputStyle = {
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '16px 16px 16px 48px',
        fontSize: '15px',
        color: '#fff',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 500,
        color: '#9ca3af',
        marginBottom: '8px',
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', position: 'relative' }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '25%', left: '25%', width: '320px', height: '320px', background: 'rgba(124,58,237,0.08)', borderRadius: '50%', filter: 'blur(120px)' }} />
                <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '320px', height: '320px', background: 'rgba(74,222,128,0.04)', borderRadius: '50%', filter: 'blur(120px)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative', width: '100%', maxWidth: '440px' }}
            >
                <div className="glass" style={{ borderRadius: '24px', padding: '48px 36px', boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px', textDecoration: 'none' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}>
                                <span style={{ color: '#fff', fontWeight: 900, fontSize: '20px' }}>S</span>
                            </div>
                            <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>Step<span style={{ color: '#4ade80' }}>Style</span></span>
                        </Link>
                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '8px' }}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                            {isLogin ? 'Sign in to your StepStyle account' : 'Join StepStyle and start earning'}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginBottom: '24px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '14px', textAlign: 'center' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {!isLogin && (
                                <div>
                                    <label style={labelStyle}>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <HiUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '18px' }} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <HiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '18px' }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <HiLockClosed style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '18px' }} />
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        style={{ ...inputStyle, paddingRight: '48px' }}
                                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                    >
                                        {showPw ? <HiEyeOff /> : <HiEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(to right, #7c3aed, #6d28d9)', color: '#fff', fontWeight: 600, fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, marginTop: '28px', boxShadow: '0 12px 24px rgba(124,58,237,0.2)' }}
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {/* Demo Quickfill */}
                    {isLogin && (
                        <button
                            onClick={fillDemo}
                            style={{ width: '100%', marginTop: '16px', padding: '14px', borderRadius: '12px', border: '1px dashed rgba(124,58,237,0.3)', background: 'transparent', color: '#a78bfa', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
                        >
                            🔑 Use Demo Account
                        </button>
                    )}

                    <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '24px' }}>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            style={{ color: '#a78bfa', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>


                </div>
            </motion.div>
        </div>
    );
}
