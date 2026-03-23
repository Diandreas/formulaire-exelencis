import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Save, ArrowRight } from 'lucide-react';

export default function Create({ department, departmentName, prefilledItems }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        reference: '',
        interviewee_name: '',
        interviewee_role: '',
        date_interview: new Date().toISOString().split('T')[0],
        data: {
            checklist: [
                { id: 1, question: "Connaissance de la politique d'archivage du CEPI", value: '', comment: '' },
                { id: 2, question: "Utilisation d'un plan de classement documentaire", value: '', comment: '' },
                { id: 3, question: "Connaissance et application des durées légales de conservation", value: '', comment: '' },
                { id: 4, question: "Utilisation systématique du bordereau de versement", value: '', comment: '' },
                { id: 5, question: "Application des règles de nommage des fichiers numériques", value: '', comment: '' },
                { id: 6, question: "Présence d'un correspondant archives dans le département", value: '', comment: '' },
                { id: 7, question: "Sensibilisation du personnel à la confidentialité", value: '', comment: '' },
                { id: 8, question: "Tri régulier et élimination des documents périmés", value: '', comment: '' },
            ],
            items: prefilledItems.map(item => ({ ...item, status: 'validé', obs: '' }))
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('audit.store', { department }));
    };

    const updateChecklist = (index, field, value) => {
        const newList = [...data.data.checklist];
        newList[index][field] = value;
        setData('data', { ...data.data, checklist: newList });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.data.items];
        newItems[index][field] = value;
        setData('data', { ...data.data, items: newItems });
    };

    return (
        <AppLayout>
            <Head title={`Audit ${departmentName}`} />
            
            <div className="p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{departmentName}</h1>
                        <p className="text-slate-500">Guide d'entretien — Service Producteur</p>
                    </div>
                    {recentlySuccessful && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100 flex items-center"
                        >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Audit enregistré avec succès
                        </motion.div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    {/* Section Identification */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">1</span>
                            Fiche d'identification
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Référence Mission</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={data.reference}
                                    onChange={e => setData('reference', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Responsable Interviewé *</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={data.interviewee_name}
                                    onChange={e => setData('interviewee_name', e.target.value)}
                                />
                                {errors.interviewee_name && <p className="text-red-500 text-xs mt-1">{errors.interviewee_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Fonction</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={data.interviewee_role}
                                    onChange={e => setData('interviewee_role', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date d'entretien *</label>
                                <input 
                                    type="date" 
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={data.date_interview}
                                    onChange={e => setData('date_interview', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Checklist */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">2</span>
                            Maîtrise des procédures
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="pb-3 pr-4">Pratique évaluée</th>
                                        <th className="pb-3 px-4 w-24">Oui</th>
                                        <th className="pb-3 px-4 w-24">Non</th>
                                        <th className="pb-3 pl-4">Observations / Commentaires</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {data.data.checklist.map((item, idx) => (
                                        <tr key={item.id} className="group">
                                            <td className="py-4 pr-4 text-sm text-slate-700">{item.question}</td>
                                            <td className="py-4 px-4">
                                                <input 
                                                    type="radio" 
                                                    name={`q-${item.id}`} 
                                                    checked={item.value === 'yes'}
                                                    onChange={() => updateChecklist(idx, 'value', 'yes')}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="py-4 px-4">
                                                <input 
                                                    type="radio" 
                                                    name={`q-${item.id}`} 
                                                    checked={item.value === 'no'}
                                                    onChange={() => updateChecklist(idx, 'value', 'no')}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                            </td>
                                            <td className="py-4 pl-4">
                                                <input 
                                                    type="text" 
                                                    placeholder="Ajouter une observation..."
                                                    className="w-full bg-transparent border-none text-sm text-slate-600 focus:ring-0 placeholder:text-slate-300"
                                                    value={item.comment}
                                                    onChange={e => updateChecklist(idx, 'comment', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section Recensement */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">3</span>
                            Recensement de la production documentaire
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="pb-3 pr-4">Document</th>
                                        <th className="pb-3 px-4">DUA</th>
                                        <th className="pb-3 px-4">Classement</th>
                                        <th className="pb-3 px-4">Statut</th>
                                        <th className="pb-3 pl-4">Observations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm">
                                    {data.data.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-3 pr-4 font-medium text-slate-800">{item.label}</td>
                                            <td className="py-3 px-4 text-slate-500">{item.retention}</td>
                                            <td className="py-3 px-4 text-slate-500">{item.sorting}</td>
                                            <td className="py-3 px-4">
                                                <select 
                                                    className="bg-slate-50 border-none rounded text-xs focus:ring-0"
                                                    value={item.status}
                                                    onChange={e => updateItem(idx, 'status', e.target.value)}
                                                >
                                                    <option value="validé">Validé</option>
                                                    <option value="absent">Absent</option>
                                                    <option value="partiel">Partiel</option>
                                                </select>
                                            </td>
                                            <td className="py-3 pl-4">
                                                <input 
                                                    type="text" 
                                                    placeholder="..."
                                                    className="w-full bg-transparent border-none text-xs text-slate-600 focus:ring-0 placeholder:text-slate-300"
                                                    value={item.obs}
                                                    onChange={e => updateItem(idx, 'obs', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="fixed bottom-8 right-8 flex items-center space-x-4">
                        <button 
                            type="button"
                            className="bg-white border border-slate-200 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center"
                        >
                            Enregistrer Brouillon
                        </button>
                        <button 
                            disabled={processing}
                            className="bg-blue-600 px-8 py-3 rounded-xl font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center disabled:opacity-50"
                        >
                            {processing ? 'Chargement...' : 'Soumettre l\'Audit'}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
