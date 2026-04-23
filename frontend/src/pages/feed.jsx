import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RideDetails from '../components/rideDetails';
import ProfileMenu from '../components/profileMenu';
import RequestRide from '../components/requestRide';
import PostRide from '../components/postRide';
import Footer from '../components/footer';
import FeedHeader from '../components/feedHeader';
import FeedMobileMenu from '../components/feedMobileMenu';
import ReviewModal from '../components/reviewModal';
import OngoingRideNotification from '../components/ongoingRideNotification';
import MobileSearchBar from '../components/mobileSearchBar';
import RidesList from '../components/ridesList';
import {
    createRideAsync,
    clearOngoingRide,
    setNeedsReview,
    fetchRides
} from '../features/rideSlice';
import { createRequestAsync } from '../features/requestSlice';
import { createReviewAsync } from '../features/reviewSlice';
import { validatePhone, validateVehicleNumber } from '../utils/method';
import { createNotificationAsync } from '../features/notificationSlice';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';

const Feed = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    useEffect(() => {
        dispatch(fetchRides(getToken));
    }, [dispatch, getToken]);

    const rides = useSelector(state => state.rides.rides);
    const ongoingRide = useSelector(state => state.rides.ongoingRide);
    const needsReviewBy = useSelector(state => state.rides.needsReviewBy);
    const filters = useSelector(state => state.rides.filters);
    const activeTab = useSelector(state => state.rides.activeTab);
    const reviews = useSelector(state => state.reviews.reviews);
    const userProfile = useSelector(state => state.user.profile);
    const allNotifications = useSelector(state => state.notifications.notifications);
    const notifications = allNotifications.filter(n => n.targetEmail === userProfile.email || n.targetEmail === 'all');

    const [selectedRide, setSelectedRide] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [postErrors, setPostErrors] = useState({});

    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const openReviewModal = () => setShowReviewModal(true);
    const closeReviewModal = () => {
        setShowReviewModal(false);
        setReviewRating(0);
        setReviewText('');
    };

    // Post Ride Modal State
    const [showPostModal, setShowPostModal] = useState(false);
    const [postForm, setPostForm] = useState({
        title: '', vehicleType: '', campus: '', vehicleNumber: '',
        seats: '', departureTime: '', contactNumber: userProfile.contactNo, location: '',
        destination: '', description: '',
    });

    const handlePostFormChange = (field, value) => {
        setPostForm(prev => ({ ...prev, [field]: value }));
    };

    const resetPostForm = () => {
        setPostForm({
            title: '', vehicleType: '', campus: '', vehicleNumber: '',
            seats: '', departureTime: '', contactNumber: userProfile.contactNo, location: '',
            destination: '', description: '',
        });
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        const riderEmail = ongoingRide ? ongoingRide.riderEmail : needsReviewBy.riderEmail;
        const requesterEmail = ongoingRide ? ongoingRide.requesterEmail : needsReviewBy.requesterEmail;
        const rideId = ongoingRide ? ongoingRide.rideId : needsReviewBy.rideId;

        if (riderEmail && requesterEmail) {
            const role = userProfile.email === riderEmail ? 'rider' : 'requester';
            const targetEmail = role === 'rider' ? requesterEmail : riderEmail;
            
            dispatch(createReviewAsync({
                reviewData: {
                    rideId: rideId,
                    targetEmail: targetEmail,
                    user: userProfile.name,
                    rating: reviewRating,
                    comment: reviewText,
                },
                getToken
            }));

            dispatch(createNotificationAsync({
                notificationData: {
                    targetEmail: targetEmail,
                    from: userProfile.email,
                    message: `You received a new ${role === 'rider' ? 'rider' : 'requester'} review from ${userProfile.name}!`,
                    type: 'review'
                },
                getToken
            }));

            dispatch(fetchRides(getToken));
            dispatch(setNeedsReview({ role, value: false }));
        }
        closeReviewModal();
    };

    const handleAcceptSimulation = (note, ride) => {
        dispatch(createRequestAsync({
            requestData: {
                rideId: ride.id || ride._id,
                requesterName: userProfile.name,
                requesterEmail: userProfile.email,
                requesterAvatar: userProfile.image,
                requesterRating: userProfile.stats.rating,
                ride: ride.title,
                rideDate: ride.date,
                seats: 1,
                note: note,
            },
            getToken
        }));

        dispatch(createNotificationAsync({
            notificationData: {
                targetEmail: ride.riderEmail,
                from: userProfile.email,
                message: `${userProfile.name} requested your ride: ${ride.title}`,
                type: 'request'
            },
            getToken
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
            return;
        }

        setPostErrors({});

        dispatch(createRideAsync({
            rideData: {
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
            },
            getToken
        }));
        setShowPostModal(false);
        resetPostForm();
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

            <FeedHeader 
                showMobileMenu={showMobileMenu}
                setShowMobileMenu={setShowMobileMenu}
                setShowPostModal={setShowPostModal}
                notifications={notifications}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                userProfile={userProfile}
                setShowProfileMenu={setShowProfileMenu}
                showProfileMenu={showProfileMenu}
                ProfileMenu={ProfileMenu}
            />

            <FeedMobileMenu 
                showMobileMenu={showMobileMenu}
                setShowMobileMenu={setShowMobileMenu}
                setShowPostModal={setShowPostModal}
                setShowNotifications={setShowNotifications}
                notifications={notifications}
                navigate={navigate}
            />



            <ReviewModal
                showReviewModal={showReviewModal}
                closeReviewModal={closeReviewModal}
                handleSubmitReview={handleSubmitReview}
                reviewRating={reviewRating}
                setReviewRating={setReviewRating}
                reviewText={reviewText}
                setReviewText={setReviewText}
            />

            <main className="px-8 lg:px-20 py-0 max-w-7xl mx-auto">

                <MobileSearchBar activeTab={activeTab} />

                {activeTab !== 'Requests' && (isUserInOngoingRide || userNeedsReview) && (
                    <OngoingRideNotification
                        isUserInOngoingRide={isUserInOngoingRide}
                        ongoingRide={ongoingRide}
                        handleCompleteSimulation={handleCompleteSimulation}
                        userNeedsReview={userNeedsReview}
                        userRole={userRole}
                        openReviewModal={openReviewModal}
                    />
                )}

                {activeTab === "Requests" && (
                    <RequestRide />
                )}

                <RidesList 
                    activeTab={activeTab}
                    filteredRides={filteredRides}
                    userProfile={userProfile}
                    setSelectedRide={setSelectedRide}
                />

            </main>

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
