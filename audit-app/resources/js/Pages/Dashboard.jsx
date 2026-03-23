import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import { FileText, Users, BarChart, CheckCircle } from 'lucide-react';

export default function Dashboard({ submissions, stats }) {
    return (
        <AppLayout>
            <Head title="Tableau de Bord" />
            
            <div className="p-8 max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Bienvenue, Auditeur</h1>
                    <p className="text-slate-500">Aperçu global de l'audit d'archivage Exelencis.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard 
                        title="Audits Complétés" 
                        value={stats.total} 
                        icon={FileText} 
                        color="bg-blue-500" 
                    />
                    <StatCard 
                        title="Score Moyen" 
                        value={`${Math.round(stats.avg_score)}%`} 
                        icon={BarChart} 
                        color="bg-emerald-500" 
                    />
                    <StatCard 
                        title="Départements" 
                        value={Object.keys(stats.by_department).length} 
                        icon={Users} 
                        color="bg-amber-500" 
                    />
                    <StatCard 
                        title="Dernier Audit" 
                        value={submissions.length > 0 ? new Date(submissions[0].created_at).toLocaleDateString() : 'N/A'} 
                        icon={CheckCircle} 
                        color="bg-purple-500" 
                    />
                </div>

                {/* Recent Submissions */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-900">Soumissions Récentes</h2>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Voir tout</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">Département</th>
                                    <th className="px-6 py-4">Responsable</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Score</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {submissions.length > 0 ? submissions.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="capitalize font-medium text-slate-900">{s.department}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{s.interviewee_name}</td>
                                        <td className="px-6 py-4 text-slate-600">{new Date(s.date_interview).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-slate-100 rounded-full h-2 mr-3">
                                                    <div 
                                                        className="bg-emerald-500 h-2 rounded-full" 
                                                        style={{ width: `${s.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold">{Math.round(s.score)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <a 
                                                href={route('audit.export', s.id)} 
                                                className="text-slate-400 hover:text-emerald-600 transition-colors"
                                                title="Exporter en CSV"
                                            >
                                                <FileText className="w-5 h-5" />
                                            </a>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            Aucune donnée collectée pour le moment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${color} text-white`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    );
}
