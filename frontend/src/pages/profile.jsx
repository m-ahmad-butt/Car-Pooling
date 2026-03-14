import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { getCampuses, validatePassword } from '../utils/method';
import { updateProfile } from '../features/userSlice';
import { useClerk } from "@clerk/clerk-react";

const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { openUserProfile } = useClerk();

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

    const completedOfferedRides = myRides.filter(r => r.status === "Done");
    const completedTookRides = myRequestedRides.filter(r => r.status === "Approved");

    const avgRating = myReviews.length > 0
        ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
        : 0;

    const [editData, setEditData] = useState({ name: userProfile.name, campus: userProfile.campus });
    const [activeTab, setActiveTab] = useState('rides');
    const [completedRidesFilter, setCompletedRidesFilter] = useState('offered');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingCampus, setIsEditingCampus] = useState(false);

    const handleSaveProfile = () => {
        if (isEditingName || isEditingCampus) {
            dispatch(updateProfile({ name: editData.name, campus: editData.campus }));
        }

        setIsEditingName(false);
        setIsEditingCampus(false);
        setShow4Fields(true);
        setShowEditPanel(false);
    };

    const closePanel = () => {
        setShowEditPanel(false);
        setIsEditingName(false);
        setIsEditingCampus(false);
        setShow4Fields(true);
    };

    return (
        <div className="min-h-screen bg-white text-black">

            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-sm flex items-center justify-between" style={{
                padding: 'clamp(12px, 3vw, 24px) clamp(16px, 5vw, 80px)',
            }}>
                <h1 className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-tight">
                    Profile
                </h1>
                <button
                    onClick={() => navigate('/feed')}
                    className="bg-black text-white rounded-full font-black uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap hover:bg-gray-900 transition"
                    style={{
                        padding: 'clamp(8px, 1.5vw, 10px) clamp(14px, 3vw, 24px)',
                    }}
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
                            {userProfile.image
                                ? <img src={userProfile.image} className="w-full h-full object-cover" alt="profile" />
                                : <span className="text-white font-black" style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}>{userProfile.name.charAt(0)}</span>
                            }
                        </div>
                    </div>

                    <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(18px, 4vw, 26px)', marginBottom: '6px' }}>{userProfile.name}</h2>
                    <p className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-5 opacity-70">
                        Roll No: {userProfile.rollNo}
                    </p>

                    <div className="flex gap-3 sm:gap-4 flex-wrap justify-center mb-5">
                        {[{ val: myRides.length, label: 'Rides' }, { val: avgRating, label: 'Rating' }].map(s => (
                            <div key={s.label} className="bg-gray-50/50 border border-gray-100 text-center rounded-2xl" style={{
                                padding: 'clamp(12px, 2vw, 16px) clamp(24px, 5vw, 40px)',
                            }}>
                                <p className="text-black font-black leading-none m-0" style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}>{s.val}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => { setEditData({ name: userProfile.name, campus: userProfile.campus }); setShowEditPanel(true); }}
                        className="bg-gray-100 text-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition"
                        style={{
                            marginTop: 'clamp(20px, 4vw, 32px)',
                            padding: 'clamp(10px, 1.5vw, 12px) clamp(20px, 4vw, 32px)',
                        }}
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
                            className="rounded-lg font-black uppercase tracking-widest border-none cursor-pointer flex items-center gap-2 flex-shrink-0 transition-all"
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
                                    className="px-5 py-2.5 rounded-full font-black uppercase tracking-widest text-xs sm:text-sm border border-gray-100 cursor-pointer transition-all"
                                    style={{
                                        backgroundColor: completedRidesFilter === 'offered' ? '#000' : '#fff',
                                        color: completedRidesFilter === 'offered' ? '#fff' : '#000',
                                    }}
                                >
                                    Offer Ride
                                </button>
                                <button
                                    onClick={() => setCompletedRidesFilter('took')}
                                    className="px-5 py-2.5 rounded-full font-black uppercase tracking-widest text-xs sm:text-sm border border-gray-100 cursor-pointer transition-all"
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

            {showEditPanel && show4fields && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8">
                    <div onClick={closePanel} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    <div className="relative bg-white rounded-xl sm:rounded-3xl shadow-2xl p-5 sm:p-12 z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closePanel}
                            className="absolute top-3 sm:top-6 right-3 sm:right-6 w-9 h-9 rounded-full bg-gray-100 border-0 cursor-pointer flex items-center justify-center text-gray-400 z-20 hover:bg-gray-200"
                        >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="flex justify-center mb-10">
                            <div className="relative">
                                <div className="overflow-hidden rounded-full bg-black border-6 border-white shadow-lg flex items-center justify-center" style={{
                                    width: 'clamp(80px, 12vw, 128px)',
                                    height: 'clamp(80px, 12vw, 128px)',
                                }}>
                                    {userProfile.image
                                        ? <img src={userProfile.image} className="w-full h-full object-cover" alt="profile" />
                                        : <span className="text-white font-black" style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}>{(userProfile.name || 'U').charAt(0)}</span>
                                    }
                                </div>
                            </div>
                        </div>

                        {show4fields && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-5 sm:mb-10">
                                <InfoCard label="Roll Number" value={userProfile.rollNo} />

                                <div className="bg-gray-100 p-4 sm:p-7 rounded-2xl relative">
                                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Full Name</h5>
                                    {isEditingName
                                        ? <input type="text" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} className="w-full bg-white/50 border-0 rounded-xl p-2.5 sm:p-3.5 font-black outline-none box-border" autoFocus />
                                        : <p className="font-black m-0" style={{ fontSize: 'clamp(14px, 2.5vw, 17px)' }}>{userProfile.name || 'User'}</p>
                                    }
                                    <EditButton active={isEditingName} onClick={() => setIsEditingName(!isEditingName)} />
                                </div>

                                <div className="bg-gray-100 p-4 sm:p-7 rounded-2xl relative">
                                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Campus</h5>
                                    {isEditingCampus
                                        ? <select value={editData.campus} onChange={e => setEditData({ ...editData, campus: e.target.value })} className="w-full bg-white/50 border-0 rounded-xl p-2.5 sm:p-3.5 font-black outline-none box-border" autoFocus>
                                            {getCampuses().map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                        : <p className="font-black m-0" style={{ fontSize: 'clamp(14px, 2.5vw, 17px)' }}>{getCampuses().find(c => c.id === userProfile.campus)?.name || userProfile.campus || 'NUCES'}</p>
                                    }
                                    <EditButton active={isEditingCampus} onClick={() => setIsEditingCampus(!isEditingCampus)} />
                                </div>

                                <InfoCard label="Email Address" value={userProfile.email} />
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-3">
                            <button
                                onClick={() => {
                                    if (isEditingName || isEditingCampus) {
                                        handleSaveProfile();
                                    } else {
                                        closePanel();
                                    }
                                }}
                                className="bg-black text-white rounded-full font-black uppercase tracking-widest text-xs sm:text-sm w-full max-w-80 shadow-lg hover:bg-gray-900 transition"
                                style={{ padding: 'clamp(14px, 2.5vw, 20px)' }}
                            >
                                {(isEditingName || isEditingCampus) ? 'Save Changes' : 'Close'}
                            </button>
                            
                            {!(isEditingName || isEditingCampus) && (
                                <button
                                    onClick={() => openUserProfile()}
                                    className="bg-gray-100 text-black rounded-full font-black uppercase tracking-widest text-xs sm:text-sm w-full max-w-80 hover:bg-gray-200 transition flex justify-center items-center gap-2"
                                    style={{ padding: 'clamp(14px, 2.5vw, 20px)' }}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-1.998A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" /></svg>
                                    Security Settings
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
    <div className="bg-gray-100 p-4 sm:p-7 rounded-2xl">
        <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">{label}</h5>
        <p className="font-black m-0 break-all" style={{ fontSize: 'clamp(13px, 2.5vw, 17px)' }}>{value}</p>
    </div>
);

const EditButton = ({ active, onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-3 sm:top-6 right-3 sm:right-6 w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer flex items-center justify-center"
    >
        <svg className="w-4.5 h-4.5" style={{ color: active ? '#000' : 'rgba(0,0,0,0.25)' }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
    </button>
);

const EmptyState = ({ message }) => (
    <div className="text-center py-20 sm:py-40 px-5 opacity-20">
        <h3 className="font-black uppercase tracking-widest" style={{ fontSize: 'clamp(14px, 3vw, 20px)' }}>{message}</h3>
    </div>
);

export default ProfilePage;