import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { getCampuses, validatePassword } from '../utils/method';
import { updateCurrentUser } from '../features/authSlice';
import { changePassword } from '../features/authSlice';
import { updateUserRidesCampus } from '../features/rideSlice';

const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.currentUser);
    const userName = `${user?.firstName} ${user?.lastName}`;
    const rides = useSelector(state => state.rides.rides);
    const requests = useSelector(state => state.requests.requests);
    const allReviews = useSelector(state => state.reviews.reviews);

    const [isSettingsView, setIsSettingsView] = useState(false);
    const [show4fields, setShow4Fields] = useState(true);

    const myRides = rides.filter(r => r.riderEmail === user?.email).map(r => ({
        id: r.id,
        title: r.title,
        status: r.status === "active" ? "Live" : "Done",
        date: r.date,
    }));

    const myRequestedRides = requests.filter(r => r.requesterEmail === user?.email).map(r => ({
        id: r.id,
        title: r.ride,
        rider: r.requesterName,
        status: r.status === "pending" ? "Pending" : r.status === "approved" ? "Approved" : "Declined",
        date: r.rideDate,
    }));

    const myReviews = allReviews.filter(r => r.targetEmail?.toLowerCase() === user?.email?.toLowerCase()).map((r, idx) => ({
        id: r.id || idx,
        user: r.user,
        comment: r.comment,
        rating: r.rating,
    }));

    const completedOfferedRides = myRides.filter(r => r.status === "Done");
    const completedTookRides = myRequestedRides.filter(r => r.status === "Approved");

    const avgRating = myReviews.length > 0
        ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
        : 0;

    const [editData, setEditData] = useState({ name: userName, campus: user?.campusId || user?.campus });
    const [activeTab, setActiveTab] = useState('rides');
    const [completedRidesFilter, setCompletedRidesFilter] = useState('offered');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingCampus, setIsEditingCampus] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordData, setPasswordData] = useState({ new: '', confirm: '' });
    const [passwordError, setPasswordError] = useState('');

    const handleSaveProfile = () => {
        if (isEditingName || isEditingCampus) {
            const nameParts = editData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            dispatch(updateCurrentUser({
                firstName,
                lastName,
                campusId: editData.campus
            }));

            if (isEditingCampus) {
                dispatch(updateUserRidesCampus({ email: user?.email, campus: editData.campus }));
            }
        }

        if (showPasswordFields) {
            if (!passwordData.new && !passwordData.confirm) {
            } else {
                if (passwordData.new !== passwordData.confirm) {
                    setPasswordError("Passwords do not match");
                    return;
                }
                if (!validatePassword(passwordData.new)) {
                    setPasswordError("Password must be 8+ chars with uppercase, lowercase & special symbol");
                    return;
                }
                dispatch(changePassword({ email: user?.email, newPassword: passwordData.new }));
            }
        }

        setIsEditingName(false);
        setIsEditingCampus(false);
        setShowPasswordFields(false);
        setShow4Fields(true);
        setIsSettingsView(false);
        setPasswordData({ new: '', confirm: '' });
        setPasswordError('');
    };

    const closePanel = () => {
        setIsSettingsView(false);
        setIsEditingName(false);
        setIsEditingCampus(false);
        setShowPasswordFields(false);
        setShow4Fields(true);
        setPasswordData({ new: '', confirm: '' });
    };

    return (
        <div className="min-h-screen bg-white text-black">

            <header className="px-8 lg:px-20 py-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" className="w-8 h-8 opacity-10" alt="" />
                    <h1 className="text-xl font-bold uppercase tracking-tight">
                        Profile
                    </h1>
                </div>
                <button
                    onClick={() => navigate('/feed')}
                    className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border-0 cursor-pointer"
                >
                    Back to Feed
                </button>
            </header>

            <main className="mx-auto max-w-3xl" style={{ padding: 'clamp(24px, 5vw, 48px) clamp(16px, 5vw, 32px)' }}>

                <div className="flex flex-col items-center" style={{ marginBottom: 'clamp(32px, 6vw, 64px)' }}>
                    <div className="relative mb-6">
                        <div className="flex items-center justify-center overflow-hidden rounded-full bg-black border-8 border-white shadow-2xl" style={{
                            width: 'clamp(96px, 15vw, 128px)',
                            height: 'clamp(96px, 15vw, 128px)',
                        }}>
                            {user?.image
                                ? <img src={user.image} className="w-full h-full object-cover" alt="profile" />
                                : <span className="text-white font-black" style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}>{userName.charAt(0)}</span>
                            }
                        </div>
                    </div>

                    <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(18px, 4vw, 26px)', marginBottom: '6px' }}>{userName}</h2>
                    <p className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-5 opacity-70">
                        Roll No: {user?.rollNo}
                    </p>

                    <div className="flex gap-3 sm:gap-4 flex-wrap justify-center mb-5">
                        <div className="flex gap-3 sm:gap-4 flex-wrap justify-center mb-5">
                            {[
                                { val: myRides.length, label: 'Rides' },
                                { val: myReviews.length, label: 'Reviews' },
                                { val: avgRating, label: 'Rating' }
                            ].map(s => (
                                <div key={s.label} className="bg-gray-50/50 border border-gray-100 text-center rounded-2xl" style={{
                                    padding: 'clamp(10px, 1.5vw, 14px) clamp(16px, 3vw, 24px)',
                                }}>
                                    <p className="text-black font-black leading-none m-0" style={{ fontSize: 'clamp(14px, 2.5vw, 18px)' }}>{s.val}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => { setEditData({ name: userName, campus: user?.campusId || user?.campus }); setIsSettingsView(true); }}
                        className="bg-black text-white px-10 py-4 rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-black/20 hover:bg-gray-900 border-0 cursor-pointer"
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="bg-gray-50/50 p-1.5 rounded-2xl flex items-center justify-center gap-1 mb-5 overflow-x-auto" style={{ marginBottom: 'clamp(20px, 4vw, 40px)' }}>
                    {[
                        { id: 'rides', label: 'My Rides', icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
                        { id: 'requested', label: 'Requested', icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
                        { id: 'completed', label: 'Completed', icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                        { id: 'reviews', label: 'Reviews', icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="rounded-lg font-black uppercase tracking-widest border-none cursor-pointer flex items-center gap-2 flex-shrink-0"
                            style={{
                                padding: 'clamp(8px, 1.5vw, 14px) clamp(12px, 2.5vw, 32px)',
                                fontSize: 'clamp(9px, 1.3vw, 11px)',
                                backgroundColor: activeTab === tab.id ? '#000' : 'transparent',
                                color: activeTab === tab.id ? '#fff' : '#9ca3af',
                                boxShadow: activeTab === tab.id ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    {activeTab === 'rides' && (
                        myRides.length > 0 ? myRides.map(ride => (
                            <div key={ride.id} className="bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-3 p-3 sm:p-6">
                                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${ride.status === 'Live' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {ride.status === 'Live'
                                            ? <div className="w-2 h-2 bg-green-500 rounded-full" />
                                            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black uppercase text-xs sm:text-sm m-0 truncate">{ride.title}</h4>
                                        <p className="font-bold text-gray-400 uppercase tracking-wider text-xs mt-1">{ride.date}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex-shrink-0 ${ride.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {ride.status}
                                </span>
                            </div>
                        )) : <EmptyState message="No rides posted" />
                    )}

                    {activeTab === 'requested' && (
                        myRequestedRides.length > 0 ? myRequestedRides.map(req => (
                            <div key={req.id} className="bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-3 p-3 sm:p-6">
                                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black uppercase text-xs sm:text-sm m-0 truncate">{req.title}</h4>
                                        <p className="font-bold text-gray-400 uppercase tracking-wider text-xs mt-1">Status: {req.status} · {req.date}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex-shrink-0 ${req.status === 'Approved' ? 'bg-green-100 text-green-800' : req.status === 'Declined' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-800'}`}>
                                    {req.status}
                                </span>
                            </div>
                        )) : <EmptyState message="No requests sent" />
                    )}

                    {activeTab === 'completed' && (
                        <div>
                            <div className="flex gap-2 mb-5 flex-wrap justify-center">
                                <button
                                    onClick={() => setCompletedRidesFilter('offered')}
                                    className="px-5 py-2.5 rounded-full font-black uppercase tracking-widest text-xs sm:text-sm border border-gray-100 cursor-pointer"
                                    style={{
                                        backgroundColor: completedRidesFilter === 'offered' ? '#000' : '#fff',
                                        color: completedRidesFilter === 'offered' ? '#fff' : '#000',
                                    }}
                                >
                                    Offer Ride
                                </button>
                                <button
                                    onClick={() => setCompletedRidesFilter('took')}
                                    className="px-5 py-2.5 rounded-full font-black uppercase tracking-widest text-xs sm:text-sm border border-gray-100 cursor-pointer"
                                    style={{
                                        backgroundColor: completedRidesFilter === 'took' ? '#000' : '#fff',
                                        color: completedRidesFilter === 'took' ? '#fff' : '#000',
                                    }}
                                >
                                    Took Ride
                                </button>
                            </div>

                            {completedRidesFilter === 'offered' ? (
                                completedOfferedRides.length > 0 ? completedOfferedRides.map(ride => (
                                    <div key={ride.id} className="bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-3 p-3 sm:p-6 mb-3">
                                        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-black uppercase text-xs sm:text-sm m-0 truncate">{ride.title}</h4>
                                                <p className="font-bold text-gray-400 uppercase tracking-wider text-xs mt-1">{ride.date}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-green-100 text-green-800 flex-shrink-0">
                                            Done
                                        </span>
                                    </div>
                                )) : <EmptyState message="No offers completed" />
                            ) : (
                                completedTookRides.length > 0 ? completedTookRides.map(req => (
                                    <div key={req.id} className="bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-3 p-3 sm:p-6 mb-3">
                                        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-black uppercase text-xs sm:text-sm m-0 truncate">{req.title}</h4>
                                                <p className="font-bold text-gray-400 uppercase tracking-wider text-xs mt-1">Ride: {req.rider} · {req.date}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-green-100 text-green-800 flex-shrink-0">
                                            Approved
                                        </span>
                                    </div>
                                )) : <EmptyState message="No rides taken" />
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        myReviews.length > 0 ? myReviews.map(rev => (
                            <div key={rev.id} className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-8">
                                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                                            <span className="text-white text-xs font-black">{rev.user.charAt(0)}</span>
                                        </div>
                                        <span className="text-sm sm:text-base font-black text-black">{rev.user}</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-sm ${i < rev.rating ? 'text-black' : 'text-gray-100'}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">"{rev.comment}"</p>
                            </div>
                        )) : <EmptyState message="No reviews yet" />
                    )}
                </div>
            </main>

            {isSettingsView && (
                <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
                    <div className="px-8 lg:px-20 py-12">

                        <div className="flex items-center justify-between mb-16">
                            <button
                                onClick={closePanel}
                                className="flex items-center gap-3 text-black font-black uppercase tracking-widest text-[10px] group"
                            >
                                <div className="p-3 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                                </div>
                                Go Back
                            </button>
                            <div className="text-right">
                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Settings</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                            <div className="lg:w-48 space-y-1">
                                <button
                                    onClick={() => { setShow4Fields(true); setShowPasswordFields(false); }}
                                    className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border-0 cursor-pointer ${show4fields ? 'bg-black text-white' : 'bg-transparent text-gray-400 hover:text-black hover:bg-gray-50'}`}
                                >
                                    Account
                                </button>
                                <button
                                    onClick={() => { setShowPasswordFields(true); setShow4Fields(false); }}
                                    className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border-0 cursor-pointer ${showPasswordFields ? 'bg-black text-white' : 'bg-transparent text-gray-400 hover:text-black hover:bg-gray-50'}`}
                                >
                                    Security
                                </button>
                            </div>

                            <div className="flex-1 max-w-2xl">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-3xl bg-black overflow-hidden flex items-center justify-center border-4 border-gray-50 shadow-xl relative">
                                            {user?.image
                                                ? <img src={user.image} className="w-full h-full object-cover" alt="profile" />
                                                : <span className="text-white text-2xl font-black">{userName.charAt(0)}</span>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black uppercase tracking-tight m-0 leading-none">{userName}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest m-0 mt-1.5">{getCampuses().find(c => c.id === user?.campusId)?.name || user?.campusId} · Fast Student</p>
                                    </div>
                                </div>

                                {show4fields && (
                                    <div className="grid grid-cols-1 gap-4">
                                        <InfoCard label="University ID" value={user?.rollNo} />
                                        <InfoCard label="Official Email" value={user?.email} />

                                        <div className="bg-gray-50/50 border border-gray-100 px-6 py-4 rounded-2xl relative flex flex-col justify-center hover:bg-white hover:shadow-lg hover:shadow-black/[0.01] group">
                                            <h5 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1.5">Preferred Name</h5>
                                            {isEditingName
                                                ? <input type="text" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} className="w-full bg-white border border-gray-100 rounded-xl p-2.5 text-xs font-black outline-none shadow-sm focus:ring-1 focus:ring-black/5" autoFocus />
                                                : <p className="text-sm font-black text-black m-0 tracking-tight">{userName}</p>
                                            }
                                            <EditButton active={isEditingName} onClick={() => setIsEditingName(!isEditingName)} />
                                        </div>

                                        <div className="bg-gray-50/50 border border-gray-100 px-6 py-4 rounded-2xl relative flex flex-col justify-center hover:bg-white hover:shadow-lg hover:shadow-black/[0.01] group">
                                            <h5 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1.5">Base Campus</h5>
                                            {isEditingCampus
                                                ? <select value={editData.campus} onChange={e => setEditData({ ...editData, campus: e.target.value })} className="w-full bg-white border border-gray-100 rounded-xl p-2.5 text-xs font-black outline-none shadow-sm focus:ring-1 focus:ring-black/5 appearance-none" autoFocus>
                                                    {getCampuses().map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                </select>
                                                : <p className="text-sm font-black text-black m-0 tracking-tight">{getCampuses().find(c => c.id === user?.campusId)?.name || user?.campusId}</p>
                                            }
                                            <EditButton active={isEditingCampus} onClick={() => setIsEditingCampus(!isEditingCampus)} />
                                        </div>
                                    </div>
                                )}

                                {showPasswordFields && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            {[{ label: 'New Password', key: 'new' }, { label: 'Re-enter Password', key: 'confirm' }].map(f => (
                                                <div key={f.key} className="bg-gray-50/50 border border-gray-100 px-6 py-5 rounded-2xl">
                                                    <h5 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3">{f.label}</h5>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="w-full bg-white border border-gray-100 rounded-xl p-3 text-xs font-black outline-none shadow-sm focus:ring-1 focus:ring-black/5"
                                                        value={passwordData[f.key]}
                                                        onChange={e => setPasswordData({ ...passwordData, [f.key]: e.target.value })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {passwordError && (
                                            <div className="px-6 py-3 bg-red-50 rounded-xl border border-red-100 text-red-600 font-bold uppercase tracking-widest text-[9px]">
                                                {passwordError}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(showPasswordFields || isEditingName || isEditingCampus) && (
                                    <div className="mt-10 flex flex-col items-center gap-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="px-10 py-3.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-gray-900 border-0 cursor-pointer w-full max-w-xs"
                                        >
                                            Apply Changes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPasswordFields(false);
                                                setShow4Fields(true);
                                                setIsEditingName(false);
                                                setIsEditingCampus(false);
                                                setPasswordData({ new: '', confirm: '' });
                                                setPasswordError('');
                                            }}
                                            className="text-[9px] font-black text-gray-300 hover:text-black uppercase tracking-[0.2em] border-0 bg-transparent cursor-pointer"
                                        >
                                            Discard Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

const InfoCard = ({ label, value }) => (
    <div className="bg-gray-50/20 border border-gray-100 px-6 py-4 rounded-2xl min-h-[70px] flex flex-col justify-center">
        <h5 className="text-[9px] font-black text-gray-200 uppercase tracking-[0.2em] mb-1.5">{label}</h5>
        <p className="font-black m-0 break-all text-xs text-gray-400 tracking-tight">{value}</p>
    </div>
);

const EditButton = ({ active, onClick }) => (
    <button
        onClick={onClick}
        className={`absolute top-1/2 -translate-y-8 right-2 w-6 h-6 rounded-lg border flex items-center justify-center cursor-pointer ${active ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-100 hover:text-black hover:border-black'}`}
    >
        {active ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        )}
    </button>
);

const EmptyState = ({ message }) => (
    <div className="text-center py-20 sm:py-40 px-5 opacity-20">
        <h3 className="font-black uppercase tracking-widest" style={{ fontSize: 'clamp(14px, 3vw, 20px)' }}>{message}</h3>
    </div>
);

export default ProfilePage;