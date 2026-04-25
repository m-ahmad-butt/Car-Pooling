import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchOtherProfileAsync } from '../features/userSlice';
import { fetchReviewsByUser } from '../features/reviewSlice';
import { useAuth } from '@clerk/clerk-react';
import Footer from '../components/footer';

const OtherProfilePage = () => {
    const { userId } = useParams(); // This is now the email
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { getToken } = useAuth();

    const otherProfiles = useSelector(state => state.user.otherProfiles);
    const allReviews = useSelector(state => state.reviews.reviews);
    const userProfile = useSelector(state => state.user.profile);

    useEffect(() => {
        if (userId) {
            dispatch(fetchOtherProfileAsync({ email: userId, getToken }));
            dispatch(fetchReviewsByUser({ email: userId, getToken }));
        }
    }, [userId, dispatch, getToken]);

    // If it's the current user's profile, navigate to the main profile page
    useEffect(() => {
        if (userProfile && userId === userProfile.email) {
            navigate('/profile');
        }
    }, [userId, userProfile, navigate]);

    const userData = otherProfiles[userId] || {
        name: userId ? userId.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Loading User...",
        rollNo: "Loading...",
        campus: "Loading...",
        email: userId || "",
        image: null,
        stats: { rides: 0, comments: 0, rating: 0 },
    };

    const userReviews = allReviews
        .filter(r => r.targetEmail === userData.email)
        .map((r, idx) => ({
            id: r.id || idx,
            user: r.user,
            comment: r.comment,
            rating: r.rating,
        }));

    const avgRating = userReviews.length > 0
        ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
        : userData.stats.rating;

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <header className="px-8 lg:px-20 py-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" className="w-8 h-8 opacity-10" alt="" />
                    <h1 className="text-xl font-bold uppercase tracking-tight">
                        Profile
                    </h1>
                </div>
                <button
                    onClick={() => navigate('/feed')}
                    className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
                >
                    Back to Feed
                </button>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-12">

                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="relative group mb-6">
                        <div className="w-32 h-32 rounded-full border-[10px] border-white shadow-2xl overflow-hidden bg-black flex items-center justify-center relative z-10">
                            {userData.image ? (
                                <img src={userData.image} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white text-4xl font-extrabold">{userData.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/10 rounded-full blur-2xl opacity-20 -z-0"></div>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-2xl font-extrabold tracking-tight">{userData.name}</h2>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-gray-50/50 border border-gray-100 px-10 py-4 rounded-3xl text-center">
                            <p className="text-2xl font-extrabold text-black leading-none">{userData.stats.rides}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Rides</p>
                        </div>
                        <div className="bg-gray-50/50 border border-gray-100 px-10 py-4 rounded-3xl text-center">
                            <p className="text-2xl font-extrabold text-black leading-none">{avgRating}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Rating</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100/50 p-1.5 rounded-3xl flex items-center justify-center gap-2 mb-10 mx-auto w-fit">
                    <button
                        className="px-8 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest bg-white shadow-xl shadow-black/5 text-black"
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                            Reviews
                        </div>
                    </button>
                </div>

                <div className="space-y-4">
                    {userReviews.length > 0 ? userReviews.map(rev => (
                        <div key={rev.id} className="bg-white border border-gray-100 p-8 rounded-[2.5rem]">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden">
                                        <span className="text-white text-[10px] font-bold">{rev.user.charAt(0)}</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-black">{rev.user}</span>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-xs ${i < rev.rating ? 'text-black' : 'text-gray-100'}`}>★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 font-medium italic leading-relaxed">"{rev.comment}"</p>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center opacity-20">
                            <h3 className="text-xl font-black uppercase tracking-[0.5em]">No reviews yet</h3>
                        </div>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default OtherProfilePage;
