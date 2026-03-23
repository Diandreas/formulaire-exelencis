import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { FileText, Download, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

export default function Index({ submissions }) {
    const { flash } = usePage().props;

    // KPI logic
    const totalAudits = submissions.length;
    const derniersJours = submissions.filter(s => new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
    
    // Departments 
    const depts = {
        audit: { color: 'blue', label: 'Audit' },
        conformite: { color: 'red', label: 'Conformité' },
        credit: { color: 'emerald', label: 'Crédit' },
        daf: { color: 'amber', label: 'DAF' },
        informatique: { color: 'purple', label: 'Informatique' },
        marketing: { color: 'pink', label: 'Marketing' }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <MainLayout>
            <Head title="Tableau de bord" />

            <div className="space-y-6">
                {/* Header section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Vue d'ensemble</h2>
                        <p className="text-slate-500 mt-1">Gérez et consultez les audits d'archivage collectés.</p>
                    </div>
                    <Button variant="default" className="gap-2 shadow-lg shadow-blue-500/20" asChild>
                        <Link href={route('audits.export-page')} className="flex items-center gap-2">
                            <Download className="w-4 h-4" /> Exporter en PDF
                        </Link>
                    </Button>
                </div>

                {flash?.success && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-200 font-medium"
                    >
                        {flash.success}
                    </motion.div>
                )}
                
                {flash?.info && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-blue-50 text-blue-600 p-4 rounded-xl border border-blue-200 font-medium"
                    >
                        {flash.info}
                    </motion.div>
                )}

                {/* KPI Cards */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <motion.div variants={itemVariants}>
                        <Card className="border-none shadow-md bg-white/70 backdrop-blur-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total Audits</CardTitle>
                                <FileText className="w-4 h-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-800">{totalAudits}</div>
                                <p className="text-xs text-slate-500 mt-1">Audits enregistrés</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <Card className="border-none shadow-md bg-white/70 backdrop-blur-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Audits Récents</CardTitle>
                                <Clock className="w-4 h-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-800">{derniersJours}</div>
                                <p className="text-xs text-slate-500 mt-1">Les 7 derniers jours</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="border-none shadow-md bg-white/70 backdrop-blur-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Taux Complétion</CardTitle>
                                <Users className="w-4 h-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-800">100%</div>
                                <p className="text-xs text-slate-500 mt-1">Formulaires terminés</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Submissions List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-xl overflow-hidden">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                            <CardTitle>Dernières soumissions</CardTitle>
                            <CardDescription>Liste de tous les audits réalisés par département.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {submissions.length === 0 ? (
                                <div className="p-12 text-center text-slate-500">
                                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                    <p className="text-lg font-medium">Aucun audit pour le moment</p>
                                    <p className="text-sm">Sélectionnez un département à gauche pour commencer.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {submissions.map((sub) => {
                                        const deptConf = depts[sub.department] || { color: 'slate', label: sub.department };
                                        return (
                                            <div key={sub.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                                                <div className="flex gap-4 items-center">
                                                    <div className={`w-12 h-12 rounded-full bg-${deptConf.color}-100 flex items-center justify-center flex-shrink-0`}>
                                                        <FileText className={`w-6 h-6 text-${deptConf.color}-600`} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900">
                                                            {deptConf.label} <span className="text-slate-400 font-normal text-sm ml-2">#{sub.id}</span>
                                                        </h4>
                                                        <p className="text-sm text-slate-500">
                                                            Pôle: {sub.bureau || 'N/A'} • Réf: {sub.reference_mission || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                                    <div className="text-right flex-1 sm:flex-none">
                                                        <p className="text-sm font-medium text-slate-900">{sub.responsable_interviewe || 'Anonyme'}</p>
                                                        <p className="text-xs text-slate-500">{new Date(sub.created_at).toLocaleDateString('fr-FR')}</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 group-hover:text-blue-600 transition-colors" asChild>
                                                        <Link href={route('audits.view', sub.id)}>
                                                            <ArrowUpRight className="w-5 h-5" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </MainLayout>
    );
}
