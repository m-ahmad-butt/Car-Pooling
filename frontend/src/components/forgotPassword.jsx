import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { validateEmail } from "../utils/method";
import { setResetEmail } from "../features/authSlice";

function ForgotPasswordForm() {
    const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 mins
    const [isLoading, setIsLoading] = useState(false);

    const DEMO_OTP = "111111";

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const users = useSelector(state => state.auth.users);

    // otp timer
    useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [step, timeLeft]);

    // reset time format
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    //email input
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value && !validateEmail(value)) {
            setEmailError("Please use a valid university email (e.g. l23XXXX@lhr.nu.edu.pk)");
        } else {
            setEmailError("");
        }
    };

    // submit email
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError("Please use a valid university email (e.g. l23XXXX@lhr.nu.edu.pk)");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (!userExists) {
                setEmailError("This email is not registered with us.");
                return;
            }

            // otp page
            setStep(2);
            setTimeLeft(300);
        }, 1500);
    };

    // otp input
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        setOtpError("");
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    // otp input
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length < 6) {
            return;
        }
        if (otpValue !== DEMO_OTP) {
            setOtpError("Invalid OTP. Please try again.");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);

            // go to change pass page
            dispatch(setResetEmail(email));
            navigate("/reset-password");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* Left SIDE */}
            <div className="w-full lg:w-[48%] flex flex-col justify-center px-12 lg:px-20 py-12">
                <div className="max-w-[340px] w-full mx-auto">
                    {/* dropME */}
                    <div className="mb-12 -ml-0.5">
                        <h1 className="text-4xl font-black tracking-tighter text-black flex items-baseline">
                            drop<span className="text-gray-300 font-bold italic ml-0.5">ME</span>
                        </h1>
                    </div>

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
                                    onChange={handleEmailChange}
                                    className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all text-sm placeholder-gray-300 ${emailError ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-black focus:ring-black"}`}
                                    placeholder="l23XXX@pwr.nu.edu.pk"
                                    required
                                />
                                {emailError && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1.5">
                                        <span className="w-1 h-1 bg-red-500 rounded-full inline-block"></span>
                                        {emailError}
                                    </p>
                                )}
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || !!emailError}
                                    className={`w-full bg-black text-white py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all hover:bg-gray-900 ${isLoading || emailError ? "opacity-50" : ""}`}
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
                                        className={`w-11 h-11 text-center bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all text-lg font-black ${otpError ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-black focus:ring-black"}`}
                                    />
                                ))}
                            </div>

                            {otpError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    <p className="text-[11px] text-red-600 font-bold">{otpError}</p>
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-4">
                                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    Time Remaining: <span className="text-black">{formatTime(timeLeft)}</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || timeLeft === 0}
                                    className={`w-full bg-black text-white py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all hover:bg-gray-900 ${isLoading || timeLeft === 0 ? "opacity-50" : ""}`}
                                >
                                    {isLoading ? "..." : "Verify OTP"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
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

            {/* Right side */}
            <div className="hidden lg:block lg:w-[52%] bg-black relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent flex flex-col justify-center px-20">
                    <div className="max-w-lg">
                        <h3 className="text-white text-6xl font-black italic tracking-tighter leading-[0.9] mb-8 animate-in slide-in-from-left-8 duration-700">
                            BHOOL <br />
                            <span className="text-white/40">GAYE??</span>
                        </h3>
                        <div className="space-y-2 animate-in slide-in-from-left-12 duration-1000">
                            <p className="text-white/80 text-2xl font-bold tracking-tight uppercase">
                                DON'T WORRY.
                            </p>
                            <p className="text-white/50 text-xl font-medium leading-relaxed italic">
                                Use Email verification <br />
                                and reset your password..
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
