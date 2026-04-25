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


    if (pendingReviews.length === 0) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-black">OK</span>
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

                {}
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
                            {}
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

                            {}
                            <div className="pt-4 border-t border-gray-200">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Your Rating
                                </label>
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => handleRatingChange(index, num)}
                                            className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black transition-all border-2 ${
                                                num <= review.rating 
                                                    ? 'bg-black text-white border-black' 
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
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
