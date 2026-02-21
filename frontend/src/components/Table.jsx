import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

export default function Table({ columns, data }) {
    const tableRef = useRef();

    useGSAP(() => {
        // Stagger in table rows dynamically when component mounts
        gsap.from('.table-row', {
            opacity: 0,
            y: 10,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out',
        });
    }, { scope: tableRef, dependencies: [data] });

    return (
        <div ref={tableRef} className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} scope="col" className={`px-6 py-4 font-semibold ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="table-row border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className={`px-6 py-4 ${col.cellClassName || ''}`}>
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 dark:text-slate-500">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
