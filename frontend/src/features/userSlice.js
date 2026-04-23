import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/auth.service";

export const fetchProfileAsync = createAsyncThunk('user/fetchProfile', async ({ email, getToken }, { rejectWithValue }) => {
    try {
        const profile = await authService.getProfile(email, getToken);
        return profile;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const defaultProfile = {
    name: null,
    rollNo: null,
    campus: null,
    email: null,
    contactNo: null,
    image: null,
    stats: { rides: 0, comments: 0, rating: 0 },
};

const initialState = {
    profile: defaultProfile,
    otherProfiles: {},
    status: 'idle',
    error: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
        },
        logoutUser: (state) => {
            state.profile = defaultProfile;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProfileAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(fetchProfileAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { logoutUser, updateProfile } = userSlice.actions;

export default userSlice.reducer;
