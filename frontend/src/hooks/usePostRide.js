import { useState } from 'react';

export const usePostRide = () => {
    const [showPostModal, setShowPostModal] = useState(false);
    const [postForm, setPostForm] = useState({
        title: '', vehicleType: '', campus: '', vehicleNumber: '',
        seats: '', departureTime: '', contactNumber: '', location: '',
        destination: '', description: '',
    });

    const handlePostFormChange = (field, value) => {
        setPostForm(prev => ({ ...prev, [field]: value }));
    };

    const resetPostForm = () => {
        setPostForm({
            title: '', vehicleType: '', campus: '', vehicleNumber: '',
            seats: '', departureTime: '', contactNumber: '', location: '',
            destination: '', description: '',
        });
    };

    return {
        showPostModal,
        setShowPostModal,
        postForm,
        handlePostFormChange,
        resetPostForm,
    };
};
