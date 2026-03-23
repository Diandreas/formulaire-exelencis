<?php

namespace App\Http\Controllers;

use App\Models\AuditSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $submissions = AuditSubmission::latest()->get();
        return Inertia::render('Audits/Index', [
            'submissions' => $submissions
        ]);
    }

    /**
     * Show the form for a specific department.
     */
    public function show($department)
    {
        $validDepartments = ['audit', 'conformite', 'credit', 'daf', 'informatique', 'marketing'];
        
        if (!in_array($department, $validDepartments)) {
            abort(404, 'Department not found');
        }

        return Inertia::render('Audits/Form', [
            'department' => $department
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'department' => 'required|string',
            'reference_mission' => 'nullable|string',
            'version' => 'nullable|string',
            'responsable_interviewe' => 'nullable|string',
            'fonction' => 'nullable|string',
            'telephone' => 'nullable|string',
            'bureau' => 'nullable|string',
            'effectif' => 'nullable|integer',
            'agents_formes' => 'nullable|integer',
            'date_entretien' => 'nullable|date',
            'duree' => 'nullable|numeric',
            'chef_mission' => 'nullable|string',
            'auditeur' => 'nullable|string',
            'responses' => 'nullable|array',
        ]);

        $submission = AuditSubmission::create($validated);

        return redirect()->back()->with('success', 'Audit soumis avec succès!');
    }

    /**
     * Display a specific submission.
     */
    public function view(AuditSubmission $auditSubmission)
    {
        return Inertia::render('Audits/View', [
            'submission' => $auditSubmission
        ]);
    }

    /**
     * Export submissions natively to CSV.
     */
    public function export()
    {
        $submissions = AuditSubmission::latest()->get();

        $out = fopen('php://memory', 'w');
        
        // UTF-8 BOM for Excel compatibility
        fputs($out, "\xEF\xBB\xBF");

        // Define columns
        fputcsv($out, [
            'ID', 'Département', 'Réf. Mission', 'Auteur', 'Date Entretien', 
            'Durée', 'Responsable', 'Fonction', 'Bureau', 'Effectif', 'Date de soumission'
        ], ';');

        foreach ($submissions as $sub) {
            fputcsv($out, [
                $sub->id,
                strtoupper($sub->department),
                $sub->reference_mission,
                $sub->auditeur,
                $sub->date_entretien ? \Carbon\Carbon::parse($sub->date_entretien)->format('Y-m-d') : '',
                $sub->duree,
                $sub->responsable_interviewe,
                $sub->fonction,
                $sub->bureau,
                $sub->effectif,
                $sub->created_at->format('Y-m-d H:i:s')
            ], ';');
        }

        rewind($out);
        $csv = stream_get_contents($out);
        fclose($out);

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="audits_export.csv"',
        ]);
    }
}
