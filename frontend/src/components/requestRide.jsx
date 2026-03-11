import { useState } from "react";


function RequestRide() {
    const DUMMY_REQUESTS = [
        {
            id: 101,
            requesterName: "Sara Malik",
            requesterAvatar: null,
            requesterRating: 4.7,
            ride: "Morning commute to Campus",
            rideDate: "Today, 08:30 AM",
            seats: 1,
            note: "Hi! I live near Johar Town. Would love a seat!",
            status: "pending",
        },
        {
            id: 102,
            requesterName: "Hamza Rauf",
            requesterAvatar: null,
            requesterRating: 4.3,
            ride: "Weekly grocery run",
            rideDate: "Tomorrow, 06:00 PM",
            seats: 2,
            note: "Need 2 seats for me and a friend. We won't take long!",
            status: "pending",
        },
        {
            id: 103,
            requesterName: "Ayesha Tariq",
            requesterAvatar: null,
            requesterRating: 4.9,
            ride: "Morning commute to Campus",
            rideDate: "Today, 08:30 AM",
            seats: 1,
            note: "I'll be at the gate on time, promise!",
            status: "pending",
        },
    ];

    const [rideRequests, setRideRequests] = useState(DUMMY_REQUESTS);

    const handleApproveRequest = (id) => {
        setRideRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'approved' } : req));
    };

    const handleDeclineRequest = (id) => {
        setRideRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'declined' } : req));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase">Ride Requests</h2>
                    <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{rideRequests.filter(r => r.status === 'pending').length} pending</p>
                </div>
            </div>
            {rideRequests.filter(r => r.status === 'pending').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 opacity-20">
                    <svg className="w-24 h-24 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <h3 className="text-xl font-black uppercase tracking-[0.5em]">No pending requests</h3>
                </div>
            ) : (
                rideRequests.filter(r => r.status === 'pending').map(req => (
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