import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

export default function Navbar({ setIsOpen }) {
    const { user } = useAuth();
    const navRef = useRef();

    useGSAP(() => {
        gsap.from('.nav-element', {
            y: -20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
        });
    }, { scope: navRef });

    return (
        <header ref={navRef} className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">

            {/* Mobile Menu Button */}
            <div className="flex items-center">
                <button
                    onClick={() => setIsOpen(true)}
                    className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg nav-element"
                >
                    <Menu size={24} />
                </button>

                {/* Breadcrumb / Title area */}
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block nav-element capitalize">
                    {user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                </h2>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3 sm:space-x-5">
                <div className="relative hidden md:block nav-element">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search activities..."
                        className="block w-64 pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-slate-50 dark:bg-slate-800 outline-none transition-shadow"
                    />
                </div>

                <button className="nav-element relative p-2 text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                <div className="nav-element flex items-center gap-2 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-700">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-tight">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 capitalize">{user?.role || 'Student'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary-100 border border-primary-200 text-[var(--color-primary-500)] flex items-center justify-center font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
