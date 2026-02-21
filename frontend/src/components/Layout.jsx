import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] dark:bg-slate-950 text-[var(--color-text-primary)] dark:text-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
