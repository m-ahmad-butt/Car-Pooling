import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: JSON.parse(localStorage.getItem('allNotifications')) || []
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            localStorage.setItem('allNotifications', JSON.stringify(state.notifications));
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
            localStorage.setItem('allNotifications', JSON.stringify(state.notifications));
        },
        clearNotifications: (state, action) => {
            state.notifications = state.notifications.filter(
                n => n.targetEmail !== action.payload && n.targetEmail !== 'all'
            );
            localStorage.setItem('allNotifications', JSON.stringify(state.notifications));
        }
    }
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
