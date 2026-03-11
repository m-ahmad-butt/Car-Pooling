import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: {
        name: "Ali Ahmed",
        rollNo: "23L-3067",
        campus: "Lahore",
        email: "l233067@lhr.nu.edu.pk",
        contactNo: "0300-1111111",
        image: null,
        stats: { rides: 1, comments: 0, rating: 5.0 },
    },
    otherProfiles: {
        "zain-tahir": {
            name: "Zain Tahir",
            rollNo: "23L-3078",
            campus: "Lahore",
            email: "l233078@lhr.nu.edu.pk",
            image: null,
            stats: { rides: 12, comments: 5, rating: 4.8 },
        },
        "saim-arif": {
            name: "Saim Arif",
            rollNo: "23L-3071",
            campus: "Lahore",
            email: "l233071@lhr.nu.edu.pk",
            image: null,
            stats: { rides: 8, comments: 3, rating: 4.8 },
        },
        "abd-ur-rehman": {
            name: "Abd ur Rehman",
            rollNo: "23L-3105",
            campus: "Lahore",
            email: "l233105@lhr.nu.edu.pk",
            image: null,
            stats: { rides: 3, comments: 0, rating: 4.5 },
        },
    },
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
        },

        updateProfileImage: (state, action) => {
            state.profile.image = action.payload;
        },

        updateProfileStats: (state, action) => {
            state.profile.stats = { ...state.profile.stats, ...action.payload };
        },

        incrementRideCount: (state) => {
            state.profile.stats.rides += 1;
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
        },

        logoutUser: (state) => {
            state.profile = initialState.profile;
        },
    }
});

export const {
    updateProfile,
    updateProfileImage,
    updateProfileStats,
    incrementRideCount,
    setProfileFromAuth,
    logoutUser,
} = userSlice.actions;

export default userSlice.reducer;
