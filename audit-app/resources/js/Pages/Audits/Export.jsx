import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { FileDown, FileText, CheckCircle2, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

export default function Export({ totalAudits, departments }) {
    const [downloading, setDownloading] = useState(false);
    const [done, setDone] = useState(false);

    const handleDownload = () => {
        setDownloading(true);
        setDone(false);

        // Use plain browser navigation — completely bypasses Inertia
        window.location.href = '/download-pdf';

        // Show success feedback after a short delay
        setTimeout(() => {
            setDownloading(false);
            setDone(true);
            setTimeout(() => setDone(false), 5000);
        }, 2500);
    };

    return (
        <MainLayout>
            <Head title="Exporter en PDF" />

            <div className="space-y-6 max-w-2xl mx-auto">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Exporter en PDF</h2>
                    <p className="text-slate-500 mt-1">Téléchargez un rapport PDF complet de toutes les soumissions d'audit.</p>
                </div>

                {/* Stats card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-none shadow-md bg-white/70 backdrop-blur-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-blue-500" />
                                Contenu du fichier
                            </CardTitle>
                            <CardDescription>Ce fichier PDF contiendra toutes les données collectées.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-600">Total des audits</span>
                                <span className="font-bold text-slate-900">{totalAudits} soumissions</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-600">Format</span>
                                <span className="font-bold text-slate-900">.pdf (PDF)</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-600">Colonnes</span>
                                <span className="font-bold text-slate-900 text-right text-sm">
                                    ID, Département, Mission, Auditeur, Date, Durée, Responsable...
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {departments.map(dept => (
                                    <span key={dept} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                                        {dept}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Download button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <Card className="border-none shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                        <CardContent className="py-10 flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                <FileText className="w-10 h-10 text-white" />
                            </div>

                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-1">Rapport PDF prêt</h3>
                                <p className="text-blue-100 text-sm">Cliquez pour télécharger <strong>rapport_audits.pdf</strong></p>
                            </div>

                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="flex items-center gap-3 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                            >
                                {done ? (
                                    <>
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        Téléchargement lancé !
                                    </>
                                ) : downloading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin" />
                                        Préparation...
                                    </>
                                ) : (
                                    <>
                                        <FileDown className="w-6 h-6" />
                                        Télécharger le PDF
                                    </>
                                )}
                            </button>

                            {done && (
                                <p className="text-blue-100 text-sm">
                                    Le fichier devrait apparaitre dans vos téléchargements.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </MainLayout>
    );
}
