import { createSlice } from "@reduxjs/toolkit";

let nextReviewId = Number(localStorage.getItem('nextReviewId')) || 300;

const initialState = {
    reviews: JSON.parse(localStorage.getItem('allReviews')) || [],
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
    }
});

export const {
    addReview,
} = reviewSlice.actions;

export default reviewSlice.reducer;


