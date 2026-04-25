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

export const updateProfileImageAsync = createAsyncThunk('user/updateProfileImage', async ({ email, imageFile, getToken }, { rejectWithValue }) => {
    try {
        const profile = await authService.updateProfileImage(email, imageFile, getToken);
        return profile;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateProfileAsync = createAsyncThunk('user/updateProfile', async ({ email, profileData, getToken }, { rejectWithValue }) => {
    try {
        const profile = await authService.updateProfile(email, profileData, getToken);
        return profile;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchOtherProfileAsync = createAsyncThunk('user/fetchOtherProfile', async ({ email, getToken }, { rejectWithValue }) => {
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
            state.otherProfiles = {};
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
            })
            .addCase(fetchOtherProfileAsync.fulfilled, (state, action) => {
                state.otherProfiles[action.payload.email] = action.payload;
            })
            .addCase(updateProfileImageAsync.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                state.profile = action.payload;
            });
    }
});

export const { logoutUser, updateProfile } = userSlice.actions;

export default userSlice.reducer;
