import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ProfileSettings() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        privateProfile: false,
        emailUpdates: true,
        showActivity: true,
    });

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050816 0%, #0d1730 50%, #111827 100%)', color: '#f7fbff', padding: '80px 24px 40px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: 'rgba(8, 14, 32, 0.92)', borderRadius: '24px', border: '1px solid rgba(0,217,255,0.2)', boxShadow: '0 16px 45px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                <div style={{ padding: '28px 30px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(90deg, rgba(0,217,255,0.14), rgba(107,92,255,0.14))' }}>
                    <h2 style={{ margin: 0, fontSize: '28px' }}>Settings</h2>
                    <p style={{ margin: '8px 0 0', color: '#9fb4d6' }}>Control how your profile appears and how you want to interact with the community.</p>
                </div>

                <div style={{ padding: '30px', display: 'grid', gap: '18px' }}>
                    <div style={{ padding: '18px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>Private profile</h3>
                                <p style={{ margin: '6px 0 0', color: '#9fb4d6' }}>Only approved followers can see your activity.</p>
                            </div>
                            <button onClick={() => toggleSetting('privateProfile')} style={{ border: 'none', borderRadius: '999px', padding: '8px 14px', background: settings.privateProfile ? '#00d9ff' : 'rgba(255,255,255,0.08)', color: settings.privateProfile ? '#07111f' : '#f7fbff', cursor: 'pointer', fontWeight: 700 }}>
                                {settings.privateProfile ? 'On' : 'Off'}
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '18px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>Email updates</h3>
                                <p style={{ margin: '6px 0 0', color: '#9fb4d6' }}>Receive updates about forum replies and recommendations.</p>
                            </div>
                            <button onClick={() => toggleSetting('emailUpdates')} style={{ border: 'none', borderRadius: '999px', padding: '8px 14px', background: settings.emailUpdates ? '#00d9ff' : 'rgba(255,255,255,0.08)', color: settings.emailUpdates ? '#07111f' : '#f7fbff', cursor: 'pointer', fontWeight: 700 }}>
                                {settings.emailUpdates ? 'On' : 'Off'}
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '18px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>Show activity on profile</h3>
                                <p style={{ margin: '6px 0 0', color: '#9fb4d6' }}>Let friends see your recent reviews and forum activity.</p>
                            </div>
                            <button onClick={() => toggleSetting('showActivity')} style={{ border: 'none', borderRadius: '999px', padding: '8px 14px', background: settings.showActivity ? '#00d9ff' : 'rgba(255,255,255,0.08)', color: settings.showActivity ? '#07111f' : '#f7fbff', cursor: 'pointer', fontWeight: 700 }}>
                                {settings.showActivity ? 'On' : 'Off'}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <button onClick={() => navigate('/profile/edit')} style={{ background: 'linear-gradient(135deg, #00d9ff, #6b5cff)', color: 'white', border: 'none', padding: '12px 18px', borderRadius: '999px', cursor: 'pointer', fontWeight: 700 }}>
                            Edit profile
                        </button>
                        <button onClick={() => navigate('/profile')} style={{ background: 'transparent', color: '#00d9ff', border: '1px solid #00d9ff', padding: '12px 18px', borderRadius: '999px', cursor: 'pointer', fontWeight: 700 }}>
                            Back to profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}