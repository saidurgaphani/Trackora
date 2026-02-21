import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Search, Bell, Menu, X, Sun, Moon, LogOut, User, BookOpen, LineChart } from "lucide-react";
import Logo from "../assets/LOGO.png";
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const studentLinks = [
        { name: 'Dashboard', path: '/student/dashboard' },
        { name: 'My Courses', path: '/student/courses' },
        { name: 'Practice', path: '/student/practice' },
        { name: 'Resources', path: '/student/resources' },
        { name: 'Activity Log', path: '/student/activity-log' },
        { name: 'Progress', path: '/student/progress' },
        { name: 'Mock Interviews', path: '/student/mock-interview' },
    ];

    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Manage Goals', path: '/admin/manage-goals' },
        { name: 'Students', path: '/admin/students' },
    ];

    const navItems = user?.role === 'admin' || user?.role === 'trainer' ? adminLinks : studentLinks;

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 shadow-sm">
            <div className="mx-auto flex h-16 w-full items-center justify-between px-4 lg:px-8">
                {/* Logo */}
                <div onClick={() => navigate(navItems[0]?.path)} className="flex items-center gap-2 cursor-pointer">
                    <img src={Logo} alt="Trackora" className="h-9 w-9 object-contain" />
                    <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
                        Track<span className="text-gradient-primary">ora</span>
                    </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden items-center gap-1 xl:flex">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-[var(--color-primary-500)] dark:text-primary-300'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                {/* Search + Actions */}
                <div className="flex items-center gap-3">
                    {/* <div className="hidden items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 md:flex">
                        <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder='Search for "Placements"'
                            className="w-48 xl:w-64 bg-transparent text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none"
                        />
                    </div> */}

                    <button onClick={toggleTheme} className="hidden rounded-full p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 lg:block">
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    <button className="hidden rounded-full p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 lg:block relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                    </button>

                    <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-700">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-tight">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 capitalize">{user?.role || 'Student'}</p>
                        </div>
                        <div className="group relative">
                            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 text-[var(--color-primary-500)] dark:text-primary-300 flex items-center justify-center font-bold cursor-pointer">
                                {user?.name?.charAt(0) || 'U'}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
                                    <div className="p-2 space-y-1">
                                        <NavLink to={`/${user?.role === 'admin' ? 'admin' : 'student'}/profile`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg font-medium transition-colors">
                                            <User size={16} /> My Profile
                                        </NavLink>
                                        <NavLink to={`/${user?.role === 'admin' ? 'admin' : 'student'}/courses`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg font-medium transition-colors">
                                            <BookOpen size={16} /> My Courses
                                        </NavLink>
                                        <NavLink to={`/${user?.role === 'admin' ? 'admin' : 'student'}/progress`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg font-medium transition-colors">
                                            <LineChart size={16} /> Progress
                                        </NavLink>
                                    </div>
                                    <div className="border-t border-slate-100 dark:border-slate-700 p-2">
                                        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="rounded-lg p-2 text-slate-900 dark:text-slate-50 xl:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 xl:hidden max-h-[calc(100vh-4rem)] overflow-y-auto shadow-xl">

                    {/* User profile on mobile */}
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 mb-4 border border-slate-100 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-secondary-900)] text-white flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{user?.role || 'Student'}</p>
                        </div>
                    </div>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-[var(--color-primary-500)] dark:text-primary-300'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}

                    <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

                    {/* <div className="mb-4 flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2">
                        <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder='Search for "Placements"'
                            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none"
                        />
                    </div> */}

                    <button
                        onClick={toggleTheme}
                        className="w-full mb-2 flex items-center justify-between px-3 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors"
                    >
                        <div className="flex items-center gap-3 text-sm">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </div>
                        <div className={`w-8 h-4 rounded-full flex items-center p-0.5 ${theme === 'dark' ? 'bg-primary-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                            <div className="w-3 h-3 rounded-full bg-white dark:bg-slate-900 shadow-sm" />
                        </div>
                    </button>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>
            )}
        </nav>
    );
};

export default Navbar;
