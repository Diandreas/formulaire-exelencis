import React from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, List, Settings, LogOut } from 'lucide-react';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
            {/* Sidebar Navigation */}
            <motion.aside 
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full md:w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 shadow-sm flex-shrink-0 z-20"
            >
                <div className="p-6 flex flex-col h-full">
                    {/* Brand */}
                    <div className="mb-10 flex items-center gap-3">
                        <img src="/images/logo.png" alt="Excelencis Group" className="w-10 h-10 object-contain" />
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">CEPI Audit</h1>
                            <p className="text-xs text-slate-500 font-medium">by Excelencis Group</p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 space-y-2">
                        <Link 
                            href={route('audits.index')} 
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-medium group"
                        >
                            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Dashboard</span>
                        </Link>
                        
                        <div className="pt-4 pb-2">
                            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold px-4">Formulaires</p>
                        </div>

                        {[
                            { name: 'Audit', id: 'audit', color: 'blue' },
                            { name: 'Conformité', id: 'conformite', color: 'red' },
                            { name: 'Crédit', id: 'credit', color: 'emerald' },
                            { name: 'DAF', id: 'daf', color: 'amber' },
                            { name: 'Informatique', id: 'informatique', color: 'purple' },
                            { name: 'Marketing', id: 'marketing', color: 'pink' },
                        ].map(dept => (
                            <Link 
                                key={dept.id}
                                href={route('audits.show', dept.id)}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all hover:bg-slate-100 text-slate-600 font-medium group"
                            >
                                <div className={`w-2 h-2 rounded-full bg-${dept.color}-500 group-hover:scale-150 transition-transform`} />
                                <span>{dept.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Settings/Footer */}
                    <div className="pt-6 border-t border-slate-100 mt-auto">
                        <button className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 transition-colors w-full text-left text-sm font-medium">
                            <Settings className="w-4 h-4" /> Préférences
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 w-full bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 overflow-y-auto relative z-10">
                {/* Decorative background blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
                
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="max-w-7xl mx-auto relative z-10 min-h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
