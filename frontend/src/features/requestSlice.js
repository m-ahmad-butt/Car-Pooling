import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { requestService } from "../services/request.service";

export const createBookingAsync = createAsyncThunk('bookings/createBooking', async ({ bookingData, getToken }, { rejectWithValue }) => {
    try {
        const booking = await requestService.createBooking(bookingData, getToken);
        return booking;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMyBookings', async (getToken, { rejectWithValue }) => {
    try {
        const bookings = await requestService.getMyBookings(getToken);
        return bookings;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchBookingsByRide = createAsyncThunk('bookings/fetchBookingsByRide', async ({ rideId, getToken }, { rejectWithValue }) => {
    try {
        const bookings = await requestService.getBookingsByRide(rideId, getToken);
        return bookings;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateBookingStatusAsync = createAsyncThunk('bookings/updateStatus', async ({ id, status, getToken }, { rejectWithValue }) => {
    try {
        const booking = await requestService.updateBookingStatus(id, status, getToken);
        return booking;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    bookings: [],
    myBookings: [],
    status: 'idle',
    error: null
};

const requestSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        removeBooking: (state, action) => {
            state.bookings = state.bookings.filter(r => r._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBookingAsync.fulfilled, (state, action) => {
                state.bookings.unshift(action.payload);
            })
            .addCase(fetchMyBookings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.myBookings = action.payload;
            })
            .addCase(fetchMyBookings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchBookingsByRide.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBookingsByRide.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bookings = action.payload;
            })
            .addCase(fetchBookingsByRide.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateBookingStatusAsync.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            });
    }
});

export const { removeBooking } = requestSlice.actions;

export default requestSlice.reducer;
