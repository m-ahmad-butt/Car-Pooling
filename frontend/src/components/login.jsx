import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSignIn, useUser } from "@clerk/clerk-react";
import { loginUser } from "../features/authSlice";
import { validateEmail } from "../utils/method";

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [formData, setFormData] = useState({ email: "", password: "" });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { signIn, isLoaded } = useSignIn();
    const { isSignedIn } = useUser();

    // Already logged in → go straight to feed
    if (isSignedIn) return <Navigate to="/feed" replace />;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setLoginError("");
        if (name === "email") {
            if (value && !validateEmail(value)) {
                setEmailError("Please use a valid university email (e.g. l23XXXX@lhr.nu.edu.pk)");
            } else {
                setEmailError("");
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        if (emailError) return;
        if (!validateEmail(formData.email)) {
            setEmailError("Please use a valid university email (e.g. l23XXXX@lhr.nu.edu.pk)");
            return;
        }

        setIsLoading(true);
        setLoginError("");

        try {
            const result = await signIn.create({
                identifier: formData.email,
                password: formData.password,
            });

            if (result.status === "complete") {
                dispatch(loginUser({ email: formData.email }));
                navigate("/feed");
            } else {
                setLoginError("Login incomplete. Please try again.");
            }
        } catch (err) {
            const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Invalid email or password.";
            setLoginError(msg);
        } finally {
            setIsLoading(false);
        }
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
                        <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h2>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-[12px] font-bold text-gray-800 mb-2">University Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
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
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[12px] font-bold text-gray-800">Password</label>
                                <button
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm placeholder-gray-300"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400 hover:text-black"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                <p className="text-[11px] text-red-600 font-bold">{loginError}</p>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || !!emailError || !isLoaded}
                                className={`w-full bg-black text-white py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all hover:bg-gray-900 ${isLoading || emailError ? "opacity-50" : ""}`}
                            >
                                {isLoading ? "..." : "Sign In"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-[12px] font-bold text-gray-400 uppercase tracking-tight">
                        New here? <button onClick={() => navigate("/register")} className="text-black font-black hover:underline underline-offset-4">Create account</button>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="hidden lg:block lg:w-[52%] bg-black relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent flex flex-col justify-center px-20">
                    <div className="max-w-lg">
                        <h3 className="text-white text-6xl font-black italic tracking-tighter leading-[0.9] mb-8 animate-in slide-in-from-left-8 duration-700">
                            FAST <br />
                            <span className="text-white/40">COMMUTE??</span>
                        </h3>
                        <div className="space-y-2 animate-in slide-in-from-left-12 duration-1000">
                            <p className="text-white/80 text-2xl font-bold tracking-tight uppercase">
                                Paisay bach rahe hain na?
                            </p>
                            <p className="text-white/50 text-xl font-medium leading-relaxed italic">
                                Reach your campus on time <br />
                                and save fuel costs..
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-16 left-20 z-10 pointer-events-none">
                    <h3 className="text-white/5 text-[8rem] font-black italic tracking-[1.5rem] uppercase select-none leading-none">RIDE</h3>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
