import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    users: [
        {
            email: "l233067@lhr.nu.edu.pk",
            password: "Hello123$",
            firstName: "Ali",
            lastName: "Ahmed",
            campusId: "Lahore",
            contactNo: "0300-1111111",
            rollNo: "23L-3067"
        },
        {
            email: "l233078@lhr.nu.edu.pk",
            password: "Hello123$",
            firstName: "Zain",
            lastName: "Tahir",
            campusId: "Lahore",
            contactNo: "0300-2222222",
            rollNo: "23L-3078"
        },
        {
            email: "l233071@lhr.nu.edu.pk",
            password: "Hello123$",
            firstName: "Saim",
            lastName: "Arif",
            campusId: "Lahore",
            contactNo: "0300-3333333",
            rollNo: "23L-3071"
        },
        {
            email: "l233105@lhr.nu.edu.pk",
            password: "Hello123$",
            firstName: "Abd ur",
            lastName: "Rehman",
            campusId: "Lahore",
            contactNo: "0300-4444444",
            rollNo: "23L-3105"
        }
    ],
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    isVerified: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addUser: (state,action)=>{
            state.users.push(action.payload);
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
            }
        }
    }
});

export const { addUser, loginUser, logoutAuth, verifyEmail, changePassword } = authSlice.actions;
export default authSlice.reducer;