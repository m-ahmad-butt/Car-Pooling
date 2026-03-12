import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    users: JSON.parse(localStorage.getItem('allUsers')) || [],
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    isVerified: false,
    resetEmail: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addUser: (state,action)=>{
            state.users.push(action.payload);
            localStorage.setItem('allUsers', JSON.stringify(state.users));
        },

        loginUser: (state,action)=>{
            const user = state.users.find(u => u.email === action.payload.email);
            if(user){
                try {
                    state.currentUser = user;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                } catch (err) {
                    state.currentUser = null;
                }
            }
        },

        logoutAuth: (state) => {
            state.currentUser = null;
            localStorage.removeItem('currentUser');
        },

        verifyEmail: (state, action) => {
            const user = state.users.find(u => u.email === action.payload.email);
            if (user) {
                state.isVerified = true;
            }
        },

        changePassword: (state, action) => {
            const user = state.users.find(u => u.email === action.payload.email);
            if (user) {
                user.password = action.payload.newPassword;
                localStorage.setItem('allUsers', JSON.stringify(state.users));
                
                if (state.currentUser && state.currentUser.email === user.email) {
                    state.currentUser.password = action.payload.newPassword;
                    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
                }
            }
        },
        
        setResetEmail: (state, action) => {
            state.resetEmail = action.payload;
        },

        clearResetEmail: (state) => {
            state.resetEmail = null;
        }
    }
});

export const { addUser, loginUser, logoutAuth, verifyEmail, changePassword, setResetEmail, clearResetEmail } = authSlice.actions;
export default authSlice.reducer;