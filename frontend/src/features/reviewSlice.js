import { createSlice } from "@reduxjs/toolkit";

let nextReviewId = 300;

const initialState = {
    reviews: [
        { id: 1, rideId: 1, targetEmail: "l233078@lhr.nu.edu.pk", user: "Ali A.", rating: 5, comment: "Very punctual and safe driver." },
        { id: 2, rideId: 1, targetEmail: "l233078@lhr.nu.edu.pk", user: "Saim A.", rating: 4, comment: "Nice ride, but was 5 mins late." },
        { id: 3, rideId: 2, targetEmail: "l233071@lhr.nu.edu.pk", user: "Zain T.", rating: 5, comment: "Best heavy bike experience!" },
    ],
    pendingReview: null,
};

const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        addReview: (state, action) => {
            const newReview = {
                ...action.payload,
                id: nextReviewId++,
            };
            state.reviews.push(newReview);
        },

        removeReview: (state, action) => {
            state.reviews = state.reviews.filter(r => r.id !== action.payload);
        },

        setPendingReview: (state, action) => {
            state.pendingReview = action.payload;
        },

        clearPendingReview: (state) => {
            state.pendingReview = null;
        },
    }
});

export const {
    addReview,
    removeReview,
    setPendingReview,
    clearPendingReview,
} = reviewSlice.actions;

export default reviewSlice.reducer;
