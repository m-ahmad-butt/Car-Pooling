import { createSlice } from "@reduxjs/toolkit";

let nextRideId = Number(localStorage.getItem('nextRideId')) || 100;

const initialState = {
    rides: JSON.parse(localStorage.getItem('allRides')) || [],
    ongoingRide: null,
    needsReviewBy: JSON.parse(localStorage.getItem('needsReviewBy')) || { 
        riderEmail: null, 
        requesterEmail: null, 
        riderNeedsReview: false, 
        requesterNeedsReview: false,
        rideId: null 
    },
    filters: {
        searchTerm: "",
        campus: "All Campuses",
        category: "All Categories",
    },
    activeTab: "All Rides",
};

const rideSlice = createSlice({
    name: "rides",
    initialState,
    reducers: {
        addRide: (state, action) => {
            const newRide = {
                ...action.payload,
                id: nextRideId++,
                status: "active",
                reviews: [],
                riderAvatar: null,
                image: null,
            };
            state.rides.unshift(newRide);
            localStorage.setItem('allRides', JSON.stringify(state.rides));
            localStorage.setItem('nextRideId', nextRideId.toString());
        },

        removeRide: (state, action) => {
            state.rides = state.rides.filter(r => r.id !== action.payload);
            localStorage.setItem('allRides', JSON.stringify(state.rides));
        },

        updateRide: (state, action) => {
            const index = state.rides.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.rides[index] = { ...state.rides[index], ...action.payload };
                localStorage.setItem('allRides', JSON.stringify(state.rides));
            }
        },

        decrementSeats: (state, action) => {
            const ride = state.rides.find(r => r.id === action.payload);
            if (ride && ride.seats > 0) {
                ride.seats -= 1;
                localStorage.setItem('allRides', JSON.stringify(state.rides));
            }
        },

        setOngoingRide: (state, action) => {
            state.ongoingRide = action.payload;
        },

        clearOngoingRide: (state) => {
            if (state.ongoingRide) {
                state.needsReviewBy = {
                    riderEmail: state.ongoingRide.riderEmail,
                    requesterEmail: state.ongoingRide.requesterEmail,
                    riderNeedsReview: true,
                    requesterNeedsReview: true,
                    rideId: state.ongoingRide.rideId
                };
                state.ongoingRide = null;
                localStorage.setItem('needsReviewBy', JSON.stringify(state.needsReviewBy));
            }
        },

        setNeedsReview: (state, action) => {
            const { role, value } = action.payload;
            if (role === 'rider') state.needsReviewBy.riderNeedsReview = value;
            if (role === 'requester') state.needsReviewBy.requesterNeedsReview = value;
            
            // If both reviews are done, we can clear the emails too, but better keep them until both are false
            if (!state.needsReviewBy.riderNeedsReview && !state.needsReviewBy.requesterNeedsReview) {
                state.needsReviewBy.riderEmail = null;
                state.needsReviewBy.requesterEmail = null;
                state.needsReviewBy.rideId = null;
            }
            
            localStorage.setItem('needsReviewBy', JSON.stringify(state.needsReviewBy));
        },

        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },

        addReviewToRide: (state, action) => {
            const { rideId, review } = action.payload;
            const ride = state.rides.find(r => r.id === rideId);
            if (ride) {
                ride.reviews.push(review);
                localStorage.setItem('allRides', JSON.stringify(state.rides));
            }
        },

        updateRiderRatings: (state, action) => {
            const { email, rating } = action.payload;
            state.rides.forEach(ride => {
                if (ride.riderEmail === email) {
                    ride.riderRating = rating;
                }
            });
            localStorage.setItem('allRides', JSON.stringify(state.rides));
        },
    }
});

export const {
    addRide,
    removeRide,
    updateRide,
    decrementSeats,
    setOngoingRide,
    clearOngoingRide,
    setNeedsReview,
    setFilters,
    setActiveTab,
    addReviewToRide,
    updateRiderRatings,
} = rideSlice.actions;

export default rideSlice.reducer;
