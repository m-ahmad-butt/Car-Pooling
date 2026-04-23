import { useSelector, useDispatch } from "react-redux";
import { updateRequestStatusAsync } from "../features/requestSlice";
import { setOngoingRide, updateRideAsync } from "../features/rideSlice";
import { createNotificationAsync } from "../features/notificationSlice";
import { useAuth } from '@clerk/clerk-react';

function RequestRide() {
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const rideRequests = useSelector(state => state.requests.requests);
    const userProfile = useSelector(state => state.user.profile);
    const rides = useSelector(state => state.rides.rides);

    const myRides = rides.filter(r => r.riderEmail === userProfile.email).map(r => r._id || r.id);
    const pendingRequests = rideRequests.filter(r => r.status === 'pending' && myRides.includes(r.rideId));


    const handleApproveRequest = (id) => {
        const request = rideRequests.find(r => r._id === id || r.id === id);

        dispatch(updateRequestStatusAsync({ id, status: 'approved', getToken }));
        if (request) {
            const rideId = request.rideId;
            const ride = rides.find(r => r._id === rideId || r.id === rideId);

            dispatch(updateRideAsync({
                id: rideId,
                updateData: { status: "Done" },
                getToken
            }));

            dispatch(setOngoingRide({
                rideId: rideId,
                rider: ride ? ride.riderName : "Rider",
                riderEmail: ride ? ride.riderEmail : userProfile.email,
                requesterName: request.requesterName,
                requesterEmail: request.requesterEmail,
                from: ride ? (ride.location || "FAST") : "FAST",
                to: ride ? (ride.destination || "Destination") : "Destination",
                status: "In Progress"
            }));

            dispatch(createNotificationAsync({
                notificationData: {
                    targetEmail: request.requesterEmail,
                    from: userProfile.email,
                    message: `Your request for "${ride ? ride.title : 'ride'}" has been approved!`,
                    type: 'approval'
                },
                getToken
            }));
        }
    };

    const handleDeclineRequest = (id) => {
        const request = rideRequests.find(r => r._id === id || r.id === id);
        dispatch(updateRequestStatusAsync({ id, status: 'declined', getToken }));

        if (request) {
            dispatch(createNotificationAsync({
                notificationData: {
                    targetEmail: request.requesterEmail,
                    from: userProfile.email,
                    message: `Your request for "${request.ride}" was declined.`,
                    type: 'decline'
                },
                getToken
            }));
        }
    };

   return (
    <div className="space-y-6">
        <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className="text-center lg:text-left">
                <h2 className="text-2xl font-black tracking-tight uppercase">Ride Requests</h2>
                <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{pendingRequests.length} pending</p>
            </div>
        </div>
        {pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 opacity-20">
                <h3 className="text-xl font-black uppercase tracking-[0.5em] text-center">No pending requests</h3>
            </div>
        ) : (
            pendingRequests.map(req => (
                <div key={req._id || req.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all hover:shadow-xl hover:shadow-black/5">
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
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{req.status}</span>
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
                                onClick={() => handleApproveRequest(req._id || req.id)}
                                className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleDeclineRequest(req._id || req.id)}
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