import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
            <nav className="flex justify-between items-center px-6 lg:px-20 py-3 fixed top-0 w-full bg-white z-50 shadow-sm">
                <div className="flex items-baseline">
                    <h1 className="text-3xl font-black tracking-tighter">
                        drop<span className="text-gray-300 font-bold italic ml-0.5">ME</span>
                    </h1>
                </div>
                <div className="flex gap-6 items-center">
                    <button onClick={() => navigate("/login")} className="text-sm font-black uppercase tracking-widest hover:text-gray-500 transition-colors">Sign In</button>
                    <button onClick={() => navigate("/register")} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10">Join Now</button>
                </div>
            </nav>

            <main className="pt-8 lg:pt-24 pb-20 px-8 lg:px-20 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="w-full lg:w-3/5 space-y-4 relative z-10">
                        <div className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                Exclusive for FAST-NUCES
                            </h2>
                            <h3 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-bottom-4 duration-700">
                                PETROL 50RS <br />
                                MEHNGA?? <br />
                                <span className="text-gray-200">NOT CHANGA!!</span>
                            </h3>
                        </div>

                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            <p className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-800 leading-snug">
                                Share rides. Save money. <br />
                                <span className="italic font-black text-black underline decoration-gray-200 underline-offset-8">Make friends.</span>
                            </p>
                            <p className="text-gray-400 max-w-md font-medium leading-relaxed">
                                Join the FASTest growing carpooling community.
                                Bachao fuel aur khao doston ke sath pizza.
                                Simple, secure, and made specifically for NUCES students.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <button onClick={() => navigate("/register")} className="bg-black text-white px-10 py-4 rounded-xl text-md font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all shadow-2xl shadow-black/20">
                                Get Started
                            </button>
                            <button onClick={() => navigate("/login")} className="border-2 border-gray-100 px-10 py-4 rounded-xl text-md font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">
                                Login
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:block lg:w-2/5 relative animate-in fade-in slide-in-from-right-12 duration-1000">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square bg-gray-50 rounded-full -z-10 animate-pulse duration-[5000ms]"></div>

                        <div className="relative grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-20">
                                <div className="bg-white border-2 border-gray-100 p-4 rounded-3xl transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer group">
                                    <img src="/open_peeps/late-for-class.png" alt="Student" className="w-full transition-transform" />
                                    <p className="text-[10px] font-black uppercase text-center mt-2 tracking-widest">Late for Class?</p>
                                </div>
                                <div className="bg-white border-2 border-gray-100 p-4 rounded-3xl transform rotate-3 hover:translate-y-[-10px] transition-transform cursor-pointer group">
                                    <img src="/open_peeps/chillin.png" alt="Student" className="w-full transition-transform" />
                                    <p className="text-[10px] font-black uppercase text-center mt-2 tracking-widest text-black">Chillin'.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white border-2 border-gray-100 p-4 rounded-3xl transform rotate-6 hover:rotate-0 transition-transform cursor-pointer group">
                                    <img src="/open_peeps/coffee.png" alt="Student" className="w-full transition-transform" />
                                    <p className="text-[10px] font-black uppercase text-center mt-2 tracking-widest text-black">Coffee Break</p>
                                </div>
                                <div className="bg-white border-2 border-gray-100 p-4 rounded-3xl transform -rotate-3 hover:rotate-2 transition-transform cursor-pointer group">
                                    <img src="/open_peeps/walking-contradiction.png" alt="Student" className="w-full transition-transform" />
                                    <p className="text-[10px] font-black uppercase text-center mt-2 tracking-widest">Wanderer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


            <section className="bg-black py-24 text-white">
                <div className="max-w-7xl mx-auto px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="space-y-4 group">
                        <h4 className="text-5xl font-black italic tracking-tighter group-hover:text-gray-400 transition-colors italic uppercase">FAST</h4>
                        <p className="text-gray-500 font-medium">Built specifically for FAST NUCES students across all campuses. Islamabad se Karachi tak, we got you.</p>
                    </div>
                    <div className="space-y-4 group">
                        <h4 className="text-5xl font-black italic tracking-tighter group-hover:text-gray-400 transition-colors italic uppercase">NUCES</h4>
                        <p className="text-gray-500 font-medium">Verified student community. No outsiders. Just pure peer-to-peer sharing ecosystem.</p>
                    </div>
                    <div className="space-y-4 group">
                        <h4 className="text-5xl font-black italic tracking-tighter group-hover:text-gray-400 transition-colors italic uppercase">SAVINGS</h4>
                        <p className="text-gray-500 font-medium">Split the fuel costs. Save big on your monthly commute. Don't let petrol prices kill your vibe.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
