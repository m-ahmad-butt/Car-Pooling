import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RideCard = ({ ride, onViewDetails, isOwnRide }) => {
    const navigate = useNavigate();
    const userProfile = useSelector(state => state.user?.profile);
    
    const handleProfileClick = () => {
        if (userProfile && ride.riderEmail === userProfile.email) {
            navigate('/profile');
        } else {
            navigate(`/profile/${ride.riderName.replace(/\s+/g, '-').toLowerCase()}`);
        }
    };

    return (
        <div className="relative bg-white border border-gray-100 rounded-[1rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group flex flex-col h-full ring-1 ring-black/[0.05]">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
            <div className="relative aspect-[16/10] bg-gray-50/50 flex items-center justify-center overflow-hidden">
                {ride.image ? (
                    <img
                        src={ride.image}
                        alt={ride.title}
                        className="w-full h-full object-cover transition-all duration-700"
                    />
                ) : (
                    <div className="flex flex-col items-center opacity-10">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-md text-black text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ring-1 ring-black/5">
                        {ride.vehicleType}
                    </div>
                </div>
            </div>

            <div className="p-7 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={handleProfileClick}
                        className="w-9 h-9 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0 hover:scale-110 transition-transform"
                    >
                        {ride.riderAvatar ? (
                            <img src={ride.riderAvatar} alt={ride.riderName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px] font-bold">{ride.riderName.charAt(0)}</span>
                        )}
                    </button>
                    <div className="flex-1 text-left">
                        <button
                            onClick={handleProfileClick}
                            className="text-[13px] font-bold text-black leading-none hover:text-gray-500 transition-colors"
                        >
                            {ride.riderName}
                        </button>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{ride.date}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full border border-black/5">
                        <span className="text-black font-extrabold text-[12px]">★</span>
                        <span className="text-[10px] font-bold tracking-tighter">{ride.riderRating}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-extrabold tracking-tight text-gray-900 group-hover:text-black line-clamp-2 uppercase leading-tight">
                        {ride.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-3 opacity-40">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-[11px] font-bold uppercase tracking-widest">{ride.campus}</span>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-black/[0.03] space-y-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Available Slots</p>
                            <p className="text-sm font-bold text-black">{ride.seats} Empty seats</p>
                        </div>
                        <button
                            onClick={() => onViewDetails(ride)}
                            className={`${isOwnRide ? 'bg-gray-400 opacity-60 cursor-not-allowed' : 'bg-black'} text-white px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-black/10`}
                            disabled={isOwnRide}
                        >
                            {isOwnRide ? 'Your Ride' : 'View Details'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideCard;
