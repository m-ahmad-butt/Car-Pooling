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
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(star)}
                                    className={`text-3xl transition-colors ${star <= reviewRating ? 'text-black' : 'text-gray-200'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Comment</label>
                        <textarea
                            rows={4}
                            value={reviewText}
                            onChange={e => setReviewText(e.target.value)}
                            placeholder="Share your experience with this ride..."
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-medium focus:ring-1 focus:ring-black/5 outline-none resize-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={reviewRating === 0}
                        className="w-full bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
