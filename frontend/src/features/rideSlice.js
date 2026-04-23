import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rideService } from "../services/ride.service";

export const fetchRides = createAsyncThunk('rides/fetchRides', async (getToken, { rejectWithValue }) => {
    try {
        const rides = await rideService.getRides(getToken);
        return rides;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const createRideAsync = createAsyncThunk('rides/createRide', async ({ rideData, getToken }, { rejectWithValue }) => {
    try {
        const ride = await rideService.createRide(rideData, getToken);
        return ride;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateRideAsync = createAsyncThunk('rides/updateRide', async ({ id, updateData, getToken }, { rejectWithValue }) => {
    try {
        const ride = await rideService.updateRide(id, updateData, getToken);
        return ride;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteRideAsync = createAsyncThunk('rides/deleteRide', async ({ id, getToken }, { rejectWithValue }) => {
    try {
        await rideService.deleteRide(id, getToken);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    rides: [],
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
    status: 'idle',
    error: null
};

const rideSlice = createSlice({
    name: "rides",
    initialState,
    reducers: {
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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRides.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRides.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.rides = action.payload;
            })
            .addCase(fetchRides.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createRideAsync.fulfilled, (state, action) => {
                state.rides.unshift(action.payload);
            })
            .addCase(updateRideAsync.fulfilled, (state, action) => {
                const index = state.rides.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.rides[index] = action.payload;
                }
            })
            .addCase(deleteRideAsync.fulfilled, (state, action) => {
                state.rides = state.rides.filter(r => r._id !== action.payload);
            });
    }
});

export const {
    setOngoingRide,
    clearOngoingRide,
    setNeedsReview,
    setFilters,
    setActiveTab,
} = rideSlice.actions;

export default rideSlice.reducer;
