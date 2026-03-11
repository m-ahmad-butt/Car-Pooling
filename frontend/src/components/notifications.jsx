import { useDispatch, useSelector } from 'react-redux';
import { removeNotification, clearNotifications } from '../features/notificationSlice';

const Notifications = ({ notifications, onClose }) => {
    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.user.profile);

    const handleRemove = (id) => {
        dispatch(removeNotification(id));
    };

    const clearAll = () => {
        dispatch(clearNotifications(userProfile.email));
    };

    return (
        <div className="fixed inset-0 lg:absolute lg:inset-auto lg:top-full lg:right-0 lg:mt-3 lg:w-[300px] bg-white rounded-none lg:rounded-2xl shadow-2xl border-0 lg:border border-gray-100 z-[100] flex flex-col h-full lg:h-auto">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-10 lg:rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <h3 className="text-sm font-black tracking-tight">Notifications</h3>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={clearAll} className="text-red-500 font-bold text-[10px] hover:text-red-600 transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 lg:max-h-[350px]">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div key={n.id} className="bg-white border border-gray-100 p-3 rounded-xl flex gap-3 transition-all hover:shadow-lg hover:shadow-black/5 relative">
                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className="text-[11px] font-black text-black leading-tight">
                                        Update from <br />
                                        <span className="text-gray-900 font-bold">{n.from.split('@')[0]}</span>
                                    </h4>
                                    <button
                                        onClick={() => handleRemove(n.id)}
                                        className="text-red-400 p-0.5 hover:bg-red-50 rounded transition-all"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium mb-1 line-clamp-2">
                                    {n.message}
                                </p>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                    <span className="text-[9px] font-bold tracking-tighter">Just now</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center opacity-20">
                        <p className="text-[10px] font-black uppercase tracking-widest">Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
