<?php

namespace App\Http\Controllers;

use App\Models\AuditSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditController extends Controller
{
    public function dashboard()
    {
        $submissions = AuditSubmission::latest()->get();
        return Inertia::render('Dashboard', [
            'submissions' => $submissions,
            'stats' => [
                'total' => $submissions->count(),
                'by_department' => $submissions->groupBy('department')->map->count(),
                'avg_score' => $submissions->avg('score') ?? 0,
            ]
        ]);
    }

    public function create($department)
    {
        $config = config('audit_forms.forms.' . $department);
        
        if (!$config) {
            abort(404);
        }

        return Inertia::render('Audit/Create', [
            'department' => $department,
            'departmentName' => $config['name'],
            'prefilledItems' => $config['items'],
        ]);
    }

    public function store(Request $request, $department)
    {
        $validated = $request->validate([
            'reference' => 'nullable|string',
            'interviewee_name' => 'required|string',
            'interviewee_role' => 'nullable|string',
            'date_interview' => 'required|date',
            'data' => 'required|array',
        ]);

        $submission = AuditSubmission::create([
            'department' => $department,
            'reference' => $validated['reference'],
            'interviewee_name' => $validated['interviewee_name'],
            'interviewee_role' => $validated['interviewee_role'],
            'date_interview' => $validated['date_interview'],
            'data' => $validated['data'],
            'user_id' => auth()->id(),
            'score' => $this->calculateScore($validated['data']),
        ]);

        return redirect()->route('dashboard')->with('message', 'Audit soumis avec succès !');
    }

    private function calculateScore($data)
    {
        // Simple logic: count 'yes' in the checklist
        $checklist = $data['checklist'] ?? [];
        if (empty($checklist)) return 0;
        
        $yesCount = count(array_filter($checklist, fn($item) => ($item['value'] ?? '') === 'yes'));
        return ($yesCount / count($checklist)) * 100;
    }
}
