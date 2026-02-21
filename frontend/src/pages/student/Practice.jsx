import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Trophy, Loader2, Search, AlertCircle, RefreshCw, Star, BrainCircuit, Code2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api';
import Badge from '../../components/Badge';

// Helper to decode HTML entities
const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

export default function Practice() {
    const [activeTab, setActiveTab] = useState('coding'); // 'coding' or 'aptitude'
    const [codingSections, setCodingSections] = useState([]);
    const [aptitudeSections, setAptitudeSections] = useState([]);
    const [completedProblems, setCompletedProblems] = useState({ coding: [], aptitude: [], softskills: [] });
    const [readinessDetails, setReadinessDetails] = useState({ coding: 0, aptitude: 0, softskills: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef();

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch both curriculums and user progress
            const [codingRes, aptitudeRes, completedRes, readinessRes] = await Promise.all([
                fetch(`/practiceData.json?v=${Date.now()}`).then(r => r.json()),
                fetch(`/aptitudeData.json?v=${Date.now()}`).then(r => r.json()),
                api.get('/students/completed-problems'),
                api.get('/progress/readiness')
            ]);

            setCodingSections(codingRes || []);
            setAptitudeSections(aptitudeRes || []);
            setCompletedProblems(completedRes.data || { coding: [], aptitude: [], softskills: [] });
            setReadinessDetails(readinessRes.data?.details || { coding: 0, aptitude: 0, softskills: 0 });
        } catch (error) {
            console.error("Failed to load practice data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useGSAP(() => {
        if (!loading) {
            gsap.from(".practice-card", {
                y: 20,
                opacity: 0,
                stagger: 0.05,
                duration: 0.5,
                ease: "power2.out",
                clearProps: "all"
            });
        }
    }, [loading, activeTab, searchQuery]);

    const handleMarkAsDone = async (problem, topicTitle) => {
        const currentCategory = activeTab;
        if (completedProblems[currentCategory]?.includes(problem.id)) return;

        try {
            const res = await api.post('/students/complete-problem', {
                problemId: problem.id,
                problemTitle: problem.title,
                topicTitle: topicTitle,
                category: currentCategory
            });

            // Update local state for immediate feedback
            setCompletedProblems(prev => ({
                ...prev,
                [currentCategory]: [...(prev[currentCategory] || []), problem.id]
            }));

            setReadinessDetails(prev => ({
                ...prev,
                [currentCategory]: (prev[currentCategory] || 0) + 1
            }));
        } catch (error) {
            console.error("Failed to mark as done:", error);
        }
    };

    const currentSections = activeTab === 'coding' ? codingSections : aptitudeSections;

    const filteredSections = currentSections.map(section => ({
        ...section,
        topics: section.topics ? section.topics.filter(topic =>
            (topic.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (topic.concepts && Array.isArray(topic.concepts) && topic.concepts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())))
        ) : []
    })).filter(section => section.topics && section.topics.length > 0);

    // Dynamic stats based on active tab
    const solvedCount = completedProblems[activeTab]?.length || 0;
    const currentScore = readinessDetails[activeTab] || 0;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
                <p className="text-slate-500 font-medium">Loading your practice hub...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Oops! Something went wrong</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">{error}</p>
                <button onClick={fetchInitialData} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20">
                    <RefreshCw size={20} /> Try Again
                </button>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="space-y-10 max-w-7xl mx-auto pb-24 px-4">

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-black uppercase tracking-widest border border-primary-200 dark:border-primary-800">
                        <Trophy size={14} /> Global Practice Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                        {activeTab === 'coding' ? 'Language Mastery' : 'Aptitude & Reasoning'}
                    </h1>
                </div>

                <div className="flex gap-4 sm:gap-6">
                    {/* Solving Stats (Tab Specific) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex items-center gap-5 min-w-[150px]">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Solved</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-slate-50">{solvedCount}</p>
                        </div>
                    </div>
                    {/* Performance Stats (Tab Specific) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex items-center gap-5 min-w-[150px]">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Star size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Score</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-slate-50">{currentScore}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Switcher & Search Bundle */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('coding')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'coding' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Code2 size={18} /> Language Mastery
                    </button>
                    <button
                        onClick={() => setActiveTab('aptitude')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'aptitude' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <BrainCircuit size={18} /> Aptitude & Reasoning
                    </button>
                </div>

                <div className="relative flex-1 block w-full">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'coding' ? 'coding topics' : 'aptitude modules'}...`}
                        className="w-full pl-12 pr-6 py-4 bg-transparent outline-none text-slate-800 dark:text-slate-100 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Display */}
            <div className="space-y-16">
                {filteredSections.map((section) => (
                    <div key={section.id} className="space-y-8">
                        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl">
                                {section.icon}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{decodeHTML(section.title)}</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Section 0{section.id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {section.topics.map((topic, tIdx) => (
                                <div key={tIdx} className="practice-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-primary-500/40 transition-all hover:shadow-2xl hover:shadow-primary-500/5 group">
                                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{decodeHTML(topic.title)}</h3>
                                        <Badge variant={topic.difficulty.toLowerCase().includes('easy') ? 'success' : topic.difficulty.toLowerCase().includes('medium') ? 'warning' : 'danger'}>
                                            {topic.difficulty}
                                        </Badge>
                                    </div>

                                    {activeTab === 'coding' && topic.code && (
                                        <div className="bg-[#0a0a14] p-6 font-mono text-[13px] border-b border-slate-800/50">
                                            <pre className="text-slate-300 overflow-x-auto">
                                                <code dangerouslySetInnerHTML={{ __html: topic.code }}></code>
                                            </pre>
                                        </div>
                                    )}

                                    <div className="p-6 flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Problems</p>
                                            <span className="text-[10px] font-bold text-slate-400">{topic.problems.length} items</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {topic.problems.map((prob, pIdx) => (
                                                <div
                                                    key={pIdx}
                                                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${completedProblems[activeTab]?.includes(prob.id)
                                                        ? 'bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30'
                                                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/50 hover:border-primary-500/30'
                                                        }`}
                                                >
                                                    <a href={prob.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden flex-1">
                                                        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-black uppercase ${prob.platform === 'lc' ? 'bg-amber-100 text-amber-700' : prob.platform === 'hr' || prob.platform === 'ibix' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {prob.platform}
                                                        </span>
                                                        <span className={`text-xs font-bold truncate ${completedProblems[activeTab]?.includes(prob.id) ? 'line-through opacity-50' : 'text-slate-700 dark:text-slate-200'}`}>
                                                            {prob.title}
                                                        </span>
                                                    </a>
                                                    <button
                                                        onClick={() => handleMarkAsDone(prob, topic.title)}
                                                        disabled={completedProblems[activeTab]?.includes(prob.id)}
                                                        className={`p-1.5 rounded-lg transition-all ${completedProblems[activeTab]?.includes(prob.id) ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500 active:scale-90'}`}
                                                    >
                                                        <CheckCircle2 size={18} fill={completedProblems[activeTab]?.includes(prob.id) ? 'currentColor' : 'none'} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 pt-0 flex flex-wrap gap-2 px-6 pb-6">
                                        {topic.concepts?.map((concept, cIdx) => (
                                            <span key={cIdx} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-black rounded uppercase tracking-tighter border border-slate-200 dark:border-slate-700">
                                                #{concept}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredSections.length === 0 && searchQuery && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Search size={48} className="text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">No topics found</h3>
                        <p className="text-slate-500">Try adjusting your search filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
