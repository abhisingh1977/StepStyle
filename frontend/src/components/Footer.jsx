import { Link } from 'react-router-dom';
import { RiInstagramLine, RiTwitterXLine, RiGithubLine } from 'react-icons/ri';

export default function Footer() {
    return (
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#0a0a0f', position: 'relative', zIndex: 10, marginTop: '0' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', textDecoration: 'none' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: '#fff', fontWeight: 900, fontSize: '14px' }}>S</span>
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Step<span style={{ color: '#4ade80' }}>Style</span></span>
                        </Link>
                        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.7 }}>Walk more, earn more, shop smarter. The gamified ecommerce platform that rewards your every step.</p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            {[RiInstagramLine, RiTwitterXLine, RiGithubLine].map((Icon, i) => (
                                <a key={i} href="#" className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', textDecoration: 'none' }}>
                                    <Icon style={{ fontSize: '18px' }} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>Shop</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {['Men', 'Women', 'Electronics', 'Beauty', 'Shoes'].map((s) => (
                                <Link key={s} to={`/shop/${s.toLowerCase()}`} style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>{s}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Rewards */}
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>Rewards</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {['How It Works', 'Earn Coins', 'Redeem', 'Levels', 'Deals'].map((s) => (
                                <Link key={s} to="/rewards" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>{s}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>Support</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {['Contact Us', 'FAQs', 'Shipping', 'Returns', 'Privacy Policy'].map((s) => (
                                <a key={s} href="#" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>{s}</a>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ color: '#4b5563', fontSize: '14px' }}>© 2026 StepStyle. All rights reserved.</p>
                    <p style={{ color: '#374151', fontSize: '12px' }}>Built for Hackathon 🚀</p>
                </div>
            </div>
        </footer>
    );
}
