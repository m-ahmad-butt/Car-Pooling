import { useState } from 'react';

export const useReviewModal = () => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const openReviewModal = () => setShowReviewModal(true);
    const closeReviewModal = () => {
        setShowReviewModal(false);
        setReviewRating(0);
        setReviewText('');
    };

    return {
        showReviewModal,
        reviewRating,
        setReviewRating,
        reviewText,
        setReviewText,
        openReviewModal,
        closeReviewModal,
    };
};
