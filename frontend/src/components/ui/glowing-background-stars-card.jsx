import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";

export const GlowingStarsBackgroundCard = ({
    className,
    children,
}) => {
    const [mouseEnter, setMouseEnter] = useState(false);
    const { theme } = useTheme();

    return (
        <div
            onMouseEnter={() => {
                setMouseEnter(true);
            }}
            onMouseLeave={() => {
                setMouseEnter(false);
            }}
            className={cn(
                "bg-[linear-gradient(110deg,#1e293b_0.6%,#0f172a)] relative overflow-hidden p-6 w-full rounded-2xl border border-slate-700/50 shadow-md",
                className
            )}
        >
            <div className="absolute inset-0 pointer-events-none z-0">
                <Illustration mouseEnter={mouseEnter} theme={theme} />
            </div>
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
};

export const Illustration = ({ mouseEnter, theme }) => {
    const stars = 108;
    const columns = 18;

    const [glowingStars, setGlowingStars] = useState([]);
    const highlightedStars = useRef([]);

    useEffect(() => {
        const interval = setInterval(() => {
            highlightedStars.current = Array.from({ length: 5 }, () =>
                Math.floor(Math.random() * stars)
            );
            setGlowingStars([...highlightedStars.current]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="h-full w-full p-2 opacity-50 block"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `1px`,
            }}
        >
            {[...Array(stars)].map((_, starIdx) => {
                const isGlowing = glowingStars.includes(starIdx);
                const delay = (starIdx % 10) * 0.1;
                const staticDelay = starIdx * 0.01;
                return (
                    <div
                        key={`matrix-col-${starIdx}}`}
                        className="relative flex items-center justify-center"
                    >
                        <Star
                            isGlowing={mouseEnter ? true : isGlowing}
                            delay={mouseEnter ? staticDelay : delay}
                            theme={theme}
                        />
                        {mouseEnter && <Glow delay={staticDelay} theme={theme} />}
                        <AnimatePresence mode="wait">
                            {isGlowing && <Glow delay={delay} theme={theme} />}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

const Star = ({ isGlowing, delay, theme }) => {
    return (
        <motion.div
            key={delay}
            initial={{
                scale: 1,
            }}
            animate={{
                scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1,
                background: isGlowing ? "#fff" : "#334155", // slate-700
            }}
            transition={{
                duration: 2,
                ease: "easeInOut",
                delay: delay,
            }}
            className={cn("bg-[#334155] h-[1px] w-[1px] rounded-full relative z-20")}
        ></motion.div>
    );
};

const Glow = ({ delay, theme }) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            transition={{
                duration: 2,
                ease: "easeInOut",
                delay: delay,
            }}
            exit={{
                opacity: 0,
            }}
            className="absolute left-1/2 -translate-x-1/2 z-10 h-[4px] w-[4px] rounded-full bg-primary-500 blur-[1px] shadow-2xl shadow-primary-500"
        />
    );
};
