import { useSelector, useDispatch } from "react-redux";
import { approveRequest, declineRequest } from "../features/requestSlice";
import { decrementSeats, setOngoingRide, updateRide } from "../features/rideSlice";


function RequestRide() {
    const dispatch = useDispatch();
    const rideRequests = useSelector(state => state.requests.requests);
    const userProfile = useSelector(state => state.user.profile);
    const rides = useSelector(state => state.rides.rides);

    const myRides = rides.filter(r => r.riderEmail === userProfile.email).map(r => r.id);
    const pendingRequests = rideRequests.filter(r => r.status === 'pending' && myRides.includes(r.rideId));

    const handleApproveRequest = (id) => {
        const request = rideRequests.find(r => r.id === id);
        dispatch(approveRequest(id));
        if (request) {
            dispatch(decrementSeats(request.rideId));

            const ride = rides.find(r => r.id === request.rideId);

            dispatch(updateRide({
                id: request.rideId,
                status: "Done"
            }));

            dispatch(setOngoingRide({
                rideId: request.rideId,
                rider: ride ? ride.riderName : "Rider",
                riderEmail: ride ? ride.riderEmail : userProfile.email,
                requesterName: request.requesterName,
                requesterEmail: request.requesterEmail,
                from: ride ? (ride.location || "FAST") : "FAST",
                to: ride ? (ride.destination || "Destination") : "Destination",
                status: "In Progress"
            }));
        }
    };

    const handleDeclineRequest = (id) => {
        dispatch(declineRequest(id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase">Ride Requests</h2>
                    <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{pendingRequests.length} pending</p>
                </div>
            </div>
            {pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 opacity-20">
                    <svg className="w-24 h-24 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <h3 className="text-xl font-black uppercase tracking-[0.5em]">No pending requests</h3>
                </div>
            ) : (
                pendingRequests.map(req => (
                    <div key={req.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all hover:shadow-xl hover:shadow-black/5">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-black flex-shrink-0 flex items-center justify-center">
                            <span className="text-white text-sm font-black italic">{req.requesterName.charAt(0)}</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h4 className="text-sm font-black text-black">{req.requesterName}</h4>
                                <div className="flex items-center gap-1">
                                    <span className="text-black text-xs">★</span>
                                    <span className="text-[10px] font-black text-gray-500">{req.requesterRating}</span>
                                </div>
                                {req.status !== 'pending' && (
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                        }`}>{req.status}</span>
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                {req.ride} · {req.rideDate} · {req.seats} seat{req.seats > 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-gray-500 font-medium italic">"{req.note}"</p>
                        </div>

                        {/* Actions */}
                        {req.status === 'pending' && (
                            <div className="flex gap-3 flex-shrink-0">
                                <button
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDeclineRequest(req.id)}
                                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all"
                                >
                                    Decline
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default RequestRide;