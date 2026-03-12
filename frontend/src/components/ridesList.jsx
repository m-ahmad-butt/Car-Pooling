import RideCard from './rideCard';

const RidesList = ({ activeTab, filteredRides, userProfile, setSelectedRide }) => {
    if (activeTab === "Requests") return null;

    return (
        filteredRides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRides.map((ride, index) => (
                    <RideCard
                        key={`${ride.id}-${index}`}
                        ride={ride}
                        onViewDetails={(r) => setSelectedRide(r)}
                        isOwnRide={ride.riderEmail === userProfile.email}
                    />
                ))}
            </div>
        ) : (
            <div className="py-20 mt-12 text-center opacity-40 min-h-[50vh] flex items-center justify-center rounded-[2rem]">
                <p className="text-2xl font-black uppercase tracking-widest text-black/50">No posts</p>
            </div>
        )
    );
};

export default RidesList;
