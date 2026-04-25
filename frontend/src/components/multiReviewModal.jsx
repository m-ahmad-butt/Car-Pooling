import { useState, useEffect } from 'react';

const MultiReviewModal = ({ showModal, closeModal, pendingReviews, onSubmitReviews }) => {
    const [reviews, setReviews] = useState(
        () => pendingReviews.map(pr => ({
            targetEmail: pr.targetEmail,
            targetName: pr.targetName,
            rideId: pr.rideId,
            rating: 0,
            comment: ''
        }))
    );

    // Re-sync when pendingReviews changes (new modal opens with different people)
    useEffect(() => {
        setReviews(pendingReviews.map(pr => ({
            targetEmail: pr.targetEmail,
            targetName: pr.targetName,
            rideId: pr.rideId,
            rating: 0,
            comment: ''
        })));
    }, [pendingReviews]);

    if (!showModal) return null;

    const handleRatingChange = (index, rating) => {
        const newReviews = [...reviews];
        newReviews[index] = { ...newReviews[index], rating };
        setReviews(newReviews);
    };

    const handleCommentChange = (index, comment) => {
        const newReviews = [...reviews];
        newReviews[index] = { ...newReviews[index], comment };
        setReviews(newReviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const allRated = reviews.every(r => r.rating > 0);
        if (!allRated) {
            alert('Please rate all members before submitting');
            return;
        }

        onSubmitReviews(reviews);
        closeModal();
    };

    // If there are no people to review (e.g. rider with no passengers), close gracefully
    if (pendingReviews.length === 0) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight uppercase mb-2">Ride Complete</h2>
                    <p className="text-sm text-gray-400 mb-6">No members to review for this ride.</p>
                    <button
                        onClick={closeModal}
                        className="w-full bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-[2rem] flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight uppercase mb-1">Rate Your Ride</h2>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            Review all members from this ride
                        </p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-black transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-gray-50 rounded-[1.5rem] p-6 space-y-5">
                            {/* Person info */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-lg font-black">
                                        {review.targetName?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tight uppercase">{review.targetName}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                        Review for {index === 0 ? 'member' : `member ${index + 1}`}
                                    </p>
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="pt-4 border-t border-gray-200">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Your Rating
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(index, star)}
                                            className={`text-3xl transition-all hover:scale-110 ${
                                                star <= review.rating ? 'text-black' : 'text-gray-200'
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Your Comment
                                </label>
                                <textarea
                                    rows={3}
                                    value={review.comment}
                                    onChange={e => handleCommentChange(index, e.target.value)}
                                    placeholder="Share your experience..."
                                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-sm font-medium text-black placeholder:text-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black/20 outline-none resize-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-gray-800 shadow-xl"
                    >
                        Submit All Reviews
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MultiReviewModal;
