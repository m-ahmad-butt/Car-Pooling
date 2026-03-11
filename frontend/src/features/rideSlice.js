import { createSlice } from "@reduxjs/toolkit";

let nextRideId = 100;

const initialState = {
    rides: [
        {
            id: 1,
            title: "Morning commute to Campus",
            description: "Leaving from Johar Town at 8:30 AM sharp. One seat available for students from CS department.",
            campus: "Lahore",
            vehicleType: "CAR",
            vehicleNumber: "LEA-1234",
            seats: 1,
            riderName: "Zain Tahir",
            riderEmail: "l233078@lhr.nu.edu.pk",
            riderAvatar: null,
            riderRating: 4.8,
            date: "Today, 08:30 AM",
            departureTime: "08:30",
            contactNumber: "0300-2222222",
            location: "Johar Town",
            destination: "FAST LHR",
            image: null,
            status: "active",
            reviews: [
                { user: "Ali A.", rating: 5, comment: "Very punctual and safe driver." },
                { user: "Saim A.", rating: 4, comment: "Nice ride, but was 5 mins late." },
            ]
        },
        {
            id: 2,
            title: "Evening ride back home",
            description: "Going back to Gulberg. Fast and fun ride on my heavy bike. Helmet available.",
            campus: "Lahore",
            vehicleType: "BIKE",
            vehicleNumber: "LHR-5678",
            seats: 1,
            riderName: "Saim Arif",
            riderEmail: "l233071@lhr.nu.edu.pk",
            riderAvatar: null,
            riderRating: 4.9,
            date: "Feb 14, 04:00 PM",
            departureTime: "16:00",
            contactNumber: "0300-3333333",
            location: "FAST LHR",
            destination: "Gulberg",
            image: null,
            status: "active",
            reviews: [
                { user: "Zain T.", rating: 5, comment: "Best heavy bike experience!" }
            ]
        },
        {
            id: 3,
            title: "Weekly grocery run",
            description: "Going to Emporium Mall for some shopping. Can take 3 people with bags.",
            campus: "Lahore",
            vehicleType: "CAR",
            vehicleNumber: "LHR-9999",
            seats: 3,
            riderName: "Abd ur Rehman",
            riderEmail: "l233105@lhr.nu.edu.pk",
            riderAvatar: null,
            riderRating: 4.5,
            date: "Tomorrow, 06:00 PM",
            departureTime: "18:00",
            contactNumber: "0300-4444444",
            location: "FAST LHR",
            destination: "Emporium Mall",
            image: null,
            status: "active",
            reviews: []
        }
    ],
    ongoingRide: null,
    needsReview: false,
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
        },

        removeRide: (state, action) => {
            state.rides = state.rides.filter(r => r.id !== action.payload);
        },

        updateRide: (state, action) => {
            const index = state.rides.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.rides[index] = { ...state.rides[index], ...action.payload };
            }
        },

        decrementSeats: (state, action) => {
            const ride = state.rides.find(r => r.id === action.payload);
            if (ride && ride.seats > 0) {
                ride.seats -= 1;
            }
        },

        setOngoingRide: (state, action) => {
            state.ongoingRide = action.payload;
        },

        clearOngoingRide: (state) => {
            state.ongoingRide = null;
            state.needsReview = true;
        },

        setNeedsReview: (state, action) => {
            state.needsReview = action.payload;
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
            }
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
} = rideSlice.actions;

export default rideSlice.reducer;
