import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Home, LineChart, CheckSquare, Target, LogOut, Users, Settings, Moon, Sun, BookOpen, Layers } from 'lucide-react';
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Logo from '../assets/LOGO.png';

export default function Sidebar({ isOpen, setIsOpen }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const sidebarRef = useRef();

    const studentLinks = [
        { name: 'Dashboard', path: '/student/dashboard', icon: <Home size={20} /> },
        { name: 'My Courses', path: '/student/courses', icon: <BookOpen size={20} /> },
        { name: 'Resources', path: '/student/resources', icon: <Layers size={20} /> },
        { name: 'Activity Log', path: '/student/activity-log', icon: <CheckSquare size={20} /> },
        { name: 'Progress', path: '/student/progress', icon: <LineChart size={20} /> },
        { name: 'Mock Interviews', path: '/student/mock-interview', icon: <Target size={20} /> },
    ];

    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={20} /> },
        { name: 'Manage Goals', path: '/admin/manage-goals', icon: <CheckSquare size={20} /> },
        { name: 'Students', path: '/admin/students', icon: <Users size={20} /> },
    ];

    const links
        = user?.role === 'admin' || user?.role === 'trainer' ? adminLinks : studentLinks;

    useGSAP(() => {
        // Initial load animation for links
        gsap.from('.nav-link-item', {
            x: -20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            delay: 0.2
        });
    }, { scope: sidebarRef });

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside ref={sidebarRef} className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Brand */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-xl text-[var(--color-primary-500)] flex items-center gap-2">
                        <img src={Logo} alt="Trackora Logo" className="w-8 h-8 object-contain" />
                        Trackora
                    </div>
                </div>

                {/* Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <div className="px-2 pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Menu
                    </div>
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `nav-link-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-[var(--color-primary-500)] dark:text-primary-300'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50'
                                }`
                            }
                        >
                            {link.icon}
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* User Card & Logout */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="nav-link-item flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-secondary-900)] text-white flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 truncate capitalize">{user?.role || 'Student'}</p>
                        </div>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="w-full nav-link-item flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors mb-2"
                    >
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </div>
                        <div className={`w-8 h-4 rounded-full flex items-center p-0.5 ${theme === 'dark' ? 'bg-primary-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                            <div className="w-3 h-3 rounded-full bg-white dark:bg-slate-900 shadow-sm" />
                        </div>
                    </button>

                    <button
                        onClick={logout}
                        className="w-full nav-link-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
