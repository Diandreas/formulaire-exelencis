import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Save, ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import formsData from '@/Config/formsData.json';

/* Safelist for Tailwind 4 dynamic classes used in this file:
   bg-blue-500 bg-blue-100 bg-blue-600 bg-blue-700 bg-blue-50 border-blue-500 border-blue-300 text-blue-600 text-blue-500 text-blue-700 shadow-blue-500/20 shadow-blue-500/30 shadow-blue-500/40 focus:ring-blue-500 bg-blue-50/30 border-blue-200
   bg-red-500 bg-red-100 bg-red-600 bg-red-700 bg-red-50 border-red-500 border-red-300 text-red-600 text-red-500 text-red-700 shadow-red-500/20 shadow-red-500/30 shadow-red-500/40 focus:ring-red-500 bg-red-50/30 border-red-200
   bg-emerald-500 bg-emerald-100 bg-emerald-600 bg-emerald-700 bg-emerald-50 border-emerald-500 border-emerald-300 text-emerald-600 text-emerald-500 text-emerald-700 shadow-emerald-500/20 shadow-emerald-500/30 shadow-emerald-500/40 focus:ring-emerald-500 bg-emerald-50/30 border-emerald-200
   bg-amber-500 bg-amber-100 bg-amber-600 bg-amber-700 bg-amber-50 border-amber-500 border-amber-300 text-amber-600 text-amber-500 text-amber-700 shadow-amber-500/20 shadow-amber-500/30 shadow-amber-500/40 focus:ring-amber-500 bg-amber-50/30 border-amber-200
   bg-purple-500 bg-purple-100 bg-purple-600 bg-purple-700 bg-purple-50 border-purple-500 border-purple-300 text-purple-600 text-purple-500 text-purple-700 shadow-purple-500/20 shadow-purple-500/30 shadow-purple-500/40 focus:ring-purple-500 bg-purple-50/30 border-purple-200
   bg-pink-500 bg-pink-100 bg-pink-600 bg-pink-700 bg-pink-50 border-pink-500 border-pink-300 text-pink-600 text-pink-500 text-pink-700 shadow-pink-500/20 shadow-pink-500/30 shadow-pink-500/40 focus:ring-pink-500 bg-pink-50/30 border-pink-200
   bg-slate-100 bg-slate-200 bg-slate-300 border-slate-200
*/

export default function AuditForm({ department }) {
    const config = formsData[department];
    const [activeSection, setActiveSection] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitReady, setSubmitReady] = useState(false);
    const formRef = React.useRef(null);

    // Auto-generate reference mission
    const autoRef = `AUD-${department.toUpperCase().substring(0,3)}-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}-${Math.floor(Math.random()*1000)}`;

    const [formData, setFormData] = useState({
        department: department,
        reference_mission: autoRef,
        version: 'V 1.0',
        responsable_interviewe: '',
        fonction: '',
        telephone: '',
        bureau: '',
        effectif: '',
        agents_formes: '',
        date_entretien: new Date().toISOString().split('T')[0],
        duree: '',
        chef_mission: '',
        auditeur: '',
        responses: {
            I: {},
            II: config?.II?.map(doc => ({ ...doc, checked: false, obs: '' })) || [],
            III: config?.III?.map(q => ({ question: q, reponse: '' })) || [],
            IV_general: {}, IV_table: [],
            V: [], VI: [],
            VII_physique: [], VII_informatique: [], VII_besoins: [],
            VIII_q1: '', VIII_q2: '', VIII_table: [],
            IX: config?.IX?.map(doc => ({ ...doc, disponible: false, obs: '' })) || [],
            X: { points_forts: '', dysfonctionnements: '', recommandations: '', observations_libres: '' }
        }
    });

    // Scroll to top on section change on mobile
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Prevent accidental double clicks from submitting the form by delaying the submit button
        if (activeSection === 6) {
            setSubmitReady(false);
            const timer = setTimeout(() => setSubmitReady(true), 800);
            return () => clearTimeout(timer);
        }
    }, [activeSection]);

    if (!config) {
        return <div className="p-12 text-center text-red-500">Configuration introuvable pour ce département.</div>;
    }

    const depts = {
        audit: { color: 'blue', label: 'Audit Interne' },
        conformite: { color: 'red', label: 'Conformité & Contrôle' },
        credit: { color: 'emerald', label: 'Crédit' },
        daf: { color: 'amber', label: 'DAF' },
        informatique: { color: 'purple', label: 'Informatique' },
        marketing: { color: 'pink', label: 'Marketing & Opérations' }
    };
    const deptInfo = depts[department];

    const handleNextStep = () => {
        // 1. Native HTML5 Validation checking (for required inputs in the current DOM step)
        if (formRef.current && !formRef.current.reportValidity()) {
            return;
        }

        // 2. Custom Validation for Step 2 (Oui/Non radio buttons must be answered)
        if (activeSection === 2 && config.I) {
            const allAnswered = config.I.every(q => formData.responses.I?.[q.id]);
            if (!allAnswered) {
                alert("Veuillez répondre (Oui/Non) à toutes les questions de la Politique d'archivage avant de continuer.");
                return;
            }
        }

        setActiveSection(activeSection + 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Final native validation
        if (formRef.current && !formRef.current.reportValidity()) {
            return;
        }

        setSubmitting(true);
        router.post(route('audits.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
                setSubmitted(true);
            },
            onError: () => setSubmitting(false)
        });
    };

    const updateResponse = (section, key, value) => {
        setFormData(prev => ({
            ...prev,
            responses: {
                ...prev.responses,
                [section]: { ...prev.responses[section], [key]: value }
            }
        }));
    };

    const sections = [
        { id: 1, title: "Identification" },
        { id: 2, title: "Politique d'Archivage" },
        { id: 3, title: "Recensement" },
        { id: 4, title: "Questions Spécifiques" },
        { id: 5, title: "Versement" },
        { id: 6, title: "Synthèse" }
    ];

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-slate-100"
                >
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className={`w-24 h-24 bg-${deptInfo.color}-100 rounded-full mx-auto flex items-center justify-center mb-6`}
                    >
                        <Check className={`w-12 h-12 text-${deptInfo.color}-600`} strokeWidth={3} />
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl font-bold text-slate-800 mb-2"
                    >
                        Merci de votre participation
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-500 mb-2"
                    >
                        Vos réponses ont été enregistrées avec succès et transmises à l'équipe.
                    </motion.p>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-slate-400 mt-6 pt-6 border-t border-slate-100"
                    >
                        Vous pouvez fermer cette page.
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Head title={`Audit - ${deptInfo.label}`} />

            {/* Simple Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Excelencis Group</h1>
                            <p className="text-xs text-slate-500 font-medium">Audit d'Archivage Interne</p>
                        </div>
                    </div>
                    {/* Mobile Progress Pill */}
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full bg-${deptInfo.color}-100 text-${deptInfo.color}-700 lg:hidden`}>
                        {activeSection} / 6
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
                
                {/* Desktop Progress Bar (replaces sidebar) */}
                <div className="hidden lg:flex justify-between items-center mb-10 px-4 relative">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-10 rounded-full"></div>
                    <motion.div 
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-${deptInfo.color}-500 -z-10 rounded-full transition-all duration-300 ease-out`}
                        style={{ width: `${((activeSection - 1) / 5) * 100}%` }}
                    />
                    
                    {sections.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => activeSection > s.id && setActiveSection(s.id)}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                                activeSection > s.id 
                                ? `bg-${deptInfo.color}-500 text-white shadow-${deptInfo.color}-500/30` 
                                : activeSection === s.id 
                                    ? `bg-white border-2 border-${deptInfo.color}-500 text-${deptInfo.color}-600 scale-110` 
                                    : 'bg-white border border-slate-200 text-slate-400'
                            }`}>
                                {activeSection > s.id ? <Check className="w-5 h-5" /> : s.id}
                            </div>
                            <span className={`text-xs font-medium w-20 text-center ${activeSection === s.id ? `text-${deptInfo.color}-700` : 'text-slate-500'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                <form 
                    ref={formRef}
                    onSubmit={handleSubmit} 
                    className="space-y-6 relative"
                    onKeyDown={(e) => {
                        // Prevent ALL Enter key default form submissions
                        // Allow Enter only on textareas for newlines
                        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                            e.preventDefault();
                        }
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            {activeSection === 1 && (
                                <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
                                    <div className={`h-2 w-full bg-${deptInfo.color}-500`} />
                                    <CardHeader className="border-b border-slate-100 mb-4 bg-slate-50/50 p-6 sm:p-8">
                                        <CardTitle className="text-2xl sm:text-3xl text-slate-800 leading-tight">
                                            Audit : {deptInfo.label}
                                        </CardTitle>
                                        <CardDescription className="text-base mt-2">
                                            Bienvenue sur le formulaire d'évaluation et de recensement documentaire de votre département. 
                                            Vos réponses permettront d'optimiser le système d'archivage d'Excelencis Group.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-5 p-6 sm:p-8 pt-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label className="text-slate-600">Nom et Prénom de l'interviewé</Label>
                                                <Input required value={formData.responsable_interviewe} onChange={e => setFormData({...formData, responsable_interviewe: e.target.value})} placeholder="Ex: Jean Dupont" className="bg-slate-50/50 focus:bg-white h-12" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-600">Fonction occupée</Label>
                                                <Input required value={formData.fonction} onChange={e => setFormData({...formData, fonction: e.target.value})} placeholder="Ex: Directeur des Opérations" className="bg-slate-50/50 focus:bg-white h-12" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-600">Effectif de votre département</Label>
                                                <Input type="number" required value={formData.effectif} onChange={e => setFormData({...formData, effectif: e.target.value})} placeholder="Nb de personnes" className="bg-slate-50/50 focus:bg-white h-12" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-600">Agents formés en archives (si connu)</Label>
                                                <Input type="number" value={formData.agents_formes} onChange={e => setFormData({...formData, agents_formes: e.target.value})} placeholder="0" className="bg-slate-50/50 focus:bg-white h-12" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeSection === 2 && (
                                <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-slate-100 mb-4 bg-slate-50/50 p-6">
                                        <CardTitle className="text-xl sm:text-2xl text-slate-800">I. Politique d'Archivage</CardTitle>
                                        <CardDescription>Évaluation de l'application des règles documentaires en interne.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6">
                                        {[
                                            { k: 'q1', text: "Connaissancez-vous la politique d'archivage du CEPI ?" },
                                            { k: 'q2', text: "Utilisez-vous un plan de classement documentaire commun ?" },
                                            { k: 'q3', text: "Appliquez-vous les durées légales de conservation (DUA) ?" },
                                            { k: 'q4', text: "Utilisez-vous un bordereau lors des versements d'archives ?" }
                                        ].map((q, i) => (
                                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50/80 rounded-2xl border border-slate-100 gap-4">
                                                <span className="font-medium text-slate-700 md:w-1/2">{q.text}</span>
                                                <div className="flex gap-6 items-center">
                                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${formData.responses.I[q.k] === 'Oui' ? `border-${deptInfo.color}-500 bg-${deptInfo.color}-50` : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                                                        <input type="radio" name={q.k} onChange={() => updateResponse('I', q.k, 'Oui')} className={`w-5 h-5 text-${deptInfo.color}-500`} /> <span className="font-semibold text-slate-700">Oui</span>
                                                    </label>
                                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${formData.responses.I[q.k] === 'Non' ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                                                        <input type="radio" name={q.k} onChange={() => updateResponse('I', q.k, 'Non')} className="w-5 h-5 text-red-500" /> <span className="font-semibold text-slate-700">Non</span>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {activeSection === 3 && (
                                <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-slate-100 mb-4 bg-slate-50/50 p-6">
                                        <CardTitle className="text-xl sm:text-2xl text-slate-800">II. Recensement de vos Documents</CardTitle>
                                        <CardDescription>Cochez les documents types que vous produisez ou gérez actuellement.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="space-y-4">
                                            {formData.responses.II.map((doc, i) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    key={`doc-${i}`} 
                                                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row gap-4 justify-between sm:items-center cursor-pointer ${doc.checked ? `border-${deptInfo.color}-300 bg-${deptInfo.color}-50/30` : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                                    onClick={(e) => {
                                                        // toggle if user clicks the dev
                                                        if(e.target.tagName !== 'INPUT') {
                                                            const newII = [...formData.responses.II];
                                                            newII[i].checked = !newII[i].checked;
                                                            setFormData({...formData, responses: {...formData.responses, II: newII}});
                                                        }
                                                    }}
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-start gap-3">
                                                            <input type="checkbox" 
                                                                checked={doc.checked}
                                                                className={`mt-1 w-5 h-5 rounded text-${deptInfo.color}-600 focus:ring-${deptInfo.color}-500`}
                                                                onChange={(e) => {
                                                                    const newII = [...formData.responses.II];
                                                                    newII[i].checked = e.target.checked;
                                                                    setFormData({...formData, responses: {...formData.responses, II: newII}});
                                                                }} 
                                                            />
                                                            <h4 className="font-semibold text-slate-800">{doc.titre}</h4>
                                                        </div>
                                                    </div>
                                                    {doc.checked && (
                                                        <motion.div initial={{ opacity:0, width:0 }} animate={{ opacity:1, width:"auto" }} className="w-full sm:w-64 shrink-0">
                                                            <Input 
                                                                placeholder="Précisions ? (ex: version pdf, 2 armoires...)" 
                                                                className="w-full bg-white h-10 border-slate-200"
                                                                value={doc.obs}
                                                                onClick={e => e.stopPropagation()}
                                                                onChange={(e) => {
                                                                    const newII = [...formData.responses.II];
                                                                    newII[i].obs = e.target.value;
                                                                    setFormData({...formData, responses: {...formData.responses, II: newII}});
                                                                }} 
                                                            />
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeSection === 4 && (
                                <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-slate-100 mb-4 bg-slate-50/50 p-6">
                                        <CardTitle className="text-xl sm:text-2xl text-slate-800">III. Questions Spécifiques</CardTitle>
                                        <CardDescription>Quelques questions spécifiques à l'organisation de votre département.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8 p-6">
                                        {formData.responses.III.map((item, i) => (
                                            <div key={i} className="space-y-3">
                                                <Label className="text-base text-slate-800 leading-relaxed font-semibold flex gap-2 items-start">
                                                    <span className={`text-${deptInfo.color}-500 text-xl leading-none font-bold mt-0.5`}>Q{i+1}.</span> 
                                                    {item.question}
                                                </Label>
                                                <textarea 
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow min-h-[120px]"
                                                    placeholder="Détaillez votre réponse ici..."
                                                    value={item.reponse}
                                                    onChange={(e) => {
                                                        const newIII = [...formData.responses.III];
                                                        newIII[i].reponse = e.target.value;
                                                        setFormData({...formData, responses: {...formData.responses, III: newIII}});
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {activeSection === 5 && (
                                <div className="space-y-8">
                                    <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
                                        <CardHeader className="border-b border-slate-100 mb-4 bg-slate-50/50 p-6">
                                            <CardTitle className="text-xl sm:text-2xl text-slate-800">IV. Circuit Documentaire</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="text-slate-700">Tous les documents sont-ils reversés aux archives centrales ? Lesquels ne le sont pas ?</Label>
                                                    <textarea className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm min-h-[80px]" onChange={(e) => updateResponse('IV_general', 'q1', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700">Qui est responsable des versements ?</Label>
                                                    <Input className="bg-slate-50/50 h-12" onChange={(e) => updateResponse('IV_general', 'q2', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700">Où se fait le transfert numérique ?</Label>
                                                    <Input className="bg-slate-50/50 h-12" placeholder="Ex: Serveur NAS partagé" onChange={(e) => updateResponse('IV_general', 'q4', e.target.value)} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
                                        <CardHeader className="border-b border-slate-100 mb-4 bg-slate-50/50 flex flex-row items-center justify-between p-6">
                                            <CardTitle className="text-xl sm:text-2xl text-slate-800">Checklist Documents</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 p-6 pt-0">
                                            {formData.responses.IX.map((doc, i) => (
                                                <label key={`ix-${i}`} className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <span className="text-sm font-medium text-slate-700">{doc.document}</span>
                                                    <input type="checkbox" checked={doc.disponible} className={`w-5 h-5 rounded text-${deptInfo.color}-600 focus:ring-${deptInfo.color}-500 ml-4`} onChange={(e) => {
                                                        const newIX = [...formData.responses.IX];
                                                        newIX[i].disponible = e.target.checked;
                                                        setFormData({...formData, responses: {...formData.responses, IX: newIX}});
                                                    }} /> 
                                                </label>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeSection === 6 && (
                                <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-slate-100 mb-4 bg-slate-50/50 p-6">
                                        <CardTitle className="text-xl sm:text-2xl text-slate-800">Espace Libre</CardTitle>
                                        <CardDescription>Vos remarques et suggestions pour améliorer la gestion documentaire.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8 p-6">
                                        <div className="space-y-3">
                                            <Label className="text-slate-700 font-bold text-lg">Vos attentes vis-à-vis des archives :</Label>
                                            <textarea className="w-full rounded-2xl border border-blue-200 bg-blue-50/30 px-5 py-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                                onChange={(e) => updateResponse('X', 'recommandations', e.target.value)} />
                                        </div>
                                        <div className="space-y-3 pb-4">
                                            <Label className="text-slate-700 font-bold text-lg">Autres observations libres :</Label>
                                            <textarea className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-slate-500 min-h-[120px]"
                                                onChange={(e) => updateResponse('X', 'observations_libres', e.target.value)} />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Bar Fixed to Bottom */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-50">
                        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                             <Button type="button" variant="outline" size="lg" className="rounded-full w-14 sm:w-auto px-0 sm:px-6 h-12 flex-shrink-0 border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm" onClick={() => setActiveSection(Math.max(1, activeSection - 1))} disabled={activeSection === 1}>
                                <ArrowLeft className="w-5 h-5 sm:mr-2" />
                                <span className="hidden sm:inline">Précédent</span>
                             </Button>
                             
                             {activeSection < 6 ? (
                                <Button type="button" size="lg" onClick={handleNextStep} className={`w-full sm:w-auto h-12 bg-${deptInfo.color}-600 hover:bg-${deptInfo.color}-700 px-8 rounded-full shadow-lg shadow-${deptInfo.color}-500/20 text-base font-semibold transition-all hover:scale-105 active:scale-95 text-white`}>
                                    Continuer vers l'étape {activeSection + 1}
                                </Button>
                             ) : (
                                <div className="w-full sm:w-auto">
                                    <Button type="submit" size="lg" disabled={submitting || !submitReady} className={`w-full h-12 bg-slate-900 hover:bg-slate-800 px-8 rounded-full shadow-xl text-base font-bold transition-all ${submitReady ? 'hover:scale-105 active:scale-95 shadow-slate-900/40 opacity-100' : 'opacity-70 cursor-not-allowed'} flex items-center gap-2 text-white`}>
                                        {submitting ? 'Validation en cours...' : <><Save className="w-5 h-5" /> Validation Finale</>}
                                    </Button>
                                    {!submitReady && <p className="text-[10px] text-slate-400 absolute bottom-1 right-8 lg:right-auto">Veuillez vérifier vos réponses...</p>}
                                </div>
                             )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
