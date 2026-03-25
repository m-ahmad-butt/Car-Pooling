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
import { addRide, clearOngoingRide, submitReviewForQueue, addReviewToRide, updateRide } from '../features/rideSlice';
import { addRequest } from '../features/requestSlice';
import { addReview } from '../features/reviewSlice';
import { validatePhone, validateVehicleNumber, getCampuses } from '../utils/method';
import { addNotification } from '../features/notificationSlice';
import { syncUserStats, incrementRidesCount } from '../features/authSlice';

const Feed = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const rides = useSelector(state => state.rides.rides);
    const ongoingRide = useSelector(state => state.rides.ongoingRide);
    const filters = useSelector(state => state.rides.filters);
    const activeTab = useSelector(state => state.rides.activeTab);
    const reviews = useSelector(state => state.reviews.reviews);
    const user = useSelector(state => state.auth.currentUser);
    const userName = `${user?.firstName} ${user?.lastName}`;
    const allNotifications = useSelector(state => state.notifications.notifications);
    const notifications = allNotifications.filter(n => n.targetEmail === user?.email || n.targetEmail === 'all');

    const [selectedRide, setSelectedRide] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [postErrors, setPostErrors] = useState({
        vehicleNumber: '',
        seats: '',
        contactNumber: '',
        dateTime: '',
        vehicleType: '',
    });

    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewTargetIndex, setReviewTargetIndex] = useState(0);

    const openReviewModal = () => {
        setReviewTargetIndex(0);
        setShowReviewModal(true);
    };
    const closeReviewModal = () => {
        setShowReviewModal(false);
        setReviewRating(0);
        setReviewText('');
    };

    // Post Ride Modal State
    const [showPostModal, setShowPostModal] = useState(false);
    const [postForm, setPostForm] = useState({
        title: '', vehicleType: '',
        campus: getCampuses().find(c => c.id === user?.campusId)?.name || user?.campusId,
        vehicleNumber: '',
        seats: '', date: new Date().toISOString().split('T')[0], departureTime: '',
        contactNumber: user?.contactNo, location: '',
        destination: '', description: '',
    });

    const handlePostFormChange = (field, value) => {
        setPostForm(prev => ({ ...prev, [field]: value }));
    };

    const resetPostForm = () => {
        setPostForm({
            title: '', vehicleType: '',
            campus: getCampuses().find(c => c.id === user?.campusId)?.name || user?.campusId,
            vehicleNumber: '',
            seats: '', date: new Date().toISOString().split('T')[0], departureTime: '',
            contactNumber: user?.contactNo, location: '',
            destination: '', description: '',
        });
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();

        const currentQueue = reviewQueues.find(q => {
            const others = q.participants.filter(p => p.email !== user?.email);
            const reviewed = q.progress[user?.email] || [];
            return reviewed.length < others.length;
        });

        if (currentQueue) {
            const others = currentQueue.participants.filter(p => p.email !== user?.email);
            const reviewed = currentQueue.progress[user?.email] || [];
            const currentTarget = others.find(o => !reviewed.includes(o.email));

            if (currentTarget) {
                // Submit individual review
                dispatch(addReview({
                    rideId: currentQueue.rideId,
                    targetEmail: currentTarget.email,
                    user: userName,
                    rating: reviewRating,
                    comment: reviewText,
                }));

                dispatch(addReviewToRide({
                    rideId: currentQueue.rideId,
                    review: { user: userName, rating: reviewRating, comment: reviewText }
                }));

                dispatch(addNotification({
                    id: Date.now(),
                    targetEmail: currentTarget.email,
                    from: user?.email,
                    message: `You received a new review from ${userName}!`,
                    type: 'review'
                }));

                // Record that this target was reviewed by the current user
                dispatch(submitReviewForQueue({
                    rideId: currentQueue.rideId,
                    userEmail: user?.email,
                    targetEmail: currentTarget.email
                }));

                // Sync stats for the target user (include current reviews list)
                dispatch(syncUserStats({ email: currentTarget.email, reviews: [...reviews, { targetEmail: currentTarget.email, rating: reviewRating }] }));

                // Sync stats for the current user
                dispatch(syncUserStats({ email: user?.email, reviews: reviews }));

                // Clear inputs
                setReviewRating(0);
                setReviewText('');

                // Check if that was the last person for this specific ride
                if (reviewed.length + 1 >= others.length) {
                    closeReviewModal();
                }
            } else {
                closeReviewModal();
            }
        } else {
            closeReviewModal();
        }
    };

    const handleAcceptSimulation = (note, ride, requestedSeats = 1) => {
        dispatch(addRequest({
            rideId: ride.id,
            requesterName: userName,
            requesterEmail: user?.email,
            requesterRollNo: user?.rollNo,
            requesterAvatar: user?.image,
            requesterRating: user?.stats?.rating || 0,
            ride: ride.title,
            rideDate: ride.date,
            seats: requestedSeats,
            note: note,
        }));

        dispatch(addNotification({
            id: Date.now(),
            targetEmail: ride.riderEmail,
            from: user?.email,
            message: `${userName} requested ${requestedSeats} seat(s) for your ride: ${ride.title}`,
            type: 'request'
        }));
    };

    const isUserInOngoingRide = ongoingRide && (
        ongoingRide.riderEmail === user?.email ||
        (ongoingRide.requesterEmails && ongoingRide.requesterEmails.includes(user?.email)) ||
        ongoingRide.requesterEmail === user?.email
    );

    const userRole = ongoingRide
        ? (user?.email === ongoingRide.riderEmail ? 'rider' : 'requester')
        : null;

    const reviewQueues = useSelector(state => state.rides.reviewQueues);
    const userNeedsReview = reviewQueues.some(q => {
        const others = q.participants.filter(p => p.email !== user?.email);
        const reviewed = q.progress[user?.email] || [];
        return others.length > 0 && reviewed.length < others.length;
    });

    const handleCompleteSimulation = () => {
        if (ongoingRide) {
            // participants = rider + all requesters
            const participants = [ongoingRide.riderEmail, ...(ongoingRide.requesterEmails || [])];
            dispatch(incrementRidesCount({ emails: participants }));
            dispatch(updateRide({ id: ongoingRide.rideId, status: "Done" }));
        }
        dispatch(clearOngoingRide());
    };

    const rideRequests = useSelector(state => state.requests.requests);

    const filteredRides = rides.filter(ride => {
        if (ride.status === 'Done') return false;

        if (ride.seats === 0) {
            const isRider = ride.riderEmail === user?.email;
            if (!isRider) return false;
        }

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

        // Date and Time Validation
        const selectedDateTime = new Date(`${postForm.date}T${postForm.departureTime}`);
        const currentDateTime = new Date();

        if (selectedDateTime < currentDateTime) {
            errors.dateTime = 'Ride time cannot be in the past';
        }

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

        if (!postForm.vehicleType) {
            errors.vehicleType = "Please select a vehicle category";
        }

        if (Object.keys(errors).length > 0) {
            setPostErrors(errors);
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
            riderName: userName,
            riderEmail: user?.email,
            riderRollNo: user?.rollNo,
            riderRating: user?.stats?.rating || 0,
            date: postForm.date,
            departureTime: postForm.departureTime,
            contactNumber: postForm.contactNumber,
            location: postForm.location,
            destination: postForm.destination,
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
                userProfile={{ ...user, name: userName }}
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
                targetName={
                    (() => {
                        const q = reviewQueues.find(q => {
                            const others = q.participants.filter(p => p.email !== user?.email);
                            const reviewed = q.progress[user?.email] || [];
                            return reviewed.length < others.length;
                        });
                        if (!q) return 'Member';
                        const others = q.participants.filter(p => p.email !== user?.email);
                        const reviewed = q.progress[user?.email] || [];
                        return others.find(o => !reviewed.includes(o.email))?.name || 'Member';
                    })()
                }
            />

            <main className="px-4 sm:px-8 lg:px-20 py-0 max-w-7xl mx-auto">

                <MobileSearchBar activeTab={activeTab} />

                {activeTab !== 'Requests' && (isUserInOngoingRide || userNeedsReview) && (
                    <OngoingRideNotification
                        isUserInOngoingRide={isUserInOngoingRide}
                        ongoingRide={ongoingRide}
                        handleCompleteSimulation={handleCompleteSimulation}
                        userNeedsReview={userNeedsReview}
                        reviewQueues={reviewQueues}
                        openReviewModal={openReviewModal}
                        userProfile={user}
                    />
                )}

                {activeTab === "Requests" && (
                    <RequestRide />
                )}

                <RidesList
                    activeTab={activeTab}
                    filteredRides={filteredRides}
                    userProfile={{ ...user, name: userName }}
                    setSelectedRide={setSelectedRide}
                />

            </main>

            {selectedRide && (
                <RideDetails
                    ride={selectedRide}
                    onClose={() => setSelectedRide(null)}
                    onAccept={(note, seats) => {
                        handleAcceptSimulation(note, selectedRide, seats);
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
