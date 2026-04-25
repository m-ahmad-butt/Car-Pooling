import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { updateBookingStatusAsync, fetchMyRideRequests } from "../features/requestSlice";
import { setOngoingRide, updateRideAsync } from "../features/rideSlice";
import { createNotificationAsync, fetchNotifications } from "../features/notificationSlice";
import { useAuth } from '@clerk/clerk-react';

function RequestRide() {
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const rideRequests = useSelector(state => state.bookings.bookings);
    const userProfile = useSelector(state => state.user.profile);
    const rides = useSelector(state => state.rides.rides);

    useEffect(() => {
        if (userProfile.email) {
            dispatch(fetchMyRideRequests(getToken));
        }
    }, [dispatch, getToken, userProfile.email]);

    const pendingRequests = rideRequests.filter(r => r.status === 'pending');
    const approvedRequests = rideRequests.filter(r => r.status === 'approved');
    
    // Group requests by ride
    const requestsByRide = {};
    rideRequests.forEach(req => {
        if (!requestsByRide[req.rideId]) {
            requestsByRide[req.rideId] = [];
        }
        requestsByRide[req.rideId].push(req);
    });


    const handleApproveRequest = (id) => {
        const request = rideRequests.find(r => r._id === id || r.id === id);

        if (request) {
            const rideId = request.rideId;
            const ride = rides.find(r => r._id === rideId || r.id === rideId);
            
            if (!ride) return;
            
            // Calculate available seats
            const approvedSeats = rideRequests
                .filter(r => r.rideId === rideId && r.status === 'approved')
                .reduce((sum, r) => sum + r.seats, 0);
            
            const availableSeats = ride.seats - approvedSeats;
            
            // Check if enough seats available
            if (request.seats > availableSeats) {
                alert(`Not enough seats! Only ${availableSeats} seat(s) available, but ${request.seats} requested.`);
                return;
            }

            dispatch(updateBookingStatusAsync({ id, status: 'approved', getToken }));
            
            // Build new approvedMembers WITHOUT mutating Redux state
            const existingMembers = Array.isArray(ride.approvedMembers) ? ride.approvedMembers : [];
            const newMember = {
                email: request.requesterEmail,
                name: request.requesterName,
                seats: request.seats,
                avatar: request.requesterAvatar || ''
            };
            const newApprovedMembers = [...existingMembers, newMember];
            const newAvailableSeats = availableSeats - request.seats;
            
            dispatch(updateRideAsync({
                id: rideId,
                updateData: { 
                    availableSeats: newAvailableSeats,
                    approvedMembers: newApprovedMembers
                },
                getToken
            }));

            dispatch(createNotificationAsync({
                notificationData: {
                    targetEmail: request.requesterEmail,
                    from: userProfile.email,
                    message: `Your request for ${request.seats} seat(s) in "${ride.title}" has been approved!`,
                    type: 'approval'
                },
                getToken
            }));
        }
    };

    const handleStartRide = (rideId) => {
        const ride = rides.find(r => r._id === rideId || r.id === rideId);
        const rideApprovedRequests = rideRequests.filter(r => r.rideId === rideId && r.status === 'approved');
        
        if (!ride || rideApprovedRequests.length === 0) return;
        
        dispatch(updateRideAsync({
            id: rideId,
            updateData: { status: "ongoing" },
            getToken
        }));
        
        // Set ongoing ride with all members
        dispatch(setOngoingRide({
            rideId: rideId,
            rider: ride.riderName,
            riderEmail: ride.riderEmail,
            members: rideApprovedRequests.map(r => ({
                name: r.requesterName,
                email: r.requesterEmail,
                seats: r.seats
            })),
            from: ride.location || "FAST",
            to: ride.destination || "Destination",
            status: "In Progress"
        }));
        
        // Notify all passengers that ride has started
        rideApprovedRequests.forEach(req => {
            dispatch(createNotificationAsync({
                notificationData: {
                    targetEmail: req.requesterEmail,
                    from: userProfile.email,
                    message: `Your ride "${ride.title}" has started!`,
                    type: 'ride-started'
                },
                getToken
            }));
        });
    };

    const handleDeclineRequest = (id) => {
        const request = rideRequests.find(r => r._id === id || r.id === id);
        dispatch(updateBookingStatusAsync({ id, status: 'declined', getToken }));

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
        <div className="flex items-center justify-between mb-8">
            <div className="text-center lg:text-left">
                <h2 className="text-2xl font-black tracking-tight uppercase">Ride Requests</h2>
                <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{pendingRequests.length} pending</p>
            </div>
        </div>
        
        {/* Group by rides and show Start Ride button */}
        {Object.keys(requestsByRide).map(rideId => {
            const ride = rides.find(r => r._id === rideId || r.id === rideId);
            const rideReqs = requestsByRide[rideId];
            const approved = rideReqs.filter(r => r.status === 'approved');
            const pending = rideReqs.filter(r => r.status === 'pending');
            
            if (!ride || (pending.length === 0 && approved.length === 0)) return null;
            
            const approvedSeats = approved.reduce((sum, r) => sum + r.seats, 0);
            const availableSeats = ride.seats - approvedSeats;
            
            return (
                <div key={rideId} className="space-y-4">
                    {/* Ride Header */}
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-black uppercase">{ride.title}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                {availableSeats} of {ride.seats} seats available
                            </p>
                        </div>
                        {approved.length > 0 && ride.status === 'active' && (
                            <button
                                onClick={() => handleStartRide(rideId)}
                                className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all"
                            >
                                Start Ride ({approved.length} member{approved.length > 1 ? 's' : ''})
                            </button>
                        )}
                        {ride.status === 'ongoing' && (
                            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                Ongoing
                            </span>
                        )}
                    </div>
                    
                    {/* Approved Members */}
                    {approved.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Approved Members</p>
                            {approved.map(req => (
                                <div key={req._id || req.id} className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center">
                                        <span className="text-white text-sm font-black">{req.requesterName.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-black">{req.requesterName}</h4>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            {req.seats} seat{req.seats > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-green-100 text-green-700">
                                        Approved
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Pending Requests */}
                    {pending.map(req => (
                        <div key={req._id || req.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all hover:shadow-xl hover:shadow-black/5">
                            <div className="w-12 h-12 rounded-full bg-black flex-shrink-0 flex items-center justify-center">
                                <span className="text-white text-sm font-black italic">{req.requesterName.charAt(0)}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h4 className="text-sm font-black text-black">{req.requesterName}</h4>
                                    <div className="flex items-center gap-1">
                                        <span className="text-black text-xs">★</span>
                                        <span className="text-[10px] font-black text-gray-500">{req.requesterRating}</span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    {req.rideDate} · {req.seats} seat{req.seats > 1 ? 's' : ''}
                                    {req.seats > availableSeats && (
                                        <span className="text-red-500 ml-2 font-black">NOT ENOUGH SEATS</span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-500 font-medium italic">"{req.note}"</p>
                            </div>

                            <div className="flex gap-3 flex-shrink-0">
                                <button
                                    onClick={() => handleApproveRequest(req._id || req.id)}
                                    disabled={req.seats > availableSeats}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        req.seats > availableSeats
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-gray-800'
                                    }`}
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
                        </div>
                    ))}
                </div>
            );
        })}
        
        {pendingRequests.length === 0 && approvedRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 opacity-20">
                <h3 className="text-xl font-black uppercase tracking-[0.5em] text-center">No requests</h3>
            </div>
        )}
    </div>
);
}

export default RequestRide;