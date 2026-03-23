<?php

namespace App\Http\Controllers;

use App\Models\AuditSubmission;
use Illuminate\Support\Facades\Response;

class ExportController extends Controller
{
    public function export(AuditSubmission $submission)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"audit_{$submission->department}_{$submission->id}.csv\"",
        ];

        $callback = function () use ($submission) {
            $file = fopen('php://output', 'w');
            
            // Header Info
            fputcsv($file, ['Audit d\'Archivage - Exelencis']);
            fputcsv($file, ['Département', $submission->department]);
            fputcsv($file, ['Référence', $submission->reference]);
            fputcsv($file, ['Interviewé', $submission->interviewee_name]);
            fputcsv($file, ['Date', $submission->date_interview]);
            fputcsv($file, ['Score (%)', $submission->score]);
            fputcsv($file, []);

            // Checklist
            fputcsv($file, ['--- ÉVALUATION DES PROCÉDURES ---']);
            fputcsv($file, ['Question', 'Réponse', 'Observation']);
            foreach ($submission->data['checklist'] ?? [] as $check) {
                fputcsv($file, [$check['question'], $check['value'], $check['comment']]);
            }
            fputcsv($file, []);

            // Items
            fputcsv($file, ['--- RECENSEMENT DOCUMENTAIRE ---']);
            fputcsv($file, ['Document', 'DUA', 'Classement', 'Statut', 'Observations']);
            foreach ($submission->data['items'] ?? [] as $item) {
                fputcsv($file, [$item['label'], $item['retention'], $item['sorting'], $item['status'], $item['obs']]);
            }

            fclose($file);
        };

        return Response::streamDownload($callback, "audit_{$submission->department}.csv", $headers);
    }
}
