import { useDispatch } from 'react-redux';
import { setNeedsReview } from '../features/rideSlice';

const OngoingRideNotification = ({ isUserInOngoingRide, ongoingRide, handleCompleteSimulation, userNeedsReview, userRole, openReviewModal }) => {
    const dispatch = useDispatch();

    if (!isUserInOngoingRide && !userNeedsReview) return null;

    return (
        <div className="mb-10 space-y-4">
            {isUserInOngoingRide && (
                <div className="bg-black text-white p-6 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl shadow-black/20">
                    <div className="flex items-center gap-6 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-1">Ongoing Ride</h4>
                            <p className="text-xl font-bold tracking-tight uppercase whitespace-nowrap">Ride with {ongoingRide?.rider}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCompleteSimulation}
                        className="bg-white text-black px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl hover:bg-gray-100"
                    >
                        End Ride
                    </button>
                </div>
            )}

            {userNeedsReview && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                            <span className="text-white text-xl">★</span>
                        </div>
                        <div>
                            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Feedback Required</h4>
                            <p className="text-xl font-black italic tracking-tighter uppercase text-black">How was your ride?</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={openReviewModal}
                            className="bg-black text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
                        >Write Review</button>
                        <button 
                            onClick={() => dispatch(setNeedsReview({ role: userRole, value: false }))} 
                            className="text-gray-400 font-bold text-xs hover:text-black transition-colors"
                        >
                            Skip
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OngoingRideNotification;
