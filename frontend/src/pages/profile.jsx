import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { getCampuses } from '../utils/method';
import { updateProfile } from '../features/userSlice';
import { changePassword } from '../features/authSlice';

const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux states
    const userProfile = useSelector(state => state.user.profile);
    const rides = useSelector(state => state.rides.rides);
    const requests = useSelector(state => state.requests.requests);
    const allReviews = useSelector(state => state.reviews.reviews);

    const [showEditPanel, setShowEditPanel] = useState(false);
    const [show4fields, setShow4Fields] = useState(true);

    const myRides = rides.filter(r => r.riderEmail === userProfile.email).map(r => ({
        id: r.id,
        title: r.title,
        status: r.status === "active" ? "Live" : "Done",
        date: r.date,
    }));

    const myRequestedRides = requests.filter(r => r.requesterEmail === userProfile.email).map(r => ({
        id: r.id,
        title: r.ride,
        rider: r.requesterName,
        status: r.status === "pending" ? "Pending" : r.status === "approved" ? "Approved" : "Declined",
        date: r.rideDate,
    }));

    const myReviews = allReviews.filter(r => r.targetEmail === userProfile.email).map((r, idx) => ({
        id: r.id || idx,
        user: r.user,
        comment: r.comment,
        rating: r.rating,
    }));

    const avgRating = myReviews.length > 0
        ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
        : 0;

    const [editData, setEditData] = useState({ name: userProfile.name, campus: userProfile.campus });
    const [activeTab, setActiveTab] = useState('rides');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingCampus, setIsEditingCampus] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordData, setPasswordData] = useState({ new: '', confirm: '' });

    const handleSaveProfile = () => {
        if (isEditingName || isEditingCampus) {
            dispatch(updateProfile({ name: editData.name, campus: editData.campus }));
        }
        if (showPasswordFields && passwordData.new && passwordData.new === passwordData.confirm) {
            dispatch(changePassword({ email: userProfile.email, newPassword: passwordData.new }));
        }
        setIsEditingName(false);
        setIsEditingCampus(false);
        setShowPasswordFields(false);
        setShow4Fields(true);
        setShowEditPanel(false);
        setPasswordData({ new: '', confirm: '' });
    };

    const closePanel = () => {
        setShowEditPanel(false);
        setIsEditingName(false);
        setIsEditingCampus(false);
        setShowPasswordFields(false);
        setShow4Fields(true);
        setPasswordData({ new: '', confirm: '' });
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', color: '#000', fontFamily: "'Inter', sans-serif" }}>

            <header style={{
                padding: 'clamp(12px, 3vw, 24px) clamp(16px, 5vw, 80px)',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                backgroundColor: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                zIndex: 50,
            }}>
                <h1 style={{ fontSize: 'clamp(14px, 2.5vw, 20px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em', fontStyle: 'italic', margin: 0 }}>
                    Profile
                </h1>
                <button
                    onClick={() => navigate('/feed')}
                    style={{
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: 'clamp(8px, 1.5vw, 10px) clamp(14px, 3vw, 24px)',
                        borderRadius: '9999px',
                        fontSize: 'clamp(8px, 1.2vw, 10px)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Back to Feed
                </button>
            </header>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(24px, 5vw, 48px) clamp(16px, 5vw, 32px)' }}>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'clamp(32px, 6vw, 64px)', textAlign: 'center' }}>
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <div style={{
                            width: 'clamp(96px, 15vw, 128px)',
                            height: 'clamp(96px, 15vw, 128px)',
                            borderRadius: '9999px',
                            border: '8px solid #fff',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            overflow: 'hidden',
                            backgroundColor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {userProfile.image
                                ? <img src={userProfile.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="profile" />
                                : <span style={{ color: '#fff', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 900, fontStyle: 'italic' }}>{userProfile.name.charAt(0)}</span>
                            }
                        </div>
                    </div>

                    <h2 style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 6px' }}>{userProfile.name}</h2>
                    <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 'clamp(20px, 4vw, 32px)', opacity: 0.7 }}>
                        Roll No: {userProfile.rollNo}
                    </p>

                    <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 16px)', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[{ val: myRides.length, label: 'Rides' }, { val: avgRating, label: 'Rating' }].map(s => (
                            <div key={s.label} style={{
                                backgroundColor: 'rgba(249,250,251,0.5)',
                                border: '1px solid #f3f4f6',
                                padding: 'clamp(12px, 2vw, 16px) clamp(24px, 5vw, 40px)',
                                borderRadius: '24px',
                                textAlign: 'center',
                            }}>
                                <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 900, color: '#000', lineHeight: 1, margin: 0 }}>{s.val}</p>
                                <p style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => { setEditData({ name: userProfile.name, campus: userProfile.campus }); setShowEditPanel(true); }}
                        style={{
                            marginTop: 'clamp(20px, 4vw, 32px)',
                            backgroundColor: '#f9fafb',
                            color: '#000',
                            padding: 'clamp(10px, 1.5vw, 12px) clamp(20px, 4vw, 32px)',
                            borderRadius: '9999px',
                            fontSize: 'clamp(9px, 1.3vw, 10px)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Edit Profile
                    </button>
                </div>

                <div style={{
                    backgroundColor: 'rgba(243,244,246,0.5)',
                    padding: '6px',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    marginBottom: 'clamp(20px, 4vw, 40px)',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}>
                    {[
                        { id: 'rides', label: 'My Rides', icon: <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
                        { id: 'requested', label: 'Requested', icon: <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
                        { id: 'reviews', label: 'Reviews', icon: <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: 'clamp(8px, 1.5vw, 14px) clamp(12px, 2.5vw, 32px)',
                                borderRadius: '18px',
                                fontSize: 'clamp(9px, 1.3vw, 11px)',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                                color: activeTab === tab.id ? '#000' : '#9ca3af',
                                boxShadow: activeTab === tab.id ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeTab === 'rides' && (
                        myRides.length > 0 ? myRides.map(ride => (
                            <div key={ride.id} style={{
                                backgroundColor: '#fff',
                                border: '1px solid #f3f4f6',
                                padding: 'clamp(14px, 3vw, 24px)',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 24px)', minWidth: 0 }}>
                                    <div style={{
                                        width: 'clamp(40px, 6vw, 48px)',
                                        height: 'clamp(40px, 6vw, 48px)',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        backgroundColor: ride.status === 'Live' ? '#f0fdf4' : '#f9fafb',
                                        color: ride.status === 'Live' ? '#16a34a' : '#9ca3af',
                                    }}>
                                        {ride.status === 'Live'
                                            ? <div style={{ width: 8, height: 8, backgroundColor: '#22c55e', borderRadius: '9999px' }} />
                                            : <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                        }
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <h4 style={{ fontSize: 'clamp(10px, 2vw, 13px)', fontWeight: 900, textTransform: 'uppercase', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ride.title}</h4>
                                        <p style={{ fontSize: 'clamp(8px, 1.3vw, 10px)', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>{ride.date}</p>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: 'clamp(7px, 1.1vw, 9px)',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    padding: '6px 12px',
                                    borderRadius: '9999px',
                                    backgroundColor: ride.status === 'Live' ? '#dcfce7' : '#f3f4f6',
                                    color: ride.status === 'Live' ? '#15803d' : '#6b7280',
                                    flexShrink: 0,
                                }}>
                                    {ride.status}
                                </span>
                            </div>
                        )) : <EmptyState message="No rides posted" />
                    )}

                    {activeTab === 'requested' && (
                        myRequestedRides.length > 0 ? myRequestedRides.map(req => (
                            <div key={req.id} style={{
                                backgroundColor: '#fff',
                                border: '1px solid #f3f4f6',
                                padding: 'clamp(14px, 3vw, 24px)',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 24px)', minWidth: 0 }}>
                                    <div style={{ width: 'clamp(40px, 6vw, 48px)', height: 'clamp(40px, 6vw, 48px)', borderRadius: '14px', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#9ca3af' }}>
                                        <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <h4 style={{ fontSize: 'clamp(10px, 2vw, 13px)', fontWeight: 900, textTransform: 'uppercase', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.title}</h4>
                                        <p style={{ fontSize: 'clamp(8px, 1.3vw, 10px)', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Status: {req.status} · {req.date}</p>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: 'clamp(7px, 1.1vw, 9px)',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    padding: '6px 12px',
                                    borderRadius: '9999px',
                                    backgroundColor: req.status === 'Approved' ? '#dcfce7' : req.status === 'Declined' ? '#fef2f2' : '#fff7ed',
                                    color: req.status === 'Approved' ? '#15803d' : req.status === 'Declined' ? '#dc2626' : '#c2410c',
                                    flexShrink: 0,
                                }}>
                                    {req.status}
                                </span>
                            </div>
                        )) : <EmptyState message="No requests sent" />
                    )}

                    {activeTab === 'reviews' && (
                        myReviews.length > 0 ? myReviews.map(rev => (
                            <div key={rev.id} style={{ backgroundColor: '#fff', border: '1px solid #f3f4f6', padding: 'clamp(16px, 3vw, 32px)', borderRadius: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '9999px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: '#fff', fontSize: '10px', fontWeight: 900, fontStyle: 'italic' }}>{rev.user.charAt(0)}</span>
                                        </div>
                                        <span style={{ fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: 900, color: '#000' }}>{rev.user}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} style={{ fontSize: '12px', color: i < rev.rating ? '#000' : '#f3f4f6' }}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <p style={{ fontSize: 'clamp(12px, 2vw, 14px)', color: '#6b7280', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{rev.comment}"</p>
                            </div>
                        )) : <EmptyState message="No reviews yet" />
                    )}
                </div>
            </main>

            {showEditPanel && (show4fields || showPasswordFields) && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 32px)' }}>
                    <div onClick={closePanel} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }} />

                    <div style={{
                        position: 'relative',
                        backgroundColor: '#fff',
                        width: '100%',
                        maxWidth: '720px',
                        borderRadius: 'clamp(20px, 4vw, 40px)',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.2)',
                        padding: 'clamp(20px, 4vw, 48px)',
                        zIndex: 10,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                    }}>
                        <button
                            onClick={closePanel}
                            style={{ position: 'absolute', top: 'clamp(14px, 2.5vw, 24px)', right: 'clamp(14px, 2.5vw, 24px)', width: 36, height: 36, borderRadius: '9999px', backgroundColor: '#f9fafb', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', zIndex: 20 }}
                        >
                            <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(20px, 4vw, 40px)' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: 'clamp(80px, 12vw, 128px)', height: 'clamp(80px, 12vw, 128px)', borderRadius: '9999px', border: '6px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', overflow: 'hidden', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {userProfile.image
                                        ? <img src={userProfile.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="profile" />
                                        : <span style={{ color: '#fff', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 900, fontStyle: 'italic' }}>{userProfile.name.charAt(0)}</span>
                                    }
                                </div>
                                <button style={{ position: 'absolute', bottom: 2, right: 2, backgroundColor: '#fff', width: 30, height: 30, borderRadius: '9999px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f3f4f6', cursor: 'pointer' }}>
                                    <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                            </div>
                        </div>

                        {showPasswordFields && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(10px, 2vw, 20px)', marginBottom: 'clamp(16px, 3vw, 40px)' }}>
                                {[{ label: 'New Password', key: 'new' }, { label: 'Confirm Password', key: 'confirm' }].map(f => (
                                    <div key={f.key} style={{ backgroundColor: '#f8fafc', padding: 'clamp(16px, 2.5vw, 28px)', borderRadius: '24px' }}>
                                        <h5 style={{ fontSize: '10px', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>{f.label}</h5>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '14px', padding: '10px 14px', fontSize: '14px', fontWeight: 900, outline: 'none', boxSizing: 'border-box' }}
                                            value={passwordData[f.key]}
                                            onChange={e => setPasswordData({ ...passwordData, [f.key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {show4fields && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 'clamp(10px, 2vw, 20px)', marginBottom: 'clamp(16px, 3vw, 40px)' }}>
                                <InfoCard label="Roll Number" value={userProfile.rollNo} />

                                <div style={{ backgroundColor: '#f8fafc', padding: 'clamp(16px, 2.5vw, 28px)', borderRadius: '24px', position: 'relative' }}>
                                    <h5 style={{ fontSize: '10px', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>Full Name</h5>
                                    {isEditingName
                                        ? <input type="text" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '14px', padding: '10px 14px', fontSize: '14px', fontWeight: 900, outline: 'none', boxSizing: 'border-box' }} autoFocus />
                                        : <p style={{ fontSize: 'clamp(14px, 2.5vw, 17px)', fontWeight: 900, margin: 0 }}>{userProfile.name}</p>
                                    }
                                    <EditButton active={isEditingName} onClick={() => setIsEditingName(!isEditingName)} />
                                </div>

                                <div style={{ backgroundColor: '#f8fafc', padding: 'clamp(16px, 2.5vw, 28px)', borderRadius: '24px', position: 'relative' }}>
                                    <h5 style={{ fontSize: '10px', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>Campus</h5>
                                    {isEditingCampus
                                        ? <select value={editData.campus} onChange={e => setEditData({ ...editData, campus: e.target.value })} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '14px', padding: '10px 14px', fontSize: '14px', fontWeight: 900, outline: 'none', boxSizing: 'border-box' }} autoFocus>
                                            {getCampuses().map(c => <option key={c.id}>{c.name}</option>)}
                                        </select>
                                        : <p style={{ fontSize: 'clamp(14px, 2.5vw, 17px)', fontWeight: 900, margin: 0 }}>{userProfile.campus}</p>
                                    }
                                    <EditButton active={isEditingCampus} onClick={() => setIsEditingCampus(!isEditingCampus)} />
                                </div>

                                <InfoCard label="Email Address" value={userProfile.email} />
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => {
                                    if (showPasswordFields || isEditingName || isEditingCampus) {
                                        handleSaveProfile();
                                    } else {
                                        setShowPasswordFields(true);
                                        setShow4Fields(false);
                                    }
                                }}
                                style={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    padding: 'clamp(14px, 2.5vw, 20px) clamp(24px, 5vw, 40px)',
                                    borderRadius: '9999px',
                                    fontSize: 'clamp(11px, 1.8vw, 13px)',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '100%',
                                    maxWidth: '320px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                }}
                            >
                                {(showPasswordFields || isEditingName || isEditingCampus) ? 'Save Changes' : 'Change Password'}
                            </button>
                            {showPasswordFields && (
                                <button
                                    onClick={() => { setShowPasswordFields(false); setShow4Fields(true); setPasswordData({ new: '', confirm: '' }); }}
                                    style={{
                                        backgroundColor: '#f3f4f6',
                                        color: '#000',
                                        padding: 'clamp(14px, 2.5vw, 20px) clamp(24px, 5vw, 40px)',
                                        borderRadius: '9999px',
                                        fontSize: 'clamp(11px, 1.8vw, 13px)',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em',
                                        border: 'none',
                                        cursor: 'pointer',
                                        width: '100%',
                                        maxWidth: '320px',
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

const InfoCard = ({ label, value }) => (
    <div style={{ backgroundColor: '#f8fafc', padding: 'clamp(16px, 2.5vw, 28px)', borderRadius: '24px' }}>
        <h5 style={{ fontSize: '10px', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>{label}</h5>
        <p style={{ fontSize: 'clamp(13px, 2.5vw, 17px)', fontWeight: 900, margin: 0, wordBreak: 'break-all' }}>{value}</p>
    </div>
);

const EditButton = ({ active, onClick }) => (
    <button
        onClick={onClick}
        style={{ position: 'absolute', top: 'clamp(14px, 2vw, 24px)', right: 'clamp(14px, 2vw, 24px)', width: 32, height: 32, borderRadius: '9999px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
        <svg style={{ width: 18, height: 18, color: active ? '#000' : 'rgba(0,0,0,0.25)' }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
    </button>
);

const EmptyState = ({ message }) => (
    <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 80px) 20px', opacity: 0.2 }}>
        <h3 style={{ fontSize: 'clamp(14px, 3vw, 20px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{message}</h3>
    </div>
);

export default ProfilePage;