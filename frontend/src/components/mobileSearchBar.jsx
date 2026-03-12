import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../features/rideSlice';

const MobileSearchBar = ({ activeTab }) => {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.rides.filters);

    if (activeTab === 'Requests') return null;

    return (
        <div className="lg:hidden mb-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for rides..."
                    value={filters.searchTerm}
                    onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-6 pr-16 text-sm font-bold focus:ring-1 focus:ring-black/5 outline-none tracking-tight"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>
        </div>
    );
};

export default MobileSearchBar;
