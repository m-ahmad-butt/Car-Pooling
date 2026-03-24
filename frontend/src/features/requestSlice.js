import { createSlice } from "@reduxjs/toolkit";

let nextRequestId = Number(localStorage.getItem('nextRequestId')) || 200;

const initialState = {
    requests: JSON.parse(localStorage.getItem('allRequests')) || [],
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
            localStorage.setItem('allRequests', JSON.stringify(state.requests));
            localStorage.setItem('nextRequestId', nextRequestId.toString());
        },

        approveRequest: (state, action) => {
            const request = state.requests.find(r => r.id === action.payload);
            if (request) {
                request.status = "approved";
                localStorage.setItem('allRequests', JSON.stringify(state.requests));
            }
        },

        declineRequest: (state, action) => {
            const request = state.requests.find(r => r.id === action.payload);
            if (request) {
                request.status = "declined";
                localStorage.setItem('allRequests', JSON.stringify(state.requests));
            }
        },
    }
});

export const {
    addRequest,
    approveRequest,
    declineRequest,
} = requestSlice.actions;

export default requestSlice.reducer;

