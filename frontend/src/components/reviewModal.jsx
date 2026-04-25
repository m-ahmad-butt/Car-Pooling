const ReviewModal = ({ showReviewModal, closeReviewModal, handleSubmitReview, reviewRating, setReviewRating, reviewText, setReviewText }) => {
    if (!showReviewModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-8">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeReviewModal}
            />
            <div className="relative bg-white w-full sm:max-w-lg rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl p-8 sm:p-10 z-10">
                <button
                    onClick={closeReviewModal}
                    className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-black transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-black tracking-tight uppercase mb-1">Leave a Review</h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">Rate your recent ride</p>

                <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Rating</label>
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setReviewRating(num)}
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black transition-all border-2 ${
                                        num <= reviewRating 
                                            ? 'bg-black text-white border-black' 
                                            : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={reviewRating === 0}
                        className="w-full bg-black text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
