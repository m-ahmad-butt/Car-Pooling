import { useState } from "react";
import toast from "react-hot-toast";
import { extractRollNo, validateEmail } from "../utils/method";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        rollNo: "",
        password: "",
        campusId: ""
    });

    const campuses = [
        { id: "LHR", name: "Lahore" },
        { id: "ISB", name: "Islamabad" },
        { id: "KHI", name: "Karachi" },
        { id: "PWR", name: "Peshawar" },
        { id: "MTN", name: "Multan" },
        { id: "CFD", name: "Faisalabad" }
    ];

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "email") {
            if (validateEmail(value)) {
                setEmailError("");
                setFormData(prev => ({ ...prev, rollNo: extractRollNo(value) }));
            } else {
                setEmailError("Invalid university email");
                setFormData(prev => ({ ...prev, rollNo: "" }));
            }
        }
    };

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return regex.test(pass);
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (!formData.fullName || !formData.campusId) {
                return;
            }
        } else if (step === 2) {
            if (!formData.email || !!emailError) {
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setPasswordError("");

        if (!validatePassword(formData.password)) {
            setPasswordError("Password must be 8+ chars with uppercase, lowercase & special symbol.");
            return;
        }
        if (formData.password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Account created successfully!");
            navigate("/login");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* Left side */}
            <div className="w-full lg:w-[48%] flex flex-col justify-center px-12 lg:px-20 py-12">
                <div className="max-w-[340px] w-full mx-auto">
                    <div className="mb-12 -ml-0.5">
                        <h1 className="text-4xl font-black tracking-tighter text-black flex items-baseline">
                            drop<span className="text-gray-300 font-bold italic ml-0.5">ME</span>
                        </h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-1">Create your account</h2>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            {step === 1 ? "Let's get started with your basics" : step === 2 ? "Verify your student status" : "Set up a secure password"}
                        </p>
                    </div>



                    <form onSubmit={step === 3 ? handleRegister : handleNext} className="space-y-5">
                        {step === 1 && (
                            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-800 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm placeholder-gray-300"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-800 mb-2">Campus</label>
                                    <div className="relative">
                                        <select
                                            name="campusId"
                                            value={formData.campusId}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-all text-sm appearance-none text-gray-600"
                                            required
                                        >
                                            <option value="">Choose Campus</option>
                                            {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-800 mb-2">University Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all text-sm placeholder-gray-300 ${emailError ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-black focus:ring-black"}`}
                                        placeholder="Email address"
                                        required
                                    />
                                    {emailError && <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1">{emailError}</p>}
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-800 mb-2">Student ID</label>
                                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 font-mono text-xs">
                                        {formData.rollNo || "Auto-extracted..."}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-800 mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all text-sm placeholder-gray-300 ${passwordError ? "border-red-500 focus:ring-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]" : "border-gray-200 focus:border-black focus:ring-black"}`}
                                            placeholder="Password"
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
                              
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-800 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all text-sm placeholder-gray-300 ${passwordError === "Passwords do not match" ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-black focus:ring-black"}`}
                                            placeholder="Confirm password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400 hover:text-black"
                                        >
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    
                                </div>
                                  {passwordError && (
                                        <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                            {passwordError}
                                        </p>
                                    )}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-black text-gray-500 hover:bg-gray-50 transition-all uppercase tracking-tighter"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all hover:bg-gray-900 ${isLoading ? "opacity-50" : ""}`}
                            >
                                {isLoading ? "..." : step === 3 ? "Complete" : "Next"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">
                            Already registered? <button onClick={() => navigate("/login")} className="text-black font-black hover:underline underline-offset-4">Sign in</button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="hidden lg:block lg:w-[52%] bg-black relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent flex flex-col justify-center px-20">
                    <div className="max-w-lg">
                        <h3 className="text-white text-6xl font-black italic tracking-tighter leading-[0.9] mb-8 animate-in slide-in-from-left-8 duration-700">
                            PETROL <br />
                            <span className="text-white/40">320PKR??</span>
                        </h3>

                        <div className="space-y-2 animate-in slide-in-from-left-12 duration-1000">
                            <p className="text-white/80 text-2xl font-bold tracking-tight uppercase">
                                Don't worry.
                            </p>
                            <p className="text-white/50 text-xl font-medium leading-relaxed italic">
                                Share rides and save money <br />
                                and make friends..
                            </p>
                        </div>
                    </div>
                </div>

                <div className="absolute top-10 right-10">
                    <div className="w-12 h-[1px] bg-white/20 mb-3"></div>
                    <div className="w-12 h-[1px] bg-white/10"></div>
                </div>

                <div className="absolute bottom-16 left-20 z-10 pointer-events-none">
                    <h3 className="text-white/5 text-[10rem] font-black italic tracking-[1.5rem] uppercase select-none leading-none">FAST</h3>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
