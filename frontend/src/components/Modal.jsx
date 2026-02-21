import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Modal({ isOpen, onClose, title, children }) {
    const modalRef = useRef();
    const backdropRef = useRef();

    useGSAP(() => {
        if (isOpen) {
            gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, display: 'block' });
            gsap.fromTo(modalRef.current,
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)', display: 'block' }
            );
        } else {
            gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, display: 'none' });
            gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in', display: 'none' });
        }
    }, { dependencies: [isOpen] });

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Initial render: hidden
    return (
        <>
            <div
                ref={backdropRef}
                className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden opacity-0"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    ref={modalRef}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden pointer-events-auto hidden opacity-0"
                >
                    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
                        <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:text-slate-300 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-6 py-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
