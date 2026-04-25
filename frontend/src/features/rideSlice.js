import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rideService } from "../services/ride.service";

export const fetchRides = createAsyncThunk('rides/fetchRides', async (filters = {}, { rejectWithValue }) => {
    try {
        const rides = await rideService.getRides(filters);
        return rides;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchRideById = createAsyncThunk('rides/fetchRideById', async (id, { rejectWithValue }) => {
    try {
        const ride = await rideService.getRideById(id);
        return ride;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchMyOngoingRide = createAsyncThunk('rides/fetchMyOngoingRide', async (getToken, { rejectWithValue }) => {
    try {
        const ride = await rideService.getMyOngoingRide(getToken);
        return ride;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const createRideAsync = createAsyncThunk('rides/createRide', async ({ rideData, image, getToken }, { rejectWithValue }) => {
    try {
        const ride = await rideService.createRide(rideData, image, getToken);
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
    // needsReviewBy now supports multiple members
    needsReviewBy: JSON.parse(localStorage.getItem('needsReviewBy')) || { 
        riderEmail: null,
        riderName: null,
        memberEmails: [],   // all passenger emails
        rideId: null,
        riderNeedsReview: false,
        memberNeedsReview: false,  // true for any member of the ride
        // keep legacy fields for backward compat
        requesterEmail: null,
        requesterNeedsReview: false,
        // full members list so each passenger knows who to review
        members: [],
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
        // Called by the rider when they click "End Ride"
        clearOngoingRide: (state) => {
            if (state.ongoingRide) {
                const memberEmails = (state.ongoingRide.members || []).map(m => m.email);
                state.needsReviewBy = {
                    riderEmail: state.ongoingRide.riderEmail,
                    riderName: state.ongoingRide.rider,
                    memberEmails,
                    members: state.ongoingRide.members || [],
                    rideId: state.ongoingRide.rideId,
                    riderNeedsReview: true,
                    memberNeedsReview: false, // rider is ending, not member
                    // legacy
                    requesterEmail: memberEmails[0] || null,
                    requesterNeedsReview: false,
                };
                state.ongoingRide = null;
                localStorage.setItem('needsReviewBy', JSON.stringify(state.needsReviewBy));
            }
        },
        triggerRiderReview: (state, action) => {
            const { rideId, riderEmail, riderName, members } = action.payload;
            state.needsReviewBy = {
                riderEmail,
                riderName,
                memberEmails: (members || []).map(m => m.email),
                members: members || [],
                rideId,
                riderNeedsReview: true,
                memberNeedsReview: false,
                requesterEmail: null,
                requesterNeedsReview: false,
            };
            state.ongoingRide = null;
            localStorage.setItem('needsReviewBy', JSON.stringify(state.needsReviewBy));
        },
        // Called for a passenger when the backend ride transitions to completed
        triggerPassengerReview: (state, action) => {
            // action.payload = { rideId, riderEmail, riderName, members, myEmail }
            const { rideId, riderEmail, riderName, members, myEmail } = action.payload;
            state.needsReviewBy = {
                riderEmail,
                riderName,
                memberEmails: (members || []).map(m => m.email),
                members: members || [],
                rideId,
                riderNeedsReview: false,
                memberNeedsReview: true,  // passenger needs to review
                requesterEmail: myEmail,
                requesterNeedsReview: true,
            };
            state.ongoingRide = null;
            localStorage.setItem('needsReviewBy', JSON.stringify(state.needsReviewBy));
        },
        setNeedsReview: (state, action) => {
            const { role, value } = action.payload;
            if (role === 'rider') state.needsReviewBy.riderNeedsReview = value;
            if (role === 'member') state.needsReviewBy.memberNeedsReview = value;
            // legacy
            if (role === 'requester') state.needsReviewBy.requesterNeedsReview = value;
            
            const anyPending = state.needsReviewBy.riderNeedsReview 
                || state.needsReviewBy.memberNeedsReview
                || state.needsReviewBy.requesterNeedsReview;

            if (!anyPending) {
                state.needsReviewBy.riderEmail = null;
                state.needsReviewBy.riderName = null;
                state.needsReviewBy.requesterEmail = null;
                state.needsReviewBy.memberEmails = [];
                state.needsReviewBy.members = [];
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
            .addCase(fetchMyOngoingRide.fulfilled, (state, action) => {
                if (action.payload && action.payload._id) {
                    const newRideId = action.payload._id;
                    state.ongoingRide = {
                        rideId: newRideId,
                        rider: action.payload.riderName || "Unknown",
                        riderEmail: action.payload.riderEmail || "",
                        members: action.payload.approvedMembers || [],
                        from: action.payload.location || "FAST",
                        to: action.payload.destination || "Destination",
                        status: "In Progress"
                    };
                    // If there's an active ride in the DB, clear any stale
                    // needsReviewBy that might have been set incorrectly (e.g.
                    // from a logout/switch-account race condition).
                    if (state.needsReviewBy.rideId && state.needsReviewBy.rideId !== newRideId) {
                        // Different rideId — the old review prompt is stale, clear it
                        state.needsReviewBy = {
                            riderEmail: null, riderName: null, memberEmails: [],
                            rideId: null, riderNeedsReview: false, memberNeedsReview: false,
                            requesterEmail: null, requesterNeedsReview: false, members: [],
                        };
                        localStorage.removeItem('needsReviewBy');
                    }
                } else {
                    // Ride is gone — if we HAD an ongoing ride, the passenger
                    // review prompt is triggered in feed.jsx via triggerPassengerReview
                    state.ongoingRide = null;
                }
            })
            .addCase(fetchMyOngoingRide.rejected, (state) => {
                state.ongoingRide = null;
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
    triggerPassengerReview,
    triggerRiderReview,
    setNeedsReview,
    setFilters,
    setActiveTab,
} = rideSlice.actions;

export default rideSlice.reducer;
