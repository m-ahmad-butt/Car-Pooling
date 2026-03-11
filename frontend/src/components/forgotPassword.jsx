import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FORGOT_IMAGE_PATH = "/image.png";

function ForgotPasswordForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 mins
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [step, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert(`OTP sent to: ${email}`);
            setStep(2);
            setTimeLeft(300); // Reset timer
        }, 1500);
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        // Focus next
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length < 6) {
            toast.error("Please enter the full OTP");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert(`OTP verified: ${otpValue}`);
            toast.success("Identity verified! Set your new password.");
            // navigate("/reset-password");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* Left Form Section */}
            <div className="w-full lg:w-[48%] flex flex-col justify-center px-12 lg:px-20 py-12">
                <div className="max-w-[340px] w-full mx-auto">
                    {/* Logo/Brand */}
                    <div className="mb-12 -ml-0.5">
                        <h1 className="text-4xl font-black tracking-tighter text-black flex items-baseline">
                            drop<span className="text-gray-300 font-bold italic ml-0.5">ME</span>
                        </h1>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-1">
                            {step === 1 ? "Forgot password?" : "Verify Identity"}
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            {step === 1
                                ? "Enter your email and we'll send you an OTP"
                                : `Verify the digit code sent to ${email}`}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[12px] font-bold text-gray-800 mb-2">University Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm placeholder-gray-300"
                                    placeholder="l23XXX@pwr.nu.edu.pk"
                                    required
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full bg-black text-white py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all hover:bg-gray-900 active:scale-[0.98] ${isLoading ? "opacity-50" : ""}`}
                                >
                                    {isLoading ? "..." : "Send OTP"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="flex justify-between gap-2">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={data}
                                        onChange={(e) => handleOtpChange(e.target, index)}
                                        onFocus={(e) => e.target.select()}
                                        className="w-11 h-11 text-center bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-lg font-black"
                                    />
                                ))}
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    Time Remaining: <span className="text-black">{formatTime(timeLeft)}</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || timeLeft === 0}
                                    className={`w-full bg-black text-white py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all hover:bg-gray-900 active:scale-[0.98] ${isLoading || timeLeft === 0 ? "opacity-50" : ""}`}
                                >
                                    {isLoading ? "..." : "Verify OTP"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); }}
                                    className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                                >
                                    Resend email
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 text-center text-[12px] font-bold text-gray-400 uppercase tracking-tight">
                        Remember it? <button onClick={() => navigate("/login")} className="text-black font-black hover:underline underline-offset-4">Sign in</button>
                    </div>
                </div>
            </div>

            {/* Right Visual Section */}
            <div className="hidden lg:block lg:w-[52%] bg-black relative overflow-hidden group">
                <img
                    src={FORGOT_IMAGE_PATH}
                    alt="Reset Visual"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent flex flex-col justify-center px-20">
                    <div className="max-w-lg">
                        <h3 className="text-white text-6xl font-black italic tracking-tighter leading-[0.9] mb-8 animate-in slide-in-from-left-8 duration-700">
                            SECURE <br />
                            <span className="text-white/40">ACCESS??</span>
                        </h3>
                        <div className="space-y-2 animate-in slide-in-from-left-12 duration-1000">
                            <p className="text-white/80 text-2xl font-bold tracking-tight uppercase">
                                Protect your account.
                            </p>
                            <p className="text-white/50 text-xl font-medium leading-relaxed italic">
                                Use Multi-Factor verification <br />
                                and keep your data safe..
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-16 left-20 z-10 pointer-events-none">
                    <h3 className="text-white/5 text-[8rem] font-black italic tracking-[1.5rem] uppercase select-none leading-none">SAFE</h3>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordForm;
