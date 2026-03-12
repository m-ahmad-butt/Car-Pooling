import { useDispatch } from 'react-redux';
import { logoutAuth } from '../features/authSlice';
import { logoutUser } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const FeedMobileMenu = ({ showMobileMenu, setShowMobileMenu, setShowPostModal, setShowNotifications, notifications, navigate }) => {
    const dispatch = useDispatch();

    if (!showMobileMenu) return null;

    return (
        <div className="lg:hidden fixed inset-0 bg-white z-[90] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 sticky top-0 bg-white z-10">
                <h1 className="text-2xl font-black tracking-tighter uppercase">Feed</h1>
                <button
                    onClick={() => setShowMobileMenu(false)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="px-8 py-10 space-y-12">
                <nav className="space-y-2">
                    <button
                        onClick={() => { setShowPostModal(true); setShowMobileMenu(false); }}
                        className="w-full flex items-center gap-5 px-4 py-4 rounded-2xl text-gray-800 font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Post a Ride
                    </button>

                    <button
                        onClick={() => { setShowNotifications(true); setShowMobileMenu(false); }}
                        className="w-full flex items-center justify-between px-4 py-4 rounded-2xl text-gray-800 font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-5">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            Notifications
                        </div>
                        {notifications.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">{notifications.length}</span>
                        )}
                    </button>

                    <button
                        onClick={() => { navigate('/profile'); setShowMobileMenu(false); }}
                        className="w-full flex items-center gap-5 px-4 py-4 rounded-2xl text-gray-800 font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        View Profile
                    </button>
                </nav>

                <div className="border-t border-gray-100 pt-6">
                    <button
                        onClick={() => {
                            dispatch(logoutAuth());
                            dispatch(logoutUser());
                            navigate('/login');
                            setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center gap-5 px-4 py-4 rounded-2xl text-red-500 font-bold text-sm uppercase tracking-wide hover:bg-red-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedMobileMenu;
