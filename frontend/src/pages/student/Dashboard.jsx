import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ProgressChart from '../../components/ProgressChart';
import GoalCard from '../../components/GoalCard';
import CourseCard from '../../components/CourseCard';
import { Target, Code, Brain, MessagesSquare, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api';

export default function Dashboard() {
    const containerRef = useRef();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        readinessLevel: '...',
        totalScore: 0,
        codingScore: 0,
        aptitudeScore: 0,
        softSkillScore: 0
    });
    const [goals, setGoals] = useState([]);
    const [trends, setTrends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [readinessRes, goalsRes, trendsRes] = await Promise.all([
                    api.get('/progress/readiness'),
                    api.get('/progress/goals'),
                    api.get('/activities/trends')
                ]);

                const data = readinessRes.data;
                setStats({
                    readinessLevel: data.readinessLevel,
                    totalScore: data.totalScore,
                    codingScore: data.details.coding || 0,
                    aptitudeScore: data.details.aptitude || 0,
                    softSkillScore: data.details.softskills || 0
                });
                setGoals(goalsRes.data);
                setTrends(trendsRes.data);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useGSAP(() => {
        if (isLoading) return;

        const tl = gsap.timeline();
        tl.from('.dashboard-header', {
            y: -20, opacity: 0, duration: 0.5, ease: 'power3.out'
        })
            .from('.stat-board', {
                y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)'
            }, "-=0.2")
            .from('.dashboard-chart', {
                scale: 0.95, opacity: 0, duration: 0.6, ease: 'power2.out'
            }, "-=0.3")
            .from('.goal-section', {
                x: 20, opacity: 0, duration: 0.5, ease: 'power2.out'
            }, "-=0.4")
            .from('.goal-card', {
                y: 15, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out'
            }, "-=0.2");

    }, { scope: containerRef, dependencies: [isLoading] });

    if (isLoading) {
        return <div className="flex h-[80vh] w-full justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>;
    }

    return (
        <div ref={containerRef} className="space-y-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="dashboard-header flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your placement preparation summary.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => navigate('/student/practice')}
                        className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex gap-2 items-center"
                    >
                        <Code size={18} /> Practice
                    </button>
                    <div className="bg-primary-50 dark:bg-primary-900/30 text-[var(--color-primary-500)] dark:text-primary-300 px-4 py-2 rounded-xl font-bold shadow-sm border border-primary-100 dark:border-primary-800 flex gap-2 items-center">
                        <Target size={20} />
                        Readiness: {stats.readinessLevel} ({stats.totalScore})
                    </div>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="stat-board">
                    <StatCard title="Coding Problems" value={stats.codingScore} icon={<Code size={24} />} />
                </div>
                <div className="stat-board">
                    <StatCard title="Aptitude Executed" value={stats.aptitudeScore} icon={<Brain size={24} />} />
                </div>
                <div className="stat-board">
                    <StatCard title="Soft Skills" value={stats.softSkillScore} icon={<MessagesSquare size={24} />} />
                </div>
                <div className="stat-board">
                    <StatCard title="Mock Interviews" value="0" icon={<Target size={24} />} />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Area */}
                <div className="lg:col-span-2 dashboard-chart h-[400px]">
                    <ProgressChart title="Activity Trends (Last 7 Days)" data={trends} />
                </div>

                {/* Assigned Goals Area */}
                <div className="goal-section flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Active Goals</h3>
                        <button className="text-[var(--color-primary-500)] text-sm font-semibold hover:underline">View All</button>
                    </div>

                    {goals.length === 0 ? (
                        <div className="text-sm p-4 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 font-medium text-slate-500">
                            No Active Goals Assigned. You are all caught up!
                        </div>
                    ) : (
                        goals.map(assignment => (
                            <div key={assignment._id} className="goal-card">
                                <GoalCard
                                    title={assignment.goalId?.title || 'Personal Goal'}
                                    category={assignment.goalId?.category || 'coding'}
                                    current={assignment.progress}
                                    target={assignment.goalId?.targetCount || 10}
                                    deadline={assignment.goalId?.deadline ? new Date(assignment.goalId.deadline).toLocaleDateString() : 'N/A'}
                                    status={assignment.status}
                                />
                            </div>
                        ))
                    )}
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
