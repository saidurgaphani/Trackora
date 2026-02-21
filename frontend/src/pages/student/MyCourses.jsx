import React, { useRef } from 'react';
import CourseCard from '../../components/CourseCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function MyCourses() {
    const containerRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.page-header', {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.out'
        })
            .from('.course-item', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            }, "-=0.2");
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="page-header flex justify-between items-end flex-wrap gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">My Courses</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Explore recommended modules to boost your placement readiness.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="course-item">
                    <CourseCard
                        title="Advanced Programming Concepts"
                        description="Master data structures, algorithms, and system design tailored for top-tier software engineering interviews."
                        author="Tech Placement Expert"
                        authorAvatar="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        date="40 Hours • 120 Problems"
                        image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    />
                </div>

                <div className="course-item">
                    <CourseCard
                        title="Quantitative Aptitude Mastery"
                        description="Accelerate your problem-solving speed with proven shortcuts for logical reasoning and numerical puzzles."
                        author="Logics & Math Trainer"
                        authorAvatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        date="25 Hours • 450 Exercises"
                        image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    />
                </div>

                <div className="course-item">
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
