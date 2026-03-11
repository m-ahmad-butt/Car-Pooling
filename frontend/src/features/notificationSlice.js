import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [
        { id: 1, targetEmail: 'l233078@lhr.nu.edu.pk', from: 'l233067@lhr.nu.edu.pk', message: 'Hey Zain, I just requested a seat in your morning commute!' },
        { id: 2, targetEmail: 'l233078@lhr.nu.edu.pk', from: 'l233071@lhr.nu.edu.pk', message: 'I will be at the gate on time, promise!' },
        { id: 3, targetEmail: 'l233067@lhr.nu.edu.pk', from: 'l233078@lhr.nu.edu.pk', message: 'Hi Ali, your ride request was accepted. See you at 8:30 AM!' },
        { id: 4, targetEmail: 'all', from: 'system@nu.edu.pk', message: 'Welcome to dropME! Update your profile to get started.' }
    ]
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        clearNotifications: (state, action) => {
            state.notifications = state.notifications.filter(
                n => n.targetEmail !== action.payload && n.targetEmail !== 'all'
            );
        }
    }
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
