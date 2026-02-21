import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, UserPlus } from 'lucide-react';

import { initializeApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../firebaseSetup'; // Your primary app instance

let secondaryApp;
try {
    secondaryApp = getApp('SecondaryAdminManager');
} catch (e) {
    // If it doesn't exist yet, initialize it
    secondaryApp = initializeApp(app.options, 'SecondaryAdminManager');
}

const schema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    role: z.enum(['admin', 'trainer'])
});

export default function AddAdminModal({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            role: 'trainer'
        }
    });

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const secondaryAuth = getAuth(secondaryApp);
            const db = getFirestore(app); // Primary db for writing

            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                name: data.name,
                email: data.email,
                role: data.role,
                createdAt: new Date()
            });

            // Sign out from the secondary app instance
            await signOut(secondaryAuth);

            setSuccessMsg(`Successfully created ${data.role} account!`);
            reset();

            // Auto close after 2 seconds
            setTimeout(() => {
                onClose();
                setSuccessMsg("");
            }, 2000);

        } catch (error) {
            console.error("Error creating user:", error);
            if (error.code === 'auth/email-already-in-use') {
                setErrorMsg("This email is already registered.");
            } else {
                setErrorMsg(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">

                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-500 rounded-xl">
                            <UserPlus size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add User</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {errorMsg && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium border border-emerald-200">
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Role</label>
                            <select
                                {...register("role")}
                                className="text-sm w-full py-2.5 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                            >
                                <option value="trainer">Trainer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                {...register("name")}
                                className={`text-sm w-full py-2.5 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                                placeholder="Jane Doe"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`text-sm w-full py-2.5 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                                placeholder="jane@trackora.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Password</label>
                            <input
                                type="password"
                                {...register("password")}
                                className={`text-sm w-full py-2.5 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 text-sm font-medium rounded-xl text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary-500/20"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
