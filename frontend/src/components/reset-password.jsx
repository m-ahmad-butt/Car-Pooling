import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { validatePassword } from "../utils/method";
import { changePassword } from "../features/authSlice";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        setPasswordError("");

        if (!validatePassword(password)) {
            setPasswordError("Password must be 8+ chars with uppercase, lowercase & special symbol.");
            return;
        }
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // resetEmail removed as per request. Navigation moved to default.
            navigate("/login");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* Left side */}
            <div className="w-full lg:w-[48%] flex flex-col justify-center px-12 lg:px-20 py-12">
                <div className="max-w-[340px] w-full mx-auto">
                    {/* dropme */}
                    <div className="mb-12 -ml-0.5">
                        <h1 className="text-4xl font-black tracking-tighter text-black flex items-baseline">
                            drop<span className="text-gray-300 font-bold italic ml-0.5">ME</span>
                        </h1>
                    </div>


                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-1">Reset password</h2>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            Choose a strong new password for your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[12px] font-bold text-gray-800 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 text-sm placeholder-gray-300 ${passwordError && passwordError !== "Passwords do not match."
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-200 focus:border-black focus:ring-black"
                                        }`}
                                    placeholder="New password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-gray-800 mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 text-sm placeholder-gray-300 ${passwordError === "Passwords do not match."
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-200 focus:border-black focus:ring-black"
                                        }`}
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {passwordError && (
                            <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5">
                                <span className="w-1 h-1 bg-red-500 rounded-full inline-block"></span>
                                {passwordError}
                            </p>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-black text-white py-2.5 rounded-lg text-sm font-black uppercase tracking-widest ${isLoading ? "opacity-50" : ""}`}
                            >
                                {isLoading ? "..." : "Reset Password"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-[12px] font-bold text-gray-400 uppercase tracking-tight">
                        Remember it? <button onClick={() => navigate("/login")} className="text-black font-black hover:underline underline-offset-4">Sign in</button>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="hidden lg:block lg:w-[52%] bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent flex flex-col justify-center px-20">
                    <div className="max-w-lg">
                        <h3 className="text-white text-6xl font-black italic tracking-tighter leading-[0.9] mb-8">
                            NEW <br />
                            <span className="text-white/40">PASSWORD??</span>
                        </h3>
                        <div className="space-y-2">
                            <p className="text-white/80 text-2xl font-bold tracking-tight uppercase">
                                Almost there.
                            </p>
                            <p className="text-white/50 text-xl font-medium leading-relaxed italic">
                                Set a strong password <br />
                                and get back on the road..
                            </p>
                        </div>
                    </div>
                </div>

                <div className="absolute top-10 right-10">
                    <div className="w-12 h-[1px] bg-white/20 mb-3"></div>
                    <div className="w-12 h-[1px] bg-white/10"></div>
                </div>

                <div className="absolute bottom-16 left-20 z-10 pointer-events-none">
                    <h3 className="text-white/5 text-[8rem] font-black italic tracking-[1.5rem] uppercase select-none leading-none">LOCK</h3>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;