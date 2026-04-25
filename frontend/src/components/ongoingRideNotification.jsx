import { useDispatch } from 'react-redux';
import { setNeedsReview } from '../features/rideSlice';

const OngoingRideNotification = ({
    isUserInOngoingRide,
    ongoingRide,
    handleCompleteSimulation,
    userNeedsReview,
    userRole,
    needsReviewBy,
    handleDismissReview,
    openReviewModal,
    userEmail
}) => {
    const dispatch = useDispatch();

    const members = ongoingRide?.members || [];
    const totalMembers = members.length;
    const isRider = userEmail === ongoingRide?.riderEmail;

    // For passengers, find their own entry and the rider info
    const myMemberEntry = !isRider
        ? members.find(m => m.email === userEmail)
        : null;
    const otherMembers = members.filter(m => m.email !== userEmail);

    return (
        <div className="mb-10 space-y-4">
            {/* ── Ongoing Ride Panel ── */}
            {isUserInOngoingRide && ongoingRide && (
                <div className="bg-black text-white p-6 rounded-[2rem] shadow-2xl shadow-black/20">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="flex items-center gap-6 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-1">
                                    Ongoing Ride
                                </h4>
                                {isRider ? (
                                    <>
                                        <p className="text-xl font-bold tracking-tight uppercase">
                                            Your Ride
                                        </p>
                                        <p className="text-[10px] font-bold opacity-60 mt-1">
                                            {ongoingRide.from} → {ongoingRide.to}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xl font-bold tracking-tight uppercase">
                                            Ride with {ongoingRide.rider}
                                        </p>
                                        <p className="text-[10px] font-bold opacity-60 mt-1">
                                            {ongoingRide.from} → {ongoingRide.to}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Only the rider can end the ride */}
                        {isRider && (
                            <button
                                onClick={handleCompleteSimulation}
                                className="bg-white text-black px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl hover:bg-gray-100"
                            >
                                End Ride
                            </button>
                        )}
                    </div>

                    {/* Members section — shown for rider and passengers alike */}
                    {isRider ? (
                        /* Rider sees all passengers */
                        totalMembers > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h5 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3">
                                    Passengers ({totalMembers})
                                </h5>
                                <div className="flex flex-wrap gap-3">
                                    {members.map((member, index) => (
                                        <div key={index} className="bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                                <span className="text-white text-[10px] font-black">
                                                    {member.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold">{member.name}</p>
                                                <p className="text-[9px] opacity-60">
                                                    {member.seats} seat{member.seats > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ) : (
                        /* Passenger sees rider + other passengers */
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3">
                                Ride Members
                            </h5>
                            <div className="flex flex-wrap gap-3">
                                {/* Rider badge */}
                                <div className="bg-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                                        <span className="text-white text-[10px] font-black">
                                            {ongoingRide.rider?.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold">{ongoingRide.rider}</p>
                                        <p className="text-[9px] opacity-60 uppercase tracking-wide">Driver</p>
                                    </div>
                                </div>
                                {/* Other passengers */}
                                {otherMembers.map((member, index) => (
                                    <div key={index} className="bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                            <span className="text-white text-[10px] font-black">
                                                {member.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold">{member.name}</p>
                                            <p className="text-[9px] opacity-60">
                                                {member.seats} seat{member.seats > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Review Prompt (shown after ride ends, for any user) ── */}
            {userNeedsReview && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xl">★</span>
                        </div>
                        <div>
                            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                                Feedback Required
                            </h4>
                            <p className="text-xl font-black italic tracking-tighter uppercase text-black">
                                How was your ride?
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={openReviewModal}
                            className="bg-black text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
                        >
                            Write Review
                        </button>
                        <button
                            onClick={handleDismissReview}
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
