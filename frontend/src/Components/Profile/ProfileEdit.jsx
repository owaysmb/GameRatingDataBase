import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

export function ProfileEdit() {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { username } = useParams();
    const [formData, setFormData] = useState({ username: '', bio: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [preview, setPreview] = useState(user?.profilePicture || '');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({ username: user.username || '', bio: user.bio || '' });
            setPreview(user.profilePicture || '');
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const response = await fetch('http://localhost:3000/file-upload', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const result = await response.json();
            if (response.ok && result.user) {
                updateUser(result.user);
                setPreview(result.user.profilePicture || '');
                setMessage('Profile photo updated');
            } else {
                setMessage(result.message || 'Photo upload failed');
            }
        } catch (error) {
            console.error(error);
            setMessage('Photo upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:3000/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.username,
                    bio: formData.bio,
                }),
            });

            const result = await response.json();
            if (response.ok && result.user) {
                updateUser(result.user);
                setMessage('Profile updated successfully');
                setTimeout(() => navigate(`/${result.user.username}/profile`), 800);
            } else {
                setMessage(result.message || 'Unable to update profile');
            }
        } catch (error) {
            console.error(error);
            setMessage('Unable to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050816 0%, #0d1730 50%, #111827 100%)', color: '#f7fbff', padding: '80px 24px 40px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', background: 'rgba(8, 14, 32, 0.92)', borderRadius: '24px', border: '1px solid rgba(0,217,255,0.2)', boxShadow: '0 16px 45px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                <div style={{ padding: '28px 30px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(90deg, rgba(0,217,255,0.14), rgba(107,92,255,0.14))' }}>
                    <h2 style={{ margin: 0, fontSize: '28px' }}>Edit Profile</h2>
                    <p style={{ margin: '8px 0 0', color: '#9fb4d6' }}>Update your public profile and personal bio.</p>
                </div>

                <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                        <label style={{ position: 'relative', cursor: 'pointer' }}>
                            <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                            {preview ? (
                                <img src={preview} alt="avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00d9ff' }} />
                            ) : (
                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #00d9ff, #6b5cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', fontWeight: 700 }}>
                                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700 }}>
                                {uploading ? 'Uploading...' : 'Change photo'}
                            </div>
                        </label>

                        <div>
                            <h3 style={{ margin: '0 0 6px', fontSize: '22px' }}>{user?.username || 'Player'}</h3>
                            <p style={{ margin: 0, color: '#9fb4d6' }}>Choose a profile photo that matches your style.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#9fb4d6' }}>Username</label>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#11182b', color: 'white' }}
                                placeholder="Enter username"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#9fb4d6' }}>Bio</label>
                            <textarea
                                name="bio"
                                rows="4"
                                value={formData.bio}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#11182b', color: 'white', resize: 'vertical' }}
                                placeholder="Tell others about your favorite games and vibes"
                            />
                        </div>

                        {message ? <p style={{ margin: 0, color: '#7be7ff' }}>{message}</p> : null}

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #00d9ff, #6b5cff)', color: 'white', border: 'none', padding: '12px 18px', borderRadius: '999px', cursor: 'pointer', fontWeight: 700 }}>
                                {loading ? 'Saving...' : 'Save changes'}
                            </button>
                            <button type="button" onClick={() => navigate(`/${username}/profile`)} style={{ background: 'transparent', color: '#00d9ff', border: '1px solid #00d9ff', padding: '12px 18px', borderRadius: '999px', cursor: 'pointer', fontWeight: 700 }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}