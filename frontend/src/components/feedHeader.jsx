import { useDispatch, useSelector } from 'react-redux';
import { setFilters, setActiveTab } from '../features/rideSlice';
import { getCampuses } from '../utils/method';
import Notifications from './notifications';

const FeedHeader = ({ showMobileMenu, setShowMobileMenu, setShowPostModal, notifications, showNotifications, setShowNotifications, userProfile, setShowProfileMenu, showProfileMenu, ProfileMenu }) => {
    const dispatch = useDispatch();
    const activeTab = useSelector(state => state.rides.activeTab);
    const filters = useSelector(state => state.rides.filters);

    return (
        <header className="px-8 lg:px-20 pt-10 pb-6 border-b border-gray-50 bg-white">
            <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
                <div className="flex items-center justify-between gap-6 lg:gap-8 sticky top-0 py-4 bg-white z-[60] -mt-4">
                    <div className="flex items-center lg:justify-start lg:flex-1 gap-6">
                        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight uppercase whitespace-nowrap leading-none">
                            Feed
                        </h1>

                        <div className="hidden lg:flex items-center gap-6 flex-1 max-w-2xl">
                            <div className="h-8 w-[1.5px] bg-gray-100"></div>
                            <div className="relative group flex-1">
                                <input
                                    type="text"
                                    placeholder="Search for rides, doston, or places..."
                                    value={filters.searchTerm}
                                    onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-6 text-sm font-semibold focus:ring-2 focus:ring-black/5 transition-all outline-none placeholder:text-gray-400"
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="lg:hidden ml-auto">
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${showMobileMenu ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={showMobileMenu ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <button
                            onClick={() => setShowPostModal(true)}
                            className="bg-black text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] transition-all hover:bg-gray-800 shadow-xl shadow-black/10"
                        >
                            Post a Ride
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 hover:bg-gray-50 transition-all group relative"
                            >
                                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] font-black text-white flex items-center justify-center">{notifications.length}</span>
                                )}
                            </button>
                            {showNotifications && <Notifications notifications={notifications} onClose={() => setShowNotifications(false)} />}
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 relative">
                            <div className="text-right">
                                <p className="text-[11px] font-black uppercase leading-none">{userProfile.name}</p>
                                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">FAST {userProfile.campusId || userProfile.campus}</p>
                            </div>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="w-10 h-10 rounded-full bg-black flex items-center justify-center border-4 border-white shadow-lg overflow-hidden transition-all"
                            >
                                {userProfile.image
                                    ? <img src={userProfile.image} className="w-full h-full object-cover" alt="profile" />
                                    : <span className="text-white text-xs font-black italic">{userProfile.name.charAt(0)}</span>
                                }
                            </button>
                            {showProfileMenu && <ProfileMenu onClose={() => setShowProfileMenu(false)} />}
                        </div>
                    </div>
                </div>

                <div className={`${showMobileMenu ? 'hidden lg:flex' : 'flex'} flex-col lg:flex-row justify-between lg:items-center gap-4`}>
                    {/* Desktop Tabs */}
                    <div className="lg:flex bg-gray-100/50 p-1.5 rounded-2xl hidden">
                        {['All Rides', 'Requests'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => dispatch(setActiveTab(tab))}
                                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="lg:hidden relative w-full">
                        <select
                            value={activeTab}
                            onChange={(e) => dispatch(setActiveTab(e.target.value))}
                            className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-xl text-sm font-bold tracking-tight outline-none focus:ring-1 focus:ring-black/5 transition-colors appearance-none"
                        >
                            {['All Rides', 'Requests'].map(tab => (
                                <option key={tab} value={tab}>{tab}</option>
                            ))}
                        </select>
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    {activeTab !== 'Requests' && (
                        <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <select
                                    value={filters.campus}
                                    onChange={(e) => dispatch(setFilters({ campus: e.target.value }))}
                                    className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-xl text-sm font-bold tracking-tight outline-none focus:ring-1 focus:ring-black/5 transition-colors appearance-none"
                                >
                                    <option>All Campuses</option>
                                    {getCampuses().map(campus => (
                                        <option key={campus.id} value={campus.name}>{campus.name}</option>
                                    ))}
                                </select>
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                            <div className="relative flex-1 lg:w-64">
                                <select
                                    value={filters.category}
                                    onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
                                    className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-xl text-sm font-bold tracking-tight outline-none focus:ring-1 focus:ring-black/5 transition-colors appearance-none"
                                >
                                    <option>All Categories</option>
                                    <option value="CAR">Cars</option>
                                    <option value="BIKE">Bikes</option>
                                </select>
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default FeedHeader;
