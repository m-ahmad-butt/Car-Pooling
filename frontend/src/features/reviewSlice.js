import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewService } from "../services/review.service";

export const createReviewAsync = createAsyncThunk('reviews/createReview', async ({ reviewData, getToken }, { rejectWithValue }) => {
    try {
        const review = await reviewService.createReview(reviewData, getToken);
        return review;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchReviewsByUser = createAsyncThunk('reviews/fetchReviewsByUser', async ({ email, getToken }, { rejectWithValue }) => {
    try {
        const reviews = await reviewService.getReviewsByUser(email, getToken);
        return reviews;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    reviews: [],
    pendingReview: null,
    status: 'idle',
    error: null
};

const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        setPendingReview: (state, action) => {
            state.pendingReview = action.payload;
        },
        clearPendingReview: (state) => {
            state.pendingReview = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReviewAsync.fulfilled, (state, action) => {
                state.reviews.push(action.payload);
            })
            .addCase(fetchReviewsByUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchReviewsByUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews = action.payload;
            })
            .addCase(fetchReviewsByUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const {
    setPendingReview,
    clearPendingReview,
} = reviewSlice.actions;

export default reviewSlice.reducer;
