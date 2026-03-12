import { createSlice } from "@reduxjs/toolkit";

let nextReviewId = Number(localStorage.getItem('nextReviewId')) || 300;

const initialState = {
    reviews: JSON.parse(localStorage.getItem('allReviews')) || [],
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
            localStorage.setItem('allReviews', JSON.stringify(state.reviews));
            localStorage.setItem('nextReviewId', nextReviewId.toString());
        },

        removeReview: (state, action) => {
            state.reviews = state.reviews.filter(r => r.id !== action.payload);
            localStorage.setItem('allReviews', JSON.stringify(state.reviews));
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
