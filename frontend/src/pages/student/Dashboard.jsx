import React, { useRef } from 'react';
import StatCard from '../../components/StatCard';
import ProgressChart from '../../components/ProgressChart';
import GoalCard from '../../components/GoalCard';
import CourseCard from '../../components/CourseCard';
import { Target, Code, Brain, MessagesSquare } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Dashboard() {
    const containerRef = useRef();

    useGSAP(() => {
        // Stagger animation for dashboard elements
        const tl = gsap.timeline();

        tl.from('.dashboard-header', {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.out'
        })
            .from('.stat-board', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            }, "-=0.2")
            .from('.dashboard-chart', {
                scale: 0.95,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            }, "-=0.3")
            .from('.goal-section', {
                x: 20,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, "-=0.4")
            .from('.goal-card', {
                y: 15,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out'
            }, "-=0.2");
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="space-y-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="dashboard-header flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your placement preparation summary.</p>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/30 text-[var(--color-primary-500)] dark:text-primary-300 px-4 py-2 rounded-xl font-bold shadow-sm border border-primary-100 dark:border-primary-800 flex gap-2 items-center">
                    <Target size={20} />
                    Readiness Score: 78%
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="stat-board">
                    <StatCard title="Total Problems" value="124" trend={12} icon={<Code size={24} />} />
                </div>
                <div className="stat-board">
                    <StatCard title="Aptitude Hours" value="45h" trend={5} trendLabel="vs last month" icon={<Brain size={24} />} />
                </div>
                <div className="stat-board">
                    <StatCard title="Soft Skills" value="12h" trend={-2} icon={<MessagesSquare size={24} />} />
                </div>
                <div className="stat-board">
                    <StatCard title="Mock Interviews" value="3" icon={<Target size={24} />} />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Area */}
                <div className="lg:col-span-2 dashboard-chart h-[400px]">
                    <ProgressChart title="Activity Trends (Last 7 Days)" />
                </div>

                {/* Assigned Goals Area */}
                <div className="goal-section flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Active Goals</h3>
                        <button className="text-[var(--color-primary-500)] text-sm font-semibold hover:underline">View All</button>
                    </div>

                    <div className="goal-card">
                        <GoalCard
                            title="Solve 20 Advanced Array Problems"
                            category="coding"
                            current={15}
                            target={20}
                            deadline="In 2 days"
                            status="active"
                        />
                    </div>
                    <div className="goal-card">
                        <GoalCard
                            title="Complete Quantitative Aptitude Section"
                            category="aptitude"
                            current={40}
                            target={100}
                            deadline="Next week"
                            status="active"
                        />
                    </div>
                    <div className="goal-card">
                        <GoalCard
                            title="Mock Interview Preparation"
                            category="softskills"
                            current={1}
                            target={1}
                            deadline="Completed"
                            status="completed"
                        />
                    </div>
                </div>

            </div>

            {/* Recommended Courses Area */}
            <div className="pt-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Recommended Modules</h3>
                    <button className="text-[var(--color-primary-500)] text-sm font-semibold hover:underline">Browse Catalog</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CourseCard
                        title="Advanced Programming Concepts"
                        description="Master data structures, algorithms, and system design tailored for top-tier software engineering interviews."
                        author="Tech Placement Expert"
                        authorAvatar="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        date="40 Hours • 120 Problems"
                        image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    />

                    <CourseCard
                        title="Quantitative Aptitude Mastery"
                        description="Accelerate your problem-solving speed with proven shortcuts for logical reasoning and numerical puzzles."
                        author="Logics & Math Trainer"
                        authorAvatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        date="25 Hours • 450 Exercises"
                        image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    />

                    <CourseCard
                        title="Soft Skills & Interview Prep"
                        description="Develop executive presence, communication frameworks, and behavioral interview strategies that win offers."
                        author="HR Specialist"
                        authorAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        date="15 Hours • 10 Mocks"
                        image="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    />
                </div>
            </div>

        </div>
    );
}
