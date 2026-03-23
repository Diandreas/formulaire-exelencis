<?php

namespace App\Http\Controllers;

use App\Models\AuditSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

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
     * Show the dedicated export page.
     */
    public function exportPage()
    {
        $submissions = AuditSubmission::latest()->get();
        $departments = $submissions->pluck('department')->unique()->map(fn($d) => strtoupper($d))->values();

        return Inertia::render('Audits/Export', [
            'totalAudits' => $submissions->count(),
            'departments' => $departments,
        ]);
    }

    /**
     * Generate and download a PDF report — completely outside Inertia.
     */
    public function downloadPdf()
    {
        // Increase memory and time for large PDF generation
        ini_set('memory_limit', '512M');
        set_time_limit(300);

        $submissions = AuditSubmission::latest()->get();
        $departments = $submissions->pluck('department')->unique()->map(fn($d) => strtoupper($d));

        $pdf = Pdf::loadView('pdf.audits', [
            'submissions' => $submissions,
            'departments' => $departments,
        ])->setPaper('a4', 'landscape');

        $filename = 'rapport_audits_' . date('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }
}
