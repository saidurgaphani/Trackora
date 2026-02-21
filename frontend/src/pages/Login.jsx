import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Lock, Mail, ArrowRight, Loader2, Sun as Sunburst } from 'lucide-react';
import NeuralBackground from '../components/ui/flow-field-background';

// Firebase imports
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from '../firebaseSetup';

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
    const containerRef = useRef();
    const formRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState('student');
    const [firebaseError, setFirebaseError] = useState("");

    // Read the intended destination if it was passed via state
    const from = location.state?.from || (loginType === 'admin' ? '/admin/dashboard' : '/student/dashboard');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.split-left', {
            x: '-10%',
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
            .from('.split-right', {
                x: '10%',
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, "<")
            .fromTo('.animate-item',
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out'
                },
                "-=0.5"
            );
    }, { scope: containerRef });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setFirebaseError("");
        try {
            const auth = getAuth(app);
            const db = getFirestore(app);

            // Sign in
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            // Optional: Verify role against what they selected
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const actualRole = userData.role || 'student';

                if (loginType === 'admin' && actualRole !== 'admin' && actualRole !== 'trainer') {
                    throw new Error("You are not authorized to login as an Admin/Trainer.");
                }
            } else if (loginType === 'admin') {
                // No profile and tried admin (assuming default user is student)
                throw new Error("Admin privileges not found.");
            }

            // AuthContext observes the state change and handles updating its local state
            navigate(loginType === 'admin' ? '/admin/dashboard' : from);
        } catch (error) {
            console.error("Firebase Login Error", error);

            // Map common errors
            if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                setFirebaseError("Invalid email or password.");
            } else {
                setFirebaseError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen relative bg-slate-50 dark:bg-black flex items-center justify-center overflow-hidden p-4 md:p-8">
            <NeuralBackground
                className="w-full h-full"
                trailOpacity={0.15}
                speed={0.8}
            />

            {/* Soft Ambient Radial Glow behind the Auth Card */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    aria-hidden="true"
                    className="absolute -top-10 left-1/2 w-full h-[150%] max-w-7xl -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--color-primary-500)_0%,transparent_50%)] opacity-20 dark:opacity-10 blur-[80px]"
                />
            </div>

            <div className="w-full relative z-10 max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 backdrop-blur-3xl">

                {/* Left Side (Dark Graphic inspired by FullScreenSignup) */}
                <div className="split-left w-full h-auto min-h-[40rem] z-0 absolute md:relative md:w-1/2 bg-black text-white p-8 md:p-12 hidden md:flex flex-col justify-end overflow-hidden rounded-l-3xl border-r border-slate-800">
                    <div className="w-full h-full z-10 absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>

                    {/* Gradient Lines */}
                    <div className="flex absolute inset-0 z-0 overflow-hidden backdrop-blur-2xl pointer-events-none">
                        <div className="h-[40rem] w-[4rem] bg-gradient-to-b from-transparent via-black to-white/10 opacity-30 transform translate-x-12"></div>
                        <div className="h-[40rem] w-[4rem] bg-gradient-to-b from-transparent via-black to-white/10 opacity-30 transform translate-x-32"></div>
                        <div className="h-[40rem] w-[4rem] bg-gradient-to-b from-transparent via-black to-white/10 opacity-30 transform translate-x-52"></div>
                    </div>

                    {/* Glowing Orbs matching design */}
                    <div className="w-[15rem] h-[15rem] bg-primary-500 absolute z-[1] rounded-full -bottom-10 -left-10 opacity-90 blur-xl"></div>
                    <div className="w-[8rem] h-[5rem] bg-white absolute z-[1] rounded-full bottom-0 left-32 blur-md opacity-80"></div>
                    <div className="w-[8rem] h-[5rem] bg-white absolute z-[1] rounded-full bottom-0 left-48 blur-md opacity-80"></div>

                    <div className="relative z-20 pt-12">
                        <h1 className="text-3xl md:text-4xl font-medium leading-tight tracking-tight animate-item mb-4 max-w-sm text-white">
                            TrackOra.
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl animate-item max-w-sm opacity-80">
                            Welcome to TrackOra — let's get you placed quickly.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="split-right w-full md:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white/50 dark:bg-slate-950/50 z-20 rounded-3xl md:rounded-l-none text-slate-900 dark:text-slate-50">

                    <div className="flex flex-col mb-8 animate-item">
                        <div className="text-primary-500 mb-6 hidden md:block">
                            <Sunburst className="h-10 w-10" />
                        </div>
                        <h2 className="text-4xl font-semibold mb-2 tracking-tight text-slate-900 dark:text-slate-50">
                            Welcome Back
                        </h2>
                        <p className="text-slate-500 dark:text-slate-500">
                            Sign in to your account to continue
                        </p>
                        {firebaseError && (
                            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-200">
                                {firebaseError}
                            </div>
                        )}
                    </div>

                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50/80 rounded-xl mb-8 animate-item">
                        <button
                            onClick={() => setLoginType('student')}
                            type="button"
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginType === 'student' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:text-slate-200'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setLoginType('admin')}
                            type="button"
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginType === 'admin' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:text-slate-200'}`}
                        >
                            Admin / Trainer
                        </button>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="animate-item">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Your email</label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`text-sm w-full py-3 px-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors bg-slate-50 dark:bg-slate-800 hover:bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:text-slate-500 ${errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-primary-500"}`}
                                placeholder="admin@snist.edu"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                        </div>

                        <div className="animate-item">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Password</label>
                            <input
                                type="password"
                                {...register("password")}
                                className={`text-sm w-full py-3 px-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors bg-slate-50 dark:bg-slate-800 hover:bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:text-slate-500 ${errors.password ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-primary-500"}`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                        </div>

                        <div className="flex items-center justify-between text-sm animate-item mt-2">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input type="checkbox" className="rounded text-primary-500 focus:ring-primary-500 border-slate-300 w-4 h-4 cursor-pointer" />
                                <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-medium">Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors underline underline-offset-4 decoration-slate-300 hover:decoration-orange-600">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="animate-item w-full flex justify-center items-center py-3.5 px-4 mt-8 text-sm font-medium rounded-xl text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="ml-2 w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-600 dark:text-slate-300 text-sm animate-item font-medium">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-slate-900 dark:text-slate-50 underline underline-offset-4 hover:text-primary-600 transition-colors">
                            Register here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
