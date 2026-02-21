import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const mockData = [
    { name: 'Mon', coding: 40, aptitude: 24, softskills: 24 },
    { name: 'Tue', coding: 30, aptitude: 13, softskills: 22 },
    { name: 'Wed', coding: 20, aptitude: 58, softskills: 22 },
    { name: 'Thu', coding: 27, aptitude: 39, softskills: 20 },
    { name: 'Fri', coding: 18, aptitude: 48, softskills: 21 },
    { name: 'Sat', coding: 23, aptitude: 38, softskills: 25 },
    { name: 'Sun', coding: 34, aptitude: 43, softskills: 21 },
];

export default function ProgressChart({ data = mockData, title }) {
    const chartRef = useRef();

    useGSAP(() => {
        gsap.from(chartRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        });
    }, { scope: chartRef });

    return (
        <div ref={chartRef} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full w-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">{title || "Weekly Progress"}</h3>
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="coding" stroke="var(--color-primary-500)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="aptitude" stroke="var(--color-cta)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="softskills" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
