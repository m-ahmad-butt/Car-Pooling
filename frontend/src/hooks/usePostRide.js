import { useState } from 'react';

export const usePostRide = (initialContactNo = '') => {
    const [showPostModal, setShowPostModal] = useState(false);
    const [postForm, setPostForm] = useState({
        title: '', vehicleType: '', campus: '', vehicleNumber: '',
        seats: '', departureTime: '', contactNumber: initialContactNo, location: '',
        destination: '', description: '',
    });

    const handlePostFormChange = (field, value) => {
        setPostForm(prev => ({ ...prev, [field]: value }));
    };

    const resetPostForm = () => {
        setPostForm({
            title: '', vehicleType: '', campus: '', vehicleNumber: '',
            seats: '', departureTime: '', contactNumber: initialContactNo, location: '',
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
