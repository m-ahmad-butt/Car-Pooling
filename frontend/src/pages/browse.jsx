import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRides, setFilters } from '../features/rideSlice';
import RideCard from '../components/rideCard';
import RideDetails from '../components/rideDetails';
import Footer from '../components/footer';

const Browse = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const rides = useSelector(state => state.rides?.rides || []);
    const [selectedRide, setSelectedRide] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCampus, setSelectedCampus] = useState('All Campuses');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    useEffect(() => {
        const backendFilters = {};
        
        if (searchTerm) {
            backendFilters.search = searchTerm;
        }
        if (selectedCampus && selectedCampus !== 'All Campuses') {
            backendFilters.campus = selectedCampus;
        }
        
        dispatch(fetchRides(backendFilters));
    }, [dispatch, searchTerm, selectedCampus]);

    const filteredRides = Array.isArray(rides) ? rides.filter(ride => {
        if (ride.status === 'Done') return false;
        const matchesCategory = selectedCategory === 'All Categories' || ride.vehicleType === selectedCategory;
        return matchesCategory;
    }) : [];

    const handleBookRide = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <nav className="flex justify-between items-center px-6 lg:px-20 py-3 sticky top-0 bg-white z-50 shadow-sm border-b border-gray-100">
                <div className="flex items-baseline">
                    <h1 className="text-3xl font-black tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
                        drop<span className="text-gray-300 font-bold italic ml-0.5">ME</span>
                    </h1>
                </div>
                <div className="flex gap-6 items-center">
                    <button onClick={() => navigate('/login')} className="text-sm font-black uppercase tracking-widest hover:text-gray-500 transition-colors">Sign In</button>
                    <button onClick={() => navigate('/register')} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10">Join Now</button>
                </div>
            </nav>

            <main className="px-8 lg:px-20 py-12 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl font-black tracking-tight uppercase mb-2">Browse Available Rides</h2>
                    <p className="text-gray-400 font-medium">Find your perfect ride. Sign in to book.</p>
                </div>

                <div className="mb-8 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by destination, location, or rider..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-black transition-colors"
                        />
                    </div>
                    <select
                        value={selectedCampus}
                        onChange={(e) => setSelectedCampus(e.target.value)}
                        className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                    >
                        <option value="All Campuses">All Campuses</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Peshawar">Peshawar</option>
                    </select>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                    >
                        <option value="All Categories">All Categories</option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Van">Van</option>
                    </select>
                </div>

                {filteredRides.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 opacity-20">
                        <h3 className="text-2xl font-black uppercase tracking-[0.5em] text-center">No rides found</h3>
                        <p className="text-sm font-bold text-gray-400 mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRides.map((ride) => (
                            <RideCard
                                key={ride._id || ride.id}
                                ride={ride}
                                onViewDetails={setSelectedRide}
                                isOwnRide={false}
                            />
                        ))}
                    </div>
                )}
            </main>

            {selectedRide && (
                <RideDetails
                    ride={selectedRide}
                    onClose={() => setSelectedRide(null)}
                    onAccept={handleBookRide}
                />
            )}

            <Footer />
        </div>
    );
};

export default Browse;
