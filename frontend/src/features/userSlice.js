import { createSlice } from "@reduxjs/toolkit";

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
    profile: JSON.parse(localStorage.getItem('userProfile')) || defaultProfile,
    otherProfiles: {},
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
            localStorage.setItem('userProfile', JSON.stringify(state.profile));
        },

        updateProfileImage: (state, action) => {
            state.profile.image = action.payload;
            localStorage.setItem('userProfile', JSON.stringify(state.profile));
        },

        updateProfileStats: (state, action) => {
            state.profile.stats = { ...state.profile.stats, ...action.payload };
            localStorage.setItem('userProfile', JSON.stringify(state.profile));
        },

        incrementRideCount: (state) => {
            state.profile.stats.rides += 1;
            localStorage.setItem('userProfile', JSON.stringify(state.profile));
        },

        refreshUserStats: (state, action) => {
            const { email, reviews } = action.payload;
            const relevantReviews = reviews.filter(r => r.targetEmail === email);
            const avgRating = relevantReviews.length > 0 
                ? Number((relevantReviews.reduce((acc, curr) => acc + curr.rating, 0) / relevantReviews.length).toFixed(1))
                : 0;
            const commentCount = relevantReviews.length;

            if (state.profile.email === email) {
                state.profile.stats.rating = avgRating;
                state.profile.stats.comments = commentCount;
                localStorage.setItem('userProfile', JSON.stringify(state.profile));
            } else {
                const profileKey = Object.keys(state.otherProfiles).find(key => state.otherProfiles[key].email === email);
                if (profileKey) {
                    state.otherProfiles[profileKey].stats.rating = avgRating;
                    state.otherProfiles[profileKey].stats.comments = commentCount;
                }
            }
        },

        setProfileFromAuth: (state, action) => {
            const { firstName, lastName, email, campusId, contactNo, rollNo } = action.payload;
            state.profile.name = `${firstName} ${lastName}`;
            state.profile.email = email;
            state.profile.campus = campusId;
            state.profile.contactNo = contactNo;
            state.profile.rollNo = rollNo;
            state.profile.image = null;
            state.profile.stats = { rides: 0, comments: 0, rating: 0 };
            localStorage.setItem('userProfile', JSON.stringify(state.profile));
        },

        logoutUser: (state) => {
            state.profile = defaultProfile;
            localStorage.removeItem('userProfile');
        },
    }
});

export const {
    updateProfile,
    updateProfileImage,
    updateProfileStats,
    incrementRideCount,
    refreshUserStats,
    setProfileFromAuth,
    logoutUser,
} = userSlice.actions;

export default userSlice.reducer;
