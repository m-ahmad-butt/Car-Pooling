import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationService } from "../services/notification.service";

export const createNotificationAsync = createAsyncThunk('notifications/createNotification', async ({ notificationData, getToken }, { rejectWithValue }) => {
    try {
        const notification = await notificationService.createNotification(notificationData, getToken);
        return notification;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async ({ email, getToken }, { rejectWithValue }) => {
    try {
        const notifications = await notificationService.getNotifications(email, getToken);
        return notifications;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const clearNotificationsAsync = createAsyncThunk('notifications/clearNotifications', async ({ email, getToken }, { rejectWithValue }) => {
    try {
        await notificationService.clearNotifications(email, getToken);
        return email;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    notifications: [],
    status: 'idle',
    error: null
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(n => (n._id || n.id) !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNotificationAsync.fulfilled, (state, action) => {
                state.notifications.unshift(action.payload);
            })
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(clearNotificationsAsync.fulfilled, (state) => {
                state.notifications = [];
            });
    }
});

export const { removeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
