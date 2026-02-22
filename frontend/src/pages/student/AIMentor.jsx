import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Sparkles, Send, BrainCircuit, MessageSquare, Download, Target, ClipboardList } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api';

export default function AIMentor() {
    const containerRef = useRef();
    const chatEndRef = useRef(null);

    // Roadmap state
    const [roadmap, setRoadmap] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Chatbot state
    const [messages, setMessages] = useState([{
        sender: 'ai',
        text: 'Hello! I am your AI Placement Mentor. Once you generate your roadmap, you can ask me specific questions about your weak areas or placement strategy!'
    }]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useGSAP(() => {
        gsap.from('.anim-in', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
    }, []);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleGenerateRoadmap = async () => {
        setIsGenerating(true);
        try {
            const res = await api.post('/ai/roadmap');
            setRoadmap(res.data.roadmap);

            // GSAP animation for new content
            setTimeout(() => {
                gsap.fromTo('.roadmap-content',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
                );
            }, 100);
        } catch (error) {
            console.error("Failed to generate roadmap:", error);
            // Fallback for demo just in case API fails
            setRoadmap("Failed to load roadmap. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Auto-generate roadmap on initial mount
    useEffect(() => {
        handleGenerateRoadmap();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const res = await api.post('/ai/chat', { question: userMsg.text });
            setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting right now.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const formatRoadmapText = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => {
            if (line.startsWith('###')) {
                return <h3 key={i} className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-6 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">{line.replace('###', '').trim()}</h3>;
            } else if (line.startsWith('- ')) {
                return <li key={i} className="ml-4 text-slate-700 dark:text-slate-300 list-disc">{line.replace('- ', '')}</li>;
            } else if (line.trim() === '') {
                return <br key={i} />;
            } else {
                return <p key={i} className="text-slate-700 dark:text-slate-300 mb-1">{line}</p>;
            }
        });
    };

    return (
        <div ref={containerRef} className="max-w-screen-2xl mx-auto space-y-6">

            <div className="anim-in flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
                        <BrainCircuit className="text-[var(--color-primary-500)]" /> AI Placement Mentor
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Get your personalized 7-day placement strategy and chat with your AI assistant.</p>
                </div>
                {!roadmap && (
                    <button
                        onClick={handleGenerateRoadmap}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-600)] text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        {isGenerating ? 'Analyzing Profile...' : 'Generate Roadmap'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Roadmap Column */}
                <div className="anim-in lg:col-span-3 space-y-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[650px]">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Target className="w-5 h-5 text-[var(--color-primary-500)]" />
                                Personalized Action Plan
                            </h2>
                            {roadmap && (
                                <div className="flex gap-2">
                                    <button onClick={handleGenerateRoadmap} className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm">
                                        Regenerate
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            {!roadmap && !isGenerating ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                    <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-4 border border-primary-100 dark:border-primary-800">
                                        <ClipboardList className="w-10 h-10 text-[var(--color-primary-500)]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Roadmap Generated</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">Click the button above to let our AI analyze your performance and prepare a customized 7-day placement strategy.</p>
                                </div>
                            ) : isGenerating ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <Loader2 className="w-12 h-12 text-[var(--color-primary-500)] animate-spin mb-4" />
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">AI is thinking...</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Connecting to HuggingFace TinyLlama<br />Processing your progress metrics...</p>
                                </div>
                            ) : (
                                <div className="roadmap-content leading-relaxed">
                                    {formatRoadmapText(roadmap)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Column */}
                <div className="anim-in lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[650px]">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-indigo-500" />
                                Mentor Chat
                            </h2>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'user'
                                        ? 'bg-[var(--color-primary-500)] text-white rounded-tr-sm'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm w-20 flex justify-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about your placement prep..."
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-shadow"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="p-3 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm cursor-pointer"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
