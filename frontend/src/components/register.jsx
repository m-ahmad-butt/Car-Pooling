import { useState, useEffect } from "react";
import { extractRollNo, validateEmail, getCampuses, validatePassword, validatePhone } from "../utils/method";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSignUp, useUser, useClerk } from "@clerk/clerk-react";
import { updateProfile } from "../features/userSlice";
import { authService } from "../services/auth.service";

function RegisterForm() {
    const navigate = useNavigate();
    const { isSignedIn, isLoaded: userLoaded } = useUser();
    const { setActive: clerkSetActive } = useClerk();
    
    // Clear errors if user becomes signed in
    useEffect(() => {
        if (isSignedIn) {
            setOtpError("");
            setServerError("");
            setIsLoading(false);
        }
    }, [isSignedIn]);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        campusId: "",
        contactNo: "",
        email: "",
        rollNo: "",
        password: "",
    });

    const campuses = getCampuses();
    const dispatch = useDispatch();
    const { signUp, isLoaded, setActive } = useSignUp();

    const TOTAL_STEPS = 4;
    const stepLabels = ["Name", "Campus", "Email", "Password"];

    // Already logged in → go straight to feed
    if (isSignedIn) return <Navigate to="/feed" replace />;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "contactNo") {
            if (value && !validatePhone(value)) {
                setPhoneError("Must start with 03 and be 11 digits");
            } else {
                setPhoneError("");
            }
        }

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

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1 && (!formData.firstName || !formData.lastName)) return;
        if (step === 2 && (!formData.campusId || !formData.contactNo || !!phoneError)) return;
        if (step === 3 && (!formData.email || !!emailError)) return;
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setPasswordError("");
        setServerError("");

        if (!validatePassword(formData.password)) {
            setPasswordError("Password must be 8+ chars with uppercase, lowercase & special symbol.");
            return;
        }
        if (formData.password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            await signUp.create({
                emailAddress: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setStep(5);
        } catch (err) {
            const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Registration failed.";
            setServerError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (isLoading || !isLoaded) return;
        
        if (isSignedIn) {
            navigate('/feed', { replace: true });
            return;
        }

        setOtpError("");
        const code = otpCode.join("");
        if (code.length < 6) return;

        setIsLoading(true);
        try {
            const result = await signUp.attemptEmailAddressVerification({ code });

            if (result.status === "complete") {
                const setActiveMethod = setActive || clerkSetActive;
                
                // Wait a bit before setting active to ensure Clerk is ready
                await new Promise(resolve => setTimeout(resolve, 500));
                
                if (setActiveMethod && result.createdSessionId) {
                    await setActiveMethod({ session: result.createdSessionId });
                }
                
                const profileData = {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    campus: campuses.find(c => c.id === formData.campusId)?.name || formData.campusId,
                    contactNo: formData.contactNo,
                    rollNo: formData.rollNo,
                };

                try {
                    await authService.syncUser({
                        clerkId: result.createdUserId,
                        email: formData.email,
                        name: `${formData.firstName} ${formData.lastName}`,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        campus: campuses.find(c => c.id === formData.campusId)?.name || formData.campusId,
                        contactNo: formData.contactNo,
                        rollNo: formData.rollNo
                    });
                } catch (syncError) {
                    console.error('Backend sync failed:', syncError);
                }

                dispatch(updateProfile(profileData));
                setOtpError("");
                setIsLoading(false);
                
                // Wait a bit more before navigation to ensure sync completes
                await new Promise(resolve => setTimeout(resolve, 300));
                navigate('/feed', { replace: true });
            } else {
                setOtpError("Verification incomplete. Please try again.");
                setIsLoading(false);
            }
        } catch (err) {
            const code = err?.errors?.[0]?.code;
            const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message;

            if (code === 'session_exists' || /already\s+signed\s+in/i.test(msg)) {
                setOtpError("");
                setIsLoading(false);
                navigate('/feed', { replace: true });
                return;
            }

            setOtpError(msg || "Invalid code.");
            setIsLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otpCode.map((d, idx) => (idx === index ? element.value : d))];
        setOtpCode(newOtp);
        setOtpError("");
        if (element.value && element.nextSibling) element.nextSibling.focus();
    };

    const handleResendOtp = async () => {
        try {
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setOtpCode(["", "", "", "", "", ""]);
            setOtpError("");
        } catch {
            setOtpError("Failed to resend code. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

            <div className="w-full lg:w-[48%] flex flex-col justify-center px-12 lg:px-20 py-12">
                <div className="max-w-[340px] w-full mx-auto">

                    <div className="mb-10 -ml-0.5">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-black flex items-baseline">
                            drop<span className="text-gray-300 font-bold ml-0.5">ME</span>
                        </h1>
                    </div>

                    {step <= TOTAL_STEPS && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                    Step {step} of {TOTAL_STEPS}
                                    <span className="text-black ml-2">— {stepLabels[step - 1]}</span>
                                </p>
                                <p className="text-[11px] font-extrabold text-gray-300 uppercase tracking-widest">
                                    {Math.round((step / TOTAL_STEPS) * 100)}%
                                </p>
                            </div>
                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black rounded-full transition-all duration-300"
                                    style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-1">
                            {step === 1 ? "What's your name?" :
                                step === 2 ? "Your campus & contact" :
                                    step === 3 ? "Verify student status" :
                                        step === 4 ? "Set a password" :
                                            "Verify your email"}
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            {step === 1 ? "Enter your full legal name" :
                                step === 2 ? "Choose your campus and add a contact number" :
                                    step === 3 ? "Use your FAST university email" :
                                        step === 4 ? "Make it strong and secure" :
                                            `We sent a 6-digit code to ${formData.email}`}
                        </p>
                    </div>

                    {step <= TOTAL_STEPS && (
                        <form onSubmit={step === TOTAL_STEPS ? handleRegister : handleNext} className="space-y-5">

                            {step === 1 && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-800 mb-2">First Name</label>
                                        <input
                                            type="text" name="firstName" value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm placeholder-gray-300"
                                            placeholder="First name" required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-800 mb-2">Last Name</label>
                                        <input
                                            type="text" name="lastName" value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm placeholder-gray-300"
                                            placeholder="Last name" required
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-800 mb-2">Campus</label>
                                        <div className="relative">
                                            <select
                                                name="campusId" value={formData.campusId} onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm appearance-none text-gray-600"
                                                required
                                            >
                                                <option value="">Choose campus</option>
                                                {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-800 mb-2">Contact Number</label>
                                        <input
                                            type="tel" name="contactNo" value={formData.contactNo}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 text-sm placeholder-gray-300 ${phoneError ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-black focus:ring-black"}`}
                                            placeholder="03XX-XXXXXXX" required
                                        />
                                        {phoneError && (
                                            <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1.5">
                                                <span className="w-1 h-1 bg-red-500 rounded-full inline-block"></span>
                                                {phoneError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-800 mb-2">University Email</label>
                                        <input
                                            type="email" name="email" value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 text-sm placeholder-gray-300 ${emailError ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-black focus:ring-black"}`}
                                            placeholder="l23XXX@lhr.nu.edu.pk" required
                                        />
                                        {emailError && (
                                            <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1.5">
                                                <span className="w-1 h-1 bg-red-500 rounded-full inline-block"></span>
                                                {emailError}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-800 mb-2">Student ID</label>
                                        <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 font-mono text-xs">
                                            {formData.rollNo || "Auto-extracted from email..."}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-800 mb-2">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password" value={formData.password}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 text-sm placeholder-gray-300 ${passwordError && passwordError !== "Passwords do not match." ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-black focus:ring-black"}`}
                                                placeholder="Password" required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase text-gray-400">
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
                                                className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 text-sm placeholder-gray-300 ${passwordError === "Passwords do not match." ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-black focus:ring-black"}`}
                                                placeholder="Confirm password" required
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase text-gray-400">
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
                                    {serverError && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            <p className="text-[11px] text-red-600 font-bold">{serverError}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                {step > 1 && (
                                    <button type="button" onClick={handleBack}
                                        className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-extrabold text-gray-500 uppercase tracking-tighter">
                                        Back
                                    </button>
                                )}
                                <button type="submit" disabled={isLoading || !isLoaded}
                                    className={`flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-extrabold uppercase tracking-widest ${isLoading ? "opacity-50" : ""}`}>
                                    {isLoading ? "..." : step === TOTAL_STEPS ? "Complete" : "Next →"}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 5 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="flex justify-between gap-2">
                                {otpCode.map((data, index) => (
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
                                <button type="submit" disabled={isLoading}
                                    className={`w-full bg-black text-white py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all hover:bg-gray-900 ${isLoading ? "opacity-50" : ""}`}>
                                    {isLoading ? "..." : "Verify & Continue"}
                                </button>
                                <button type="button" onClick={handleResendOtp}
                                    className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                                    Resend code
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">
                            Already registered?{" "}
                            <button onClick={() => navigate("/login")} className="text-black font-extrabold hover:underline underline-offset-4">
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block lg:w-[52%] bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent flex flex-col justify-center px-20">
                    <div className="max-w-lg">
                        <h3 className="text-white text-6xl font-extrabold tracking-tighter leading-[0.9] mb-8">
                            PETROL <br />
                            <span className="text-white/40">320PKR??</span>
                        </h3>
                        <div className="space-y-2">
                            <p className="text-white/80 text-2xl font-bold tracking-tight uppercase">Don't worry.</p>
                            <p className="text-white/50 text-xl font-medium leading-relaxed">
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
                    <h3 className="text-white/5 text-[10rem] font-extrabold tracking-[1.5rem] uppercase select-none leading-none">FAST</h3>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;