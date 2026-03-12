import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="mt-8 bg-black border-t border-white/10 font-sans text-white">

            <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
                <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-0 justify-between">

                    <div className="lg:w-1/3">
                        <h2 className="text-4xl font-black tracking-tighter flex items-baseline mb-3">
                            drop<span className="text-white/30 font-bold italic ml-0.5">ME</span>
                        </h2>
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                            Ride-sharing for<br />FAST NUCES students.
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Live on all campuses</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-10 lg:gap-20">
                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-5">Navigate</p>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Feed', path: '/feed' },
                                    { label: 'Post a Ride', path: '/post' },
                                    { label: 'My Profile', path: '/profile' },
                                    { label: 'Notifications', path: '/notifications' },
                                ].map(link => (
                                    <li key={link.label}>
                                        <button
                                            onClick={() => navigate(link.path)}
                                            className="text-[13px] font-bold text-white/60 uppercase tracking-tight"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>


                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-5">Account</p>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Sign In', path: '/login' },
                                    { label: 'Register', path: '/register' },
                                    { label: 'Forgot Password', path: '/forgot-password' },
                                ].map(link => (
                                    <li key={link.label}>
                                        <button
                                            onClick={() => navigate(link.path)}
                                            className="text-[13px] font-bold text-white/60 uppercase tracking-tight"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 lg:px-12">
                <div className="h-px bg-white/10"></div>
            </div>

            <div className="max-w-5xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    © {new Date().getFullYear()} dropME · Built for FAST NUCES
                </p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    Share rides · Save fuel · Make friends
                </p>
            </div>

        </footer>
    );
};

export default Footer;