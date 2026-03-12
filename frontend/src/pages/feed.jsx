import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReviewModal } from '../hooks/useReviewModal';
import { usePostRide } from '../hooks/usePostRide';
import { useSelector, useDispatch } from 'react-redux';
import RideCard from '../components/rideCard';
import RideDetails from '../components/rideDetails';
import Notifications from '../components/notifications';
import ProfileMenu from '../components/profileMenu';
import RequestRide from '../components/requestRide';
import PostRide from '../components/postRide';
import Footer from '../components/footer';
import {
    addRide,
    setFilters,
    setActiveTab,
    clearOngoingRide,
    setNeedsReview,
    addReviewToRide,
    updateRiderRatings
} from '../features/rideSlice';
import { addRequest } from '../features/requestSlice';
import { addReview } from '../features/reviewSlice';
import { getCampuses, validatePhone, validateVehicleNumber } from '../utils/method';
import { logoutAuth } from '../features/authSlice';
import { logoutUser, refreshUserStats } from '../features/userSlice';
import toast from 'react-hot-toast';

const Feed = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux states
    const rides = useSelector(state => state.rides.rides);
    const ongoingRide = useSelector(state => state.rides.ongoingRide);
    const needsReviewBy = useSelector(state => state.rides.needsReviewBy);
    const filters = useSelector(state => state.rides.filters);
    const activeTab = useSelector(state => state.rides.activeTab);
    const reviews = useSelector(state => state.reviews.reviews);
    const userProfile = useSelector(state => state.user.profile);
    const allNotifications = useSelector(state => state.notifications.notifications);
    const notifications = allNotifications.filter(n => n.targetEmail === userProfile.email || n.targetEmail === 'all');

    // Local UI states
    const [selectedRide, setSelectedRide] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [postErrors, setPostErrors] = useState({});

    const {
        showReviewModal,
        reviewRating,
        setReviewRating,
        reviewText,
        setReviewText,
        openReviewModal,
        closeReviewModal,
    } = useReviewModal();

    const {
        showPostModal,
        setShowPostModal,
        postForm,
        handlePostFormChange,
        resetPostForm,
    } = usePostRide(userProfile.contactNo);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        const riderEmail = ongoingRide ? ongoingRide.riderEmail : needsReviewBy.riderEmail;
        const requesterEmail = ongoingRide ? ongoingRide.requesterEmail : needsReviewBy.requesterEmail;
        const rideId = ongoingRide ? ongoingRide.rideId : needsReviewBy.rideId;

        if (riderEmail && requesterEmail) {
            const role = userProfile.email === riderEmail ? 'rider' : 'requester';
            const targetEmail = role === 'rider' ? requesterEmail : riderEmail;
            
            dispatch(addReview({
                rideId: rideId,
                targetEmail: targetEmail,
                user: userProfile.name,
                rating: reviewRating,
                comment: reviewText,
            }));

            dispatch(addReviewToRide({
                rideId: rideId,
                review: { user: userProfile.name, rating: reviewRating, comment: reviewText }
            }));

            const newReview = { targetEmail, rating: reviewRating };
            const allTargetReviews = [...reviews.filter(r => r.targetEmail === targetEmail), newReview];
            const newAvgRating = Number((allTargetReviews.reduce((acc, curr) => acc + curr.rating, 0) / allTargetReviews.length).toFixed(1));

            dispatch(refreshUserStats({ 
                email: targetEmail, 
                reviews: [...reviews, newReview] 
            }));

            dispatch(updateRiderRatings({
                email: targetEmail,
                rating: newAvgRating
            }));

            dispatch(setNeedsReview({ role, value: false }));
        }
        closeReviewModal();
    };

    const handleAcceptSimulation = (note, ride) => {
        dispatch(addRequest({
            rideId: ride.id,
            requesterName: userProfile.name,
            requesterEmail: userProfile.email,
            requesterAvatar: userProfile.image,
            requesterRating: userProfile.stats.rating,
            ride: ride.title,
            rideDate: ride.date,
            seats: 1,
            note: note,
        }));
    };

    const isUserInOngoingRide = ongoingRide && (
        ongoingRide.riderEmail === userProfile.email ||
        ongoingRide.requesterEmail === userProfile.email
    );

    const userRole = (ongoingRide && userProfile.email === ongoingRide.riderEmail) || 
                    (!ongoingRide && userProfile.email === needsReviewBy.riderEmail) ? 'rider' : 
                    ((ongoingRide && userProfile.email === ongoingRide.requesterEmail) || 
                    (!ongoingRide && userProfile.email === needsReviewBy.requesterEmail) ? 'requester' : null);

    const userNeedsReview = (userRole === 'rider' && needsReviewBy.riderNeedsReview) || 
                           (userRole === 'requester' && needsReviewBy.requesterNeedsReview);

    const handleCompleteSimulation = () => {
        dispatch(clearOngoingRide());
    };

    const filteredRides = rides.filter(ride => {
        if (ride.status === 'Done') return false;
        
        const term = filters.searchTerm.toLowerCase();
        const matchesSearch = !term ||
            ride.title.toLowerCase().includes(term) ||
            (ride.description && ride.description.toLowerCase().includes(term)) ||
            (ride.location && ride.location.toLowerCase().includes(term)) ||
            (ride.destination && ride.destination.toLowerCase().includes(term)) ||
            (ride.riderName && ride.riderName.toLowerCase().includes(term));
        const matchesCampus = filters.campus === 'All Campuses' || ride.campus === filters.campus;
        const matchesCategory = filters.category === 'All Categories' || ride.vehicleType === filters.category;
        return matchesSearch && matchesCampus && matchesCategory;
    });

    const handlePostRide = (e) => {
        e.preventDefault();

        const errors = {};
        if (!validatePhone(postForm.contactNumber)) {
            errors.contactNumber = "Contact number must start with 03 and be 11 digits";
        }

        if (!validateVehicleNumber(postForm.vehicleNumber)) {
            errors.vehicleNumber = "Vehicle number must be like LEC-1234 (3+ letters - 4 digits)";
        }

        const seatCount = parseInt(postForm.seats);
        if (isNaN(seatCount) || seatCount <= 0) {
            errors.seats = "Please enter a valid number of seats (at least 1)";
        }

        if (Object.keys(errors).length > 0) {
            setPostErrors(errors);
            toast.error("Please fix the errors in the form");
            return;
        }

        setPostErrors({});

        dispatch(addRide({
            title: postForm.title,
            description: postForm.description,
            campus: postForm.campus,
            vehicleType: postForm.vehicleType,
            vehicleNumber: postForm.vehicleNumber,
            seats: parseInt(postForm.seats) || 1,
            riderName: userProfile.name,
            riderEmail: userProfile.email,
            riderRating: userProfile.stats.rating,
            date: "Just now",
            departureTime: postForm.departureTime,
            contactNumber: postForm.contactNumber,
            location: postForm.location,
            destination: postForm.destination,
        }));
        setShowPostModal(false);
        resetPostForm();
        toast.success("Ride posted successfully!");
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

            <header className="px-8 lg:px-20 pt-10 pb-6 border-b border-gray-50 bg-white">
                <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
                    {/* R1: Main Navigation */}
                    <div className="flex items-center justify-between gap-6 lg:gap-8 sticky top-0 py-4 bg-white z-[60] -mt-4">
                        {/* Title + Desktop Search */}
                        <div className="flex items-center lg:justify-start lg:flex-1 gap-6">
                            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight uppercase whitespace-nowrap leading-none">
                                Feed
                            </h1>

                            {/* Desktop Search */}
                            <div className="hidden lg:flex items-center gap-6 flex-1 max-w-2xl">
                                <div className="h-8 w-[1.5px] bg-gray-100"></div>
                                <div className="relative group flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search for rides, doston, or places..."
                                        value={filters.searchTerm}
                                        onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-6 text-sm font-semibold focus:ring-2 focus:ring-black/5 transition-all outline-none placeholder:text-gray-400"
                                    />
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>

                        </div>

                        {/* Mobile Hamburger */}
                        <div className="lg:hidden ml-auto">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${showMobileMenu ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={showMobileMenu ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>

                        {/* Right: Desktop Action options */}
                        <div className="hidden lg:flex items-center gap-4">
                            <button
                                onClick={() => setShowPostModal(true)}
                                className="bg-black text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] transition-all hover:bg-gray-800 shadow-xl shadow-black/10"
                            >
                                Post a Ride
                            </button>

                            {/* Notifications (Desktop) */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 hover:bg-gray-50 transition-all group relative"
                                >
                                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                    {notifications.length > 0 && (
                                        <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] font-black text-white flex items-center justify-center">{notifications.length}</span>
                                    )}
                                </button>
                                {showNotifications && <Notifications notifications={notifications} onClose={() => setShowNotifications(false)} />}
                            </div>

                            <div className="flex items-center gap-3 pl-6 border-l border-gray-100 relative">
                                <div className="text-right">
                                    <p className="text-[11px] font-black uppercase leading-none">{userProfile.name}</p>
                                    <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">FAST {userProfile.campus}</p>
                                </div>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="w-10 h-10 rounded-full bg-black flex items-center justify-center border-4 border-white shadow-lg overflow-hidden transition-all"
                                >
                                    {userProfile.image
                                        ? <img src={userProfile.image} className="w-full h-full object-cover" alt="profile" />
                                        : <span className="text-white text-xs font-black italic">{userProfile.name.charAt(0)}</span>
                                    }
                                </button>
                                {showProfileMenu && <ProfileMenu onClose={() => setShowProfileMenu(false)} />}
                            </div>
                        </div>
                    </div>

                    {/* R2: Tabs and Filters */}
                    <div className={`${showMobileMenu ? 'hidden lg:flex' : 'flex'} flex-col lg:flex-row justify-between lg:items-center gap-4`}>
                        <div className="lg:flex bg-gray-100/50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar hidden">
                            {['All Rides', 'Requests'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => dispatch(setActiveTab(tab))}
                                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Status [Combo Box] */}
                        <div className="lg:hidden relative w-full">
                            <select
                                value={activeTab}
                                onChange={(e) => dispatch(setActiveTab(e.target.value))}
                                className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-xl text-sm font-bold tracking-tight outline-none focus:ring-1 focus:ring-black/5 transition-colors appearance-none"
                            >
                                {['All Rides', 'Requests'].map(tab => (
                                    <option key={tab} value={tab}>{tab}</option>
                                ))}
                            </select>
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7" /></svg>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>

                        {activeTab !== 'Requests' && (
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                <div className="relative flex-1 lg:w-64">
                                    <select
                                        value={filters.campus}
                                        onChange={(e) => dispatch(setFilters({ campus: e.target.value }))}
                                        className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-xl text-sm font-bold tracking-tight outline-none focus:ring-1 focus:ring-black/5 transition-colors appearance-none"
                                    >
                                        <option>All Campuses</option>
                                        {getCampuses().map(campus => (
                                            <option key={campus.id} value={campus.name}>{campus.name}</option>
                                        ))}
                                    </select>
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                <div className="relative flex-1 lg:w-64">
                                    <select
                                        value={filters.category}
                                        onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
                                        className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-xl text-sm font-bold tracking-tight outline-none focus:ring-1 focus:ring-black/5 transition-colors appearance-none"
                                    >
                                        <option>All Categories</option>
                                        <option value="CAR">Cars</option>
                                        <option value="BIKE">Bikes</option>
                                    </select>
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </header>

            {/* Mobile Menu CONTENT */}
            {showMobileMenu && (
                <div className="lg:hidden fixed inset-0 bg-white z-[90] overflow-y-auto">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 sticky top-0 bg-white z-10">
                        <h1 className="text-2xl font-black tracking-tighter uppercase">Feed</h1>
                        <button
                            onClick={() => setShowMobileMenu(false)}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="px-8 py-10 space-y-12">
                        {/* Search removed from mobile menu - now on feed page */}

                        {/* Nav Links */}
                        <nav className="space-y-2">
                            <button
                                onClick={() => { setShowPostModal(true); setShowMobileMenu(false); }}
                                className="w-full flex items-center gap-5 px-4 py-4 rounded-2xl text-gray-800 font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Post a Ride
                            </button>

                            <button
                                onClick={() => { setShowNotifications(true); setShowMobileMenu(false); }}
                                className="w-full flex items-center justify-between px-4 py-4 rounded-2xl text-gray-800 font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-5">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    Notifications
                                </div>
                                {notifications.length > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">{notifications.length}</span>
                                )}
                            </button>

                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="w-full flex items-center gap-5 px-4 py-4 rounded-2xl text-gray-800 font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                View Profile
                            </button>
                        </nav>

                        {/* Logout */}
                        <div className="border-t border-gray-100 pt-6">
                            <button
                                onClick={() => {
                                    dispatch(logoutAuth());
                                    dispatch(logoutUser());
                                    navigate('/login');
                                    setShowMobileMenu(false);
                                }}
                                className="w-full flex items-center gap-5 px-4 py-4 rounded-2xl text-red-500 font-bold text-sm uppercase tracking-wide hover:bg-red-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="lg:hidden">
                {showNotifications && <Notifications notifications={notifications} onClose={() => setShowNotifications(false)} />}
            </div>

            {/* Write Review */}
            {showReviewModal && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-8">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeReviewModal}
                    />
                    {/* Panel */}
                    <div className="relative bg-white w-full sm:max-w-lg rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl p-8 sm:p-10 z-10">
                        {/* Close */}
                        <button
                            onClick={closeReviewModal}
                            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-black transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-black tracking-tight uppercase mb-1">Leave a Review</h2>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">Rate your recent ride</p>

                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            {/* Star Rating */}
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className={`text-3xl transition-colors ${star <= reviewRating ? 'text-black' : 'text-gray-200'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* REVIEWS */}
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Comment</label>
                                <textarea
                                    rows={4}
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                    placeholder="Share your experience with this ride..."
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-medium focus:ring-1 focus:ring-black/5 outline-none resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={reviewRating === 0}
                                className="w-full bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="px-8 lg:px-20 py-0 max-w-7xl mx-auto">

                {/* Mobile Search Bar - visible on mobile only */}
                {activeTab !== 'Requests' && (
                    <div className="lg:hidden mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for rides..."
                                value={filters.searchTerm}
                                onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-6 pr-16 text-sm font-bold focus:ring-1 focus:ring-black/5 outline-none tracking-tight"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white pointer-events-none">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab !== 'Requests' && (isUserInOngoingRide || userNeedsReview) && (
                    <div className="mb-10 space-y-4">
                        {isUserInOngoingRide && (
                            <div className="bg-black text-white p-6 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl shadow-black/20">
                                <div className="flex items-center gap-6 text-center sm:text-left">
                                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-1">Ongoing Ride</h4>
                                        <p className="text-xl font-bold tracking-tight uppercase whitespace-nowrap">Ride with {ongoingRide.rider}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCompleteSimulation}
                                    className="bg-white text-black px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl"
                                >
                                    End Ride
                                </button>
                            </div>
                        )}

                        {userNeedsReview && (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                                        <span className="text-white text-xl">★</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Feedback Required</h4>
                                        <p className="text-xl font-black italic tracking-tighter uppercase text-black">How was your ride?</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={openReviewModal}
                                        className="bg-black text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
                                    >Write Review</button>
                                    <button onClick={() => dispatch(setNeedsReview({ role: userRole, value: false }))} className="text-gray-400 font-bold text-xs hover:text-black">Skip</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === "Requests" && (
                    <RequestRide />
                )}

                {activeTab !== "Requests" && (
                    filteredRides.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredRides.map((ride, index) => (
                                <RideCard
                                    key={`${ride.id}-${index}`}
                                    ride={ride}
                                    onViewDetails={(r) => setSelectedRide(r)}
                                    isOwnRide={ride.riderEmail === userProfile.email}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 mt-12 text-center opacity-40 min-h-[50vh] flex items-center justify-center rounded-[2rem]">
                            <p className="text-2xl font-black uppercase tracking-widest text-black/50">No posts!!</p>
                        </div>
                    )
                )}

            </main>

            {/* Ride Details */}
            {selectedRide && (
                <RideDetails
                    ride={selectedRide}
                    onClose={() => setSelectedRide(null)}
                    onAccept={(note) => {
                        handleAcceptSimulation(note, selectedRide);
                        setSelectedRide(null);
                    }}
                />
            )}

            {/* Post Ride Modal */}
            <PostRide 
                showPostModal={showPostModal}
                setShowPostModal={setShowPostModal}
                postForm={postForm}
                handlePostFormChange={handlePostFormChange}
                handlePostRide={handlePostRide}
                postErrors={postErrors}
                setPostErrors={setPostErrors}
            />

            <Footer />
        </div>
    );
};

export default Feed;
