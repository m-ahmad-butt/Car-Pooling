import { useState, useEffect, useRef } from 'react';
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
import MultiReviewModal from '../components/multiReviewModal';
import OngoingRideNotification from '../components/ongoingRideNotification';
import MobileSearchBar from '../components/mobileSearchBar';
import RidesList from '../components/ridesList';
import {
    createRideAsync,
    clearOngoingRide,
    triggerPassengerReview,
    triggerRiderReview,
    setNeedsReview,
    fetchRides,
    fetchMyOngoingRide,
    updateRideAsync
} from '../features/rideSlice';
import { createBookingAsync } from '../features/requestSlice';
import { createReviewAsync } from '../features/reviewSlice';
import { validatePhone, validateVehicleNumber } from '../utils/method';
import { createNotificationAsync, fetchNotifications } from '../features/notificationSlice';
import { useAuth } from '@clerk/clerk-react';

const Feed = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const rides = useSelector(state => state.rides.rides);
    const ongoingRide = useSelector(state => state.rides.ongoingRide);
    const needsReviewBy = useSelector(state => state.rides.needsReviewBy);
    const filters = useSelector(state => state.rides.filters);
    const activeTab = useSelector(state => state.rides.activeTab);
    const userProfile = useSelector(state => state.user.profile);
    const allNotifications = useSelector(state => state.notifications.notifications);
    const notifications = allNotifications.filter(n => n.targetEmail === userProfile.email || n.targetEmail === 'all');

    useEffect(() => {
        const backendFilters = {};
        
        if (filters.searchTerm) {
            backendFilters.search = filters.searchTerm;
        }
        if (filters.campus && filters.campus !== 'All Campuses') {
            backendFilters.campus = filters.campus;
        }
        
        dispatch(fetchRides(backendFilters));
    }, [dispatch, filters.searchTerm, filters.campus]);

    useEffect(() => {
        if (userProfile.email) {
            dispatch(fetchNotifications({ email: userProfile.email, getToken }));
            
            // Poll for new notifications every 30 seconds
            const interval = setInterval(() => {
                dispatch(fetchNotifications({ email: userProfile.email, getToken }));
            }, 30000);
            
            return () => clearInterval(interval);
        }
    }, [dispatch, userProfile.email, getToken]);

    // Poll for ongoing ride every 5 seconds so passengers see the panel quickly
    useEffect(() => {
        if (userProfile.email) {
            dispatch(fetchMyOngoingRide(getToken));

            const interval = setInterval(() => {
                dispatch(fetchMyOngoingRide(getToken));
            }, 5000); // 5 seconds — fast enough for passengers to see the panel

            return () => clearInterval(interval);
        }
    }, [dispatch, userProfile.email, getToken]);
    // Real-time review prompt detector for passengers: triggers when the polled
    // ongoingRide state transitions from an active ride to null.
    const prevOngoingRef = useRef(null);
    const prevUserEmailRef = useRef(userProfile.email);

    useEffect(() => {
        // Reset the ref on user switch so we don't accidentally trigger a prompt for the new user
        if (prevUserEmailRef.current !== userProfile.email) {
            prevOngoingRef.current = null;
            prevUserEmailRef.current = userProfile.email;
        }
    }, [userProfile.email]);

    useEffect(() => {
        const prev = prevOngoingRef.current;
        if (!userProfile.email) {
            prevOngoingRef.current = ongoingRide;
            return;
        }
        
        const userEmail = userProfile.email?.toLowerCase();

        // If we previously had an ongoing ride, we are a passenger on it,
        // and now it's null (rider ended it), immediately trigger the review prompt.
        if (
            prev &&
            !ongoingRide &&
            prev.riderEmail?.toLowerCase() !== userEmail &&
            prev.members?.some(m => m.email?.toLowerCase() === userEmail) &&
            !needsReviewBy.memberNeedsReview &&
            !needsReviewBy.requesterNeedsReview
        ) {
            dispatch(triggerPassengerReview({
                rideId: prev.rideId || prev._id,
                riderEmail: prev.riderEmail,
                riderName: prev.rider || prev.riderName || 'Rider',
                members: prev.members || [],
                myEmail: userProfile.email,
            }));
        }
        prevOngoingRef.current = ongoingRide;
    }, [ongoingRide, userProfile.email]);


    // Robust review prompt detector: checks if there's any recently completed
    // ride that the user was part of and hasn't dismissed yet.
    useEffect(() => {
        if (!userProfile.email || !rides.length) return;

        const userEmail = userProfile.email?.toLowerCase();
        const dismissedReviews = JSON.parse(localStorage.getItem(`dismissedReviews_${userEmail}`) || '[]');
        
        // Find the most recently completed ride that the user was part of and hasn't dismissed
        const unreviewedRide = rides.find(ride => {
            if (ride.status !== 'completed' && ride.status !== 'Done') return false;
            
            const rId = (ride._id || ride.id).toString();
            if (dismissedReviews.includes(rId)) return false;
            
            const isRider = ride.riderEmail?.toLowerCase() === userEmail;
            const isPassenger = ride.approvedMembers?.some(m => m.email?.toLowerCase() === userEmail);
            
            return isRider || isPassenger;
        });

        // If there's an unreviewed ride, we need to ensure the prompt state is active
        // and correctly matches the current user's role.
        if (unreviewedRide) {
            const rId = unreviewedRide._id || unreviewedRide.id;
            const isRider = unreviewedRide.riderEmail?.toLowerCase() === userEmail;
            
            const isCurrentPromptValid = needsReviewBy.rideId === rId && 
                                         ((isRider && needsReviewBy.riderNeedsReview) || 
                                          (!isRider && needsReviewBy.memberNeedsReview));

            if (!isCurrentPromptValid) {
                if (isRider) {
                     dispatch(triggerRiderReview({
                         rideId: rId,
                         riderEmail: unreviewedRide.riderEmail,
                         riderName: unreviewedRide.riderName || 'Unknown',
                         members: unreviewedRide.approvedMembers || []
                     }));
                } else {
                     dispatch(triggerPassengerReview({
                         rideId: rId,
                         riderEmail: unreviewedRide.riderEmail,
                         riderName: unreviewedRide.riderName || unreviewedRide.rider || 'Rider',
                         members: unreviewedRide.approvedMembers || [],
                         myEmail: userProfile.email
                     }));
                }
            }
        }
    }, [rides, userProfile.email, needsReviewBy, dispatch]);

    const [selectedRide, setSelectedRide] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [postErrors, setPostErrors] = useState({});

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showMultiReviewModal, setShowMultiReviewModal] = useState(false);
    const [pendingReviewsForRide, setPendingReviewsForRide] = useState([]);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const openReviewModal = () => setShowReviewModal(true);
    const closeReviewModal = () => {
        setShowReviewModal(false);
        setReviewRating(0);
        setReviewText('');
    };

    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [postForm, setPostForm] = useState({
        title: '', vehicleType: '', campus: userProfile.campus || '', vehicleNumber: '',
        seats: '', departureTime: '', contactNumber: userProfile.contactNo || '', location: '',
        destination: '', description: '',
    });

    const handlePostFormChange = (field, value) => {
        setPostForm(prev => ({ ...prev, [field]: value }));
    };

    const resetPostForm = () => {
        setPostForm({
            title: '', vehicleType: '', campus: userProfile.campus || '', vehicleNumber: '',
            seats: '', departureTime: '', contactNumber: userProfile.contactNo || '', location: '',
            destination: '', description: '',
        });
        setSelectedImage(null);
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        // This is now handled by MultiReviewModal
        closeReviewModal();
    };

    const handleAcceptSimulation = (note, ride, seats = 1) => {
        dispatch(createBookingAsync({
            bookingData: {
                rideId: ride.id || ride._id,
                riderEmail: ride.riderEmail,
                requesterName: userProfile.name,
                requesterEmail: userProfile.email,
                requesterAvatar: userProfile.image,
                requesterRating: userProfile.stats.rating,
                ride: ride.title,
                rideDate: ride.date,
                seats: seats,
                note: note,
            },
            getToken
        }));

        dispatch(createNotificationAsync({
            notificationData: {
                targetEmail: ride.riderEmail,
                from: userProfile.email,
                message: `${userProfile.name} requested ${seats} seat${seats > 1 ? 's' : ''} for your ride: ${ride.title}`,
                type: 'request'
            },
            getToken
        })).then(() => {
            // Refresh notifications for the ride owner
            if (userProfile.email === ride.riderEmail) {
                dispatch(fetchNotifications({ email: userProfile.email, getToken }));
            }
        });
    };

    const isUserInOngoingRide = ongoingRide && (
        ongoingRide.riderEmail === userProfile.email ||
        (ongoingRide.members && ongoingRide.members.some(m => m.email === userProfile.email))
    );

    // Determine role: 'rider', 'member' (passenger), or null
    const userRole = (() => {
        const userEmail = userProfile.email?.toLowerCase();
        if (ongoingRide && ongoingRide.riderEmail?.toLowerCase() === userEmail) return 'rider';
        if (ongoingRide && ongoingRide.members?.some(m => m.email?.toLowerCase() === userEmail)) return 'member';
        if (!ongoingRide && needsReviewBy.riderEmail?.toLowerCase() === userEmail) return 'rider';
        if (!ongoingRide && (needsReviewBy.memberEmails?.some(e => e?.toLowerCase() === userEmail) || needsReviewBy.requesterEmail?.toLowerCase() === userEmail)) return 'member';
        return null;
    })();

    const userNeedsReview = (
        userRole === 'rider' && needsReviewBy.riderNeedsReview
    ) || (
        userRole === 'member' && (needsReviewBy.memberNeedsReview || needsReviewBy.requesterNeedsReview)
    );

    const handleCompleteSimulation = () => {
        if (!ongoingRide) return;
        
        const rideId = ongoingRide.rideId;
        const members = ongoingRide.members || [];
        const riderEmail = ongoingRide.riderEmail;
        const riderName = ongoingRide.rider;
        
        // Update ride status to completed in backend
        dispatch(updateRideAsync({
            id: rideId,
            updateData: { status: "completed" },
            getToken
        }));
        
        // The RIDER reviews all passengers.
        // We only set the pending reviews, but DO NOT auto-open the modal.
        // The modal will open when the rider clicks 'Write Review' in the panel.
        const pendingReviews = members.map(member => ({
            targetEmail: member.email,
            targetName: member.name,
            rideId: rideId
        }));
        
        setPendingReviewsForRide(pendingReviews);
        
        // Mark rider as having completed their review setup, clear ongoingRide
        dispatch(clearOngoingRide());
    };
    
    const handleDismissReview = (rideId) => {
        if (!rideId) return;
        const sId = rideId.toString();
        const userEmail = userProfile.email?.toLowerCase();
        const dismissed = JSON.parse(localStorage.getItem(`dismissedReviews_${userEmail}`) || '[]');
        if (!dismissed.includes(sId)) {
            dismissed.push(sId);
            localStorage.setItem(`dismissedReviews_${userEmail}`, JSON.stringify(dismissed));
        }
    };
    
    const handleSubmitMultipleReviews = (reviews) => {
        reviews.forEach(review => {
            dispatch(createReviewAsync({
                reviewData: {
                    rideId: review.rideId,
                    targetEmail: review.targetEmail,
                    user: userProfile.name,
                    rating: review.rating,
                    comment: review.comment,
                },
                getToken
            }));

            dispatch(createNotificationAsync({
                notificationData: {
                    targetEmail: review.targetEmail,
                    from: userProfile.email,
                    message: `You received a new review from ${userProfile.name}`,
                    type: 'review'
                },
                getToken
            }));
        });
        
        dispatch(fetchRides());

        // Dismiss this ride so it never prompts again
        handleDismissReview(needsReviewBy.rideId);

        // Clear the review prompt state completely across all roles
        dispatch(setNeedsReview({ role: 'rider', value: false }));
        dispatch(setNeedsReview({ role: 'member', value: false }));
        dispatch(setNeedsReview({ role: 'requester', value: false }));
        setShowMultiReviewModal(false);
    };

    const filteredRides = rides.filter(ride => {
        if (ride.status !== 'active') return false;
        const matchesCategory = filters.category === 'All Categories' || ride.vehicleType === filters.category;
        return matchesCategory;
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
                riderAvatar: userProfile.image,
                riderRating: userProfile.stats.rating,
                date: "Just now",
                departureTime: postForm.departureTime,
                contactNumber: postForm.contactNumber,
                location: postForm.location,
                destination: postForm.destination,
            },
            image: selectedImage,
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

            <MultiReviewModal
                showModal={showMultiReviewModal}
                closeModal={() => setShowMultiReviewModal(false)}
                pendingReviews={pendingReviewsForRide}
                onSubmitReviews={handleSubmitMultipleReviews}
            />

            <main className="px-8 lg:px-20 py-0 max-w-7xl mx-auto">

                <MobileSearchBar activeTab={activeTab} />

                {activeTab !== 'Requests' && (isUserInOngoingRide || userNeedsReview) && (
                    <OngoingRideNotification
                        isUserInOngoingRide={isUserInOngoingRide}
                        ongoingRide={ongoingRide}
                        handleCompleteSimulation={handleCompleteSimulation}
                        userEmail={userProfile.email}
                        userNeedsReview={userNeedsReview}
                        userRole={userRole}
                        needsReviewBy={needsReviewBy}
                        handleDismissReview={() => {
                            handleDismissReview(needsReviewBy.rideId);
                            dispatch(setNeedsReview({ role: 'rider', value: false }));
                            dispatch(setNeedsReview({ role: 'member', value: false }));
                            dispatch(setNeedsReview({ role: 'requester', value: false }));
                        }}
                        openReviewModal={() => {
                            // Build pending reviews for passenger
                            const rideId = needsReviewBy.rideId;
                            const reviews = [];
                            // Review the rider
                            if (needsReviewBy.riderEmail && needsReviewBy.riderEmail.toLowerCase() !== userProfile.email.toLowerCase()) {
                                reviews.push({ targetEmail: needsReviewBy.riderEmail, targetName: needsReviewBy.riderName || 'Rider', rideId });
                            }
                            // Review other passengers
                            (needsReviewBy.members || []).forEach(m => {
                                if (m.email && m.email.toLowerCase() !== userProfile.email.toLowerCase()) {
                                    reviews.push({ targetEmail: m.email, targetName: m.name, rideId });
                                }
                            });
                            setPendingReviewsForRide(reviews);
                            setShowMultiReviewModal(true);
                        }}
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
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                userProfile={userProfile}
            />

            <Footer />
        </div>
    );
};

export default Feed;
