import { createSlice } from "@reduxjs/toolkit";

let nextRideId = Number(localStorage.getItem('nextRideId')) || 100;

const initialState = {
    rides: JSON.parse(localStorage.getItem('allRides')) || [],
    ongoingRide: null,
    reviewQueues: JSON.parse(localStorage.getItem('reviewQueues')) || [],
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
                totalSeats: action.payload.seats,
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
            const { rideId, seats } = action.payload;
            const ride = state.rides.find(r => r.id === rideId);
            if (ride && ride.seats >= seats) {
                ride.seats -= seats;
                localStorage.setItem('allRides', JSON.stringify(state.rides));
            }
        },

        setOngoingRide: (state, action) => {
            state.ongoingRide = action.payload;
        },

        clearOngoingRide: (state) => {
            if (state.ongoingRide) {
                const reqEmails = state.ongoingRide.requesterEmails || [state.ongoingRide.requesterEmail];
                const reqNames = state.ongoingRide.requesterNames || [state.ongoingRide.requesterName];

                const participants = [
                    { email: state.ongoingRide.riderEmail, name: state.ongoingRide.riderName },
                    ...reqEmails.map((email, i) => ({ email, name: reqNames[i] }))
                ].filter(p => p.email);

                const newQueue = {
                    rideId: state.ongoingRide.rideId,
                    rideTitle: state.ongoingRide.title || "Shared Ride",
                    participants: participants,
                    progress: {}
                };

                state.reviewQueues.push(newQueue);
                state.ongoingRide = null;
                localStorage.setItem('reviewQueues', JSON.stringify(state.reviewQueues));
            }
        },

        submitReviewForQueue: (state, action) => {
            const { rideId, userEmail, targetEmail } = action.payload;
            const queue = state.reviewQueues.find(q => q.rideId === rideId);
            if (queue) {
                if (!queue.progress[userEmail]) {
                    queue.progress[userEmail] = [];
                }
                queue.progress[userEmail].push(targetEmail);

                const others = queue.participants.filter(p => p.email !== userEmail);
                const reviewedCount = queue.progress[userEmail].length;

                localStorage.setItem('reviewQueues', JSON.stringify(state.reviewQueues));
            }
        },

        clearReviewQueue: (state, action) => {
            const { rideId } = action.payload;
            state.reviewQueues = state.reviewQueues.filter(q => q.rideId !== rideId);
            localStorage.setItem('reviewQueues', JSON.stringify(state.reviewQueues));
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

        updateUserRidesCampus: (state, action) => {
            const { email, campus } = action.payload;
            state.rides.forEach(ride => {
                if (ride.riderEmail.toLowerCase().trim() === email.toLowerCase().trim()) {
                    ride.campus = campus;
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
    submitReviewForQueue,
    clearReviewQueue,
    setFilters,
    setActiveTab,
    addReviewToRide,
    updateUserRidesCampus,
} = rideSlice.actions;

export default rideSlice.reducer;
