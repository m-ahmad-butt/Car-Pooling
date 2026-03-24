import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertTo12Hour } from '../utils/method';

const RideDetails = ({ ride, onClose, onAccept }) => {
    const navigate = useNavigate();
    const [showRequestNote, setShowRequestNote] = useState(false);
    const [requestNote, setRequestNote] = useState('');

    const [requestedSeats, setRequestedSeats] = useState(1);

    if (!ride) return null;

    const handleRequestRide = () => {
        if (!showRequestNote) {
            setShowRequestNote(true);
        } else {
            onAccept(requestNote, requestedSeats);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-white overflow-y-auto font-sans text-black">

            <header className="px-6 lg:px-20 py-5 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="flex bg-gray-100/80 p-1 rounded-full">
                    <div className="px-8 py-1.5 rounded-full text-[12px] font-extrabold bg-white shadow-sm text-black uppercase tracking-widest">
                        Details
                    </div>
                </div>

                <div className="w-16" />
            </header>

            <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10 flex flex-col lg:flex-row gap-10 lg:items-start">

                <div className="lg:w-2/5 flex flex-col gap-6 lg:sticky lg:top-[73px]">

                    <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50">
                        {ride.image ? (
                            <img src={ride.image} alt={ride.title} className="w-full h-full object-cover grayscale" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-6 flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/profile/${ride.riderName.replace(/\s+/g, '-').toLowerCase()}`)}
                            className="w-12 h-12 rounded-full bg-black flex items-center justify-center overflow-hidden flex-shrink-0"
                        >
                            {ride.riderAvatar
                                ? <img src={ride.riderAvatar} className="w-full h-full object-cover" />
                                : <span className="text-white text-sm font-bold">{ride.riderName.charAt(0)}</span>
                            }
                        </button>
                        <div>
                            <button
                                onClick={() => navigate(`/profile/${ride.riderName.replace(/\s+/g, '-').toLowerCase()}`)}
                                className="text-sm font-bold text-black leading-none block"
                            >
                                {ride.riderName}
                            </button>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                {ride.riderRollNo} · {ride.campus}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest opacity-60">
                                {ride.date}
                            </p>
                        </div>
                    </div>

                    {showRequestNote && (
                        <div className="lg:hidden space-y-4">
                            <div>
                                <h2 className="text-xl font-extrabold uppercase tracking-tight mb-1">Add a Message</h2>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                    Let {ride.riderName} know why you're joining.
                                </p>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Number of Seats</p>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setRequestedSeats(Math.max(1, requestedSeats - 1))}
                                        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-bold"
                                    >-</button>
                                    <span className="text-lg font-black">{requestedSeats}</span>
                                    <button
                                        onClick={() => setRequestedSeats(Math.min(ride.seats, requestedSeats + 1))}
                                        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-bold"
                                    >+</button>
                                </div>
                            </div>
                            <div className="relative">
                                <textarea
                                    autoFocus
                                    value={requestNote}
                                    onChange={(e) => setRequestNote(e.target.value)}
                                    placeholder="e.g. Hi! I'll be at the gate on time..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 px-6 text-sm font-medium outline-none resize-none h-36"
                                />
                                {!requestNote && (
                                    <div className="absolute bottom-5 right-6 pointer-events-none opacity-20">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Required</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleRequestRide}
                                disabled={!requestNote}
                                className={`w-full bg-black text-white py-4 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] ${!requestNote ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                                Send Ride Request
                            </button>
                            <button
                                onClick={() => setShowRequestNote(false)}
                                className="w-full py-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:w-3/5 lg:max-h-[calc(100vh-73px)] lg:overflow-y-auto lg:pr-2">

                    {showRequestNote && (
                        <div className="hidden lg:block space-y-6 mt-16">
                            <div>
                                <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-2">Add a Message</h2>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                    Let {ride.riderName} know why you're joining this ride.
                                </p>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Number of Seats</p>
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => setRequestedSeats(Math.max(1, requestedSeats - 1))}
                                        className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-bold hover:bg-gray-50 transition-colors"
                                    >-</button>
                                    <span className="text-xl font-black">{requestedSeats}</span>
                                    <button
                                        onClick={() => setRequestedSeats(Math.min(ride.seats, requestedSeats + 1))}
                                        className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-bold hover:bg-gray-50 transition-colors"
                                    >+</button>
                                    <p className="text-[10px] font-bold text-gray-300 uppercase italic ml-auto">{ride.seats} seats available</p>
                                </div>
                            </div>
                            <div className="relative">
                                <textarea
                                    autoFocus
                                    value={requestNote}
                                    onChange={(e) => setRequestNote(e.target.value)}
                                    placeholder="e.g. Hi! I'll be at the gate on time. I have a small bag as well..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-6 px-8 text-sm font-medium outline-none resize-none h-44"
                                />
                                {!requestNote && (
                                    <div className="absolute bottom-6 right-8 pointer-events-none opacity-20">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Required</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleRequestRide}
                                disabled={!requestNote}
                                className={`w-full bg-black text-white py-5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] ${!requestNote ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                                Send Ride Request
                            </button>
                            <button
                                onClick={() => setShowRequestNote(false)}
                                className="w-full py-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Details tab */}
                    {!showRequestNote && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-extrabold tracking-tight uppercase mb-3">{ride.title}</h2>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{ride.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-6 rounded-2xl">
                                    <p className="text-[10px] font-bold text-gray-300 uppercase mb-2 tracking-widest">Vehicle</p>
                                    <p className="text-sm font-bold text-black uppercase">{ride.vehicleType}</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl">
                                    <p className="text-[10px] font-bold text-gray-300 uppercase mb-2 tracking-widest">Plate No.</p>
                                    <p className="text-sm font-bold text-black uppercase">{ride.vehicleNumber}</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl">
                                    <p className="text-[10px] font-bold text-gray-300 uppercase mb-2 tracking-widest">Available Seats</p>
                                    <p className="text-sm font-bold text-black">{ride.seats} Empty slots</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl">
                                    <p className="text-[10px] font-bold text-gray-300 uppercase mb-2 tracking-widest">Departure</p>
                                    <p className="text-sm font-bold text-black uppercase">{convertTo12Hour(ride.departureTime)}</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl col-span-2">
                                    <p className="text-[10px] font-bold text-gray-300 uppercase mb-2 tracking-widest">Contact Number</p>
                                    <p className="text-sm font-bold text-black">{ride.contactNumber}</p>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>

            {!showRequestNote && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50">
                    <button
                        onClick={handleRequestRide}
                        className="w-full bg-black text-white py-5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em]"
                    >
                        Request This Ride
                    </button>
                </div>
            )}

            {!showRequestNote && (
                <div className="hidden lg:block sticky bottom-0 bg-white border-t border-gray-50">
                    <div className="max-w-5xl mx-auto px-12 py-5 flex justify-end">
                        <button
                            onClick={handleRequestRide}
                            className="bg-black text-white py-4 px-12 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em]"
                        >
                            Request This Ride
                        </button>
                    </div>
                </div>
            )}

            {!showRequestNote && <div className="lg:hidden h-28" />}
        </div>
    );
};

export default RideDetails;