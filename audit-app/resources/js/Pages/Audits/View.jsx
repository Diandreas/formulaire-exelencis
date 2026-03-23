import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, ShieldAlert, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import formsData from '@/Config/formsData.json';

/* Safelist for Tailwind 4 dynamic classes used in this file:
   bg-blue-100 text-blue-600 bg-blue-500 bg-red-100 text-red-600 bg-red-500 bg-emerald-100 text-emerald-600 bg-emerald-500
   bg-amber-100 text-amber-600 bg-amber-500 bg-purple-100 text-purple-600 bg-purple-500 bg-pink-100 text-pink-600 bg-pink-500
*/

export default function View({ submission }) {
    const config = formsData[submission.department];
    const responses = submission.responses || {};

    const depts = {
        audit: { color: 'blue', label: 'Audit Interne' },
        conformite: { color: 'red', label: 'Conformité & Contrôle' },
        credit: { color: 'emerald', label: 'Crédit' },
        daf: { color: 'amber', label: 'DAF' },
        informatique: { color: 'purple', label: 'Informatique' },
        marketing: { color: 'pink', label: 'Marketing & Opérations' }
    };
    const deptInfo = depts[submission.department] || { color: 'slate', label: submission.department };

    if (!config) {
        return <MainLayout><div className="p-12 text-center text-red-500">Configuration introuvable pour ce département.</div></MainLayout>;
    }

    // Helper components
    const SectionHeader = ({ num, title, icon }) => (
        <CardHeader className="border-b border-slate-100 mb-6 bg-slate-50/50 flex flex-row items-center gap-4 py-4 px-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${deptInfo.color}-100 text-${deptInfo.color}-600 font-bold`}>{num}</div>
            <div>
                <CardTitle className="text-xl text-slate-800">{title}</CardTitle>
            </div>
            {icon && <div className="ml-auto text-slate-400">{icon}</div>}
        </CardHeader>
    );

    return (
        <MainLayout>
            <Head title={`Audit #${submission.id} - ${deptInfo.label}`} />

            <div className="max-w-5xl mx-auto pb-24 space-y-8">
                {/* Header Page */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <Button variant="ghost" className="gap-2 text-slate-500 hover:text-slate-800 p-0 mb-4 h-auto" asChild>
                            <Link href={route('audits.index')}>
                                <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
                            </Link>
                        </Button>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                            <span className={`w-3 h-8 rounded-full bg-${deptInfo.color}-500`} /> 
                            Audit: {deptInfo.label}
                        </h2>
                        <p className="text-slate-500 mt-1">Rapport de gestion documentaire • Réf: {submission.reference_mission || 'N/A'}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex flex-col items-end">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Date d'entretien</span>
                        <span className="text-lg font-bold text-slate-800">
                            {submission.date_entretien ? new Date(submission.date_entretien).toLocaleDateString('fr-FR') : 'Non précisée'}
                        </span>
                    </div>
                </div>

                {/* Identification */}
                <Card className="border-none shadow-md overflow-hidden bg-white/90 backdrop-blur-xl">
                    <SectionHeader num="ID" title="Fiche d'identification" />
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
                        <div>
                            <p className="text-sm text-slate-500 font-medium mb-1">Responsable interviewé</p>
                            <p className="text-lg font-semibold text-slate-800">{submission.responsable_interviewe || '-'}</p>
                            <p className="text-sm text-slate-600">{submission.fonction || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium mb-1">Département/Pôle</p>
                            <p className="text-base font-medium text-slate-800">{submission.bureau || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium mb-1">Durée (h)</p>
                            <p className="text-base font-medium text-slate-800">{submission.duree || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium mb-1">Effectifs / Agents formés</p>
                            <p className="text-base font-medium text-slate-800">
                                {submission.effectif || '?'} total / {submission.agents_formes || '0'} formés
                            </p>
                        </div>
                        <div className="lg:col-span-2">
                            <p className="text-sm text-slate-500 font-medium mb-1">Mission menée par</p>
                            <p className="text-base font-medium text-slate-800">
                                {submission.chef_mission || 'Chef de mission N/A'} & {submission.auditeur || 'Auditeur N/A'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* I. Politique */}
                <Card className="border-none shadow-md overflow-hidden bg-white/90 backdrop-blur-xl">
                    <SectionHeader num="I" title="Politique d'Archivage" />
                    <CardContent className="space-y-4 px-6">
                        {[
                            { k: 'q1', text: "Connaissance de la politique d'archivage du CEPI" },
                            { k: 'q2', text: "Utilisation d'un plan de classement documentaire" },
                            { k: 'q3', text: "Connaissance et application des durées légales (DUA)" },
                            { k: 'q4', text: "Utilisation systématique du bordereau de versement" }
                        ].map((q, i) => {
                            const rep = responses.I?.[q.k];
                            const obs = responses.I?.[`${q.k}_obs`];
                            
                            return (
                                <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                                    <span className="font-medium text-slate-700 md:w-1/2">{q.text}</span>
                                    <div className="flex gap-4 items-center">
                                        {rep === 'Oui' ? (
                                            <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                                                <Check className="w-4 h-4" /> Oui
                                            </span>
                                        ) : rep === 'Non' ? (
                                            <span className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                                                <X className="w-4 h-4" /> Non
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-sm">Non renseigné</span>
                                        )}
                                    </div>
                                    <div className="md:w-1/3 bg-white p-2 rounded-md border border-slate-200 text-sm min-h-[40px] text-slate-600">
                                        {obs || <span className="text-slate-400 italic">Aucune observation</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* II. Recensement */}
                <Card className="border-none shadow-md overflow-hidden bg-white/90 backdrop-blur-xl">
                    <SectionHeader num="II" title="Recensement Documentaire" />
                    <CardContent className="px-6 space-y-4">
                        {(responses.II || []).map((doc, i) => (
                            <div key={i} className={`p-4 rounded-xl border-l-4 ${doc.checked ? 'border-l-emerald-500 bg-emerald-50/30' : 'border-l-red-400 bg-red-50/30'} flex flex-col md:flex-row gap-4 justify-between transition-colors border-y border-r border-slate-100`}>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800">{doc.titre}</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs bg-white text-slate-600 px-2 py-1 rounded-md shadow-sm border border-slate-200">DUA: {doc.dua}</span>
                                        <span className="text-xs bg-white text-slate-600 px-2 py-1 rounded-md shadow-sm border border-slate-200">Accès: {doc.acces}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {doc.checked ? (
                                        <span className="text-emerald-600 font-bold flex items-center justify-end gap-1"><Check className="w-4 h-4" /> Complet</span>
                                    ) : (
                                        <span className="text-red-500 font-bold flex items-center justify-end gap-1"><X className="w-4 h-4" /> Incomplet</span>
                                    )}
                                    <p className="text-sm mt-2 font-medium text-slate-600 bg-white px-3 py-1 rounded-md border border-slate-100 shadow-sm inline-block">
                                        Obs: {doc.obs || 'Néant'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* III. Questions */}
                <Card className="border-none shadow-md overflow-hidden bg-white/90 backdrop-blur-xl">
                    <SectionHeader num="III" title="Questions Spécifiques" />
                    <CardContent className="px-6 space-y-6">
                        {(responses.III || []).map((item, i) => (
                            <div key={i} className="space-y-2 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                <Label className="text-base text-slate-800 leading-relaxed font-semibold flex gap-2 items-start">
                                    <span className={`text-${deptInfo.color}-500 text-xl leading-none font-bold`}>Q{i+1}.</span> 
                                    {item.question}
                                </Label>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
                                    {item.reponse || <span className="italic text-slate-400">Aucune réponse renseignée.</span>}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* IV & IX. Versement et Checklist */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-none shadow-md overflow-hidden bg-white/90 backdrop-blur-xl">
                        <SectionHeader num="IV" title="Versement / Circuit" />
                        <CardContent className="px-6 space-y-6">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Documents Versés / Non Versés</p>
                                <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{responses.IV_general?.q1 || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Responsable / Correspondant Archives</p>
                                <p className="text-sm text-slate-800 font-medium">{responses.IV_general?.q2 || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fréquence & Transfert Réseau</p>
                                <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    Fréq: {responses.IV_general?.q3 || '-'} <br/> Outil: {responses.IV_general?.q4 || '-'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md overflow-hidden bg-white/90 backdrop-blur-xl">
                        <SectionHeader num="IX" title="Checklist" />
                        <CardContent className="px-6 space-y-3">
                            {(responses.IX || []).map((doc, i) => (
                                <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-sm font-medium text-slate-700 text-left w-full sm:w-auto mb-2 sm:mb-0">{doc.document}</span>
                                    {doc.disponible ? (
                                        <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">
                                            <Check className="w-3 h-3" /> Reçu
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">
                                            Manquant
                                        </span>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* X. Synthèse */}
                <Card className="border-none shadow-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white">
                    <CardHeader className="border-b border-slate-700/50 mb-4 bg-slate-800/50 flex flex-row items-center gap-4 py-6 px-8">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${deptInfo.color}-500 text-white font-bold text-xl`}>X</div>
                        <div>
                            <CardTitle className="text-2xl text-white">Synthèse et Recommandations</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8 px-8 pb-8">
                        <div className="space-y-3">
                            <Label className="text-emerald-400 font-bold flex items-center gap-2 text-lg"><Check className="w-5 h-5" /> Points forts</Label>
                            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 whitespace-pre-wrap text-slate-300">
                                {responses.X?.points_forts || 'Non renseigné'}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-red-400 font-bold flex items-center gap-2 text-lg"><ShieldAlert className="w-5 h-5" /> Dysfonctionnements et risques</Label>
                            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 whitespace-pre-wrap text-slate-300">
                                {responses.X?.dysfonctionnements || 'Non renseigné'}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-blue-400 font-bold text-lg">💡 Recommandations préliminaires</Label>
                            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 whitespace-pre-wrap text-white font-medium">
                                {responses.X?.recommandations || 'Non renseigné'}
                            </div>
                        </div>
                        <div className="space-y-3 pt-6 border-t border-slate-700">
                            <Label className="text-slate-400 font-bold text-sm">📝 Observations libres</Label>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap text-slate-400 text-sm">
                                {responses.X?.observations_libres || 'Aucune'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </MainLayout>
    );
}
