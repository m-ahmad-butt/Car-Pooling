import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: JSON.parse(localStorage.getItem('allUsers')) || [],
    currentUser: (() => {
        const stored = JSON.parse(localStorage.getItem('currentUser'));
        if (stored && !stored.stats) {
            stored.stats = { rides: 0, reviews: 0, rating: 0 };
        }
        return stored;
    })(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addUser: (state, action) => {
            const newUser = {
                ...action.payload,
                stats: { rides: 0, reviews: 0, rating: 0 },
                image: null
            };
            const exists = state.users.some(u => u.email === newUser.email);
            if (!exists) {
                state.users.push(newUser);
                localStorage.setItem('allUsers', JSON.stringify(state.users));
            }
        },

        loginUser: (state, action) => {
            const user = state.users.find(u => u.email === action.payload.email);
            if (user) {
                if (!user.stats) user.stats = { rides: 0, reviews: 0, rating: 0 };
                state.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
        },

        logoutAuth: (state) => {
            state.currentUser = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userProfile');
        },

        updateCurrentUser: (state, action) => {
            if (state.currentUser) {
                state.currentUser = { ...state.currentUser, ...action.payload };
                localStorage.setItem('currentUser', JSON.stringify(state.currentUser));

                const index = state.users.findIndex(u => u.email === state.currentUser.email);
                if (index !== -1) {
                    state.users[index] = state.currentUser;
                    localStorage.setItem('allUsers', JSON.stringify(state.users));
                }
            }
        },

        syncUserStats: (state, action) => {
            const { email, reviews } = action.payload;
            const relevantReviews = reviews.filter(r => r.targetEmail?.toLowerCase() === email?.toLowerCase());
            let avgRating = 0;
            if (relevantReviews.length > 0) {
                avgRating = Number((relevantReviews.reduce((acc, curr) => acc + curr.rating, 0) / relevantReviews.length).toFixed(1));
            }
            const reviewCount = relevantReviews.length;

            const updateInList = (user) => {
                if (user.email?.toLowerCase() === email?.toLowerCase()) {
                    user.stats = { ...user.stats, rating: avgRating, reviews: reviewCount };
                    return true;
                }
                return false;
            };

            if (state.currentUser) {
                if (updateInList(state.currentUser)) {
                    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
                }
            }

            state.users.forEach(updateInList);
            localStorage.setItem('allUsers', JSON.stringify(state.users));
        },

        incrementRidesCount: (state, action) => {
            const { emails } = action.payload;
            const update = (user) => {
                if (emails.map(e => e?.toLowerCase()).includes(user.email?.toLowerCase())) {
                    if (!user.stats) user.stats = { rides: 0, reviews: 0, rating: 0 };
                    user.stats.rides = (user.stats.rides || 0) + 1;
                    return true;
                }
                return false;
            };
            if (state.currentUser) {
                if (update(state.currentUser)) {
                    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
                }
            }
            state.users.forEach(update);
            localStorage.setItem('allUsers', JSON.stringify(state.users));
        },

        changePassword: (state, action) => {
            const user = state.users.find(u => u.email === action.payload.email);
            if (user) {
                user.password = action.payload.newPassword;
                if (state.currentUser && state.currentUser.email === user.email) {
                    state.currentUser.password = action.payload.newPassword;
                    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
                }
                localStorage.setItem('allUsers', JSON.stringify(state.users));
            }
        },
    }
});

export const {
    addUser,
    loginUser,
    logoutAuth,
    updateCurrentUser,
    syncUserStats,
    incrementRidesCount,
    changePassword,
} = authSlice.actions;
export default authSlice.reducer;