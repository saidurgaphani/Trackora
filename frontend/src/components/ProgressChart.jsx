import {
    LineChart,
    Line,
    BarChart,
    Bar,
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

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-3 lg:p-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
                <p className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm font-medium capitalize">
                        {entry.name} : {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ProgressChart({ data = mockData, title, type = 'line' }) {
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
                    {type === 'bar' ? (
                        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} opacity={0.3} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                            <Bar dataKey="coding" name="Coding" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="aptitude" name="Aptitude" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="core" name="Core Concepts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="softskills" name="Soft Skills" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    ) : (
                        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} opacity={0.3} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }} />
                            <Line type="monotone" dataKey="coding" name="Coding" stroke="var(--color-primary-500)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="aptitude" name="Aptitude" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="core" name="Core Concepts" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="softskills" name="Soft Skills" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
