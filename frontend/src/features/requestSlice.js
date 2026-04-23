import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { requestService } from "../services/request.service";

export const createRequestAsync = createAsyncThunk('requests/createRequest', async ({ requestData, getToken }, { rejectWithValue }) => {
    try {
        const request = await requestService.createRequest(requestData, getToken);
        return request;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchRequestsByRide = createAsyncThunk('requests/fetchRequestsByRide', async ({ rideId, getToken }, { rejectWithValue }) => {
    try {
        const requests = await requestService.getRequestsByRide(rideId, getToken);
        return requests;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateRequestStatusAsync = createAsyncThunk('requests/updateStatus', async ({ id, status, getToken }, { rejectWithValue }) => {
    try {
        const request = await requestService.updateRequestStatus(id, status, getToken);
        return request;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    requests: [],
    status: 'idle',
    error: null
};

const requestSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        removeRequest: (state, action) => {
            state.requests = state.requests.filter(r => r._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRequestAsync.fulfilled, (state, action) => {
                state.requests.unshift(action.payload);
            })
            .addCase(fetchRequestsByRide.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRequestsByRide.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.requests = action.payload;
            })
            .addCase(fetchRequestsByRide.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateRequestStatusAsync.fulfilled, (state, action) => {
                const index = state.requests.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
            });
    }
});

export const { removeRequest } = requestSlice.actions;

export default requestSlice.reducer;
