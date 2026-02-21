import clsx from 'clsx';

const variants = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-primary-100 text-primary-700 border-primary-200',
    default: 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700',
};

export default function Badge({ children, variant = 'default', className }) {
    return (
        <span className={clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}
