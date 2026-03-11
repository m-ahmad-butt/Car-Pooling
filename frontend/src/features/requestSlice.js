import { createSlice } from "@reduxjs/toolkit";

let nextRequestId = 200;

const initialState = {
    requests: [
        {
            id: 101,
            rideId: 1,
            requesterName: "Ali Ahmed",
            requesterEmail: "l233067@lhr.nu.edu.pk",
            requesterAvatar: null,
            requesterRating: 4.7,
            ride: "Morning commute to Campus",
            rideDate: "Today, 08:30 AM",
            seats: 1,
            note: "Hi! I live near Johar Town. Would love a seat!",
            status: "pending",
        },
        {
            id: 102,
            rideId: 3,
            requesterName: "Saim Arif",
            requesterEmail: "l233071@lhr.nu.edu.pk",
            requesterAvatar: null,
            requesterRating: 4.8,
            ride: "Weekly grocery run",
            rideDate: "Tomorrow, 06:00 PM",
            seats: 2,
            note: "Need 2 seats for me and a friend. We won't take long!",
            status: "pending",
        },
        {
            id: 103,
            rideId: 1,
            requesterName: "Saim Arif",
            requesterEmail: "l233071@lhr.nu.edu.pk",
            requesterAvatar: null,
            requesterRating: 4.8,
            ride: "Morning commute to Campus",
            rideDate: "Today, 08:30 AM",
            seats: 1,
            note: "I'll be at the gate on time, promise!",
            status: "pending",
        },
    ],
};

const requestSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        addRequest: (state, action) => {
            const newRequest = {
                ...action.payload,
                id: nextRequestId++,
                status: "pending",
            };
            state.requests.unshift(newRequest);
        },

        approveRequest: (state, action) => {
            const request = state.requests.find(r => r.id === action.payload);
            if (request) {
                request.status = "approved";
            }
        },

        declineRequest: (state, action) => {
            const request = state.requests.find(r => r.id === action.payload);
            if (request) {
                request.status = "declined";
            }
        },

        removeRequest: (state, action) => {
            state.requests = state.requests.filter(r => r.id !== action.payload);
        },
    }
});

export const {
    addRequest,
    approveRequest,
    declineRequest,
    removeRequest,
} = requestSlice.actions;

export default requestSlice.reducer;
