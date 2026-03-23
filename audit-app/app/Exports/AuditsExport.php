<?php

namespace App\Exports;

use App\Models\AuditSubmission;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AuditsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    public function collection()
    {
        return AuditSubmission::latest()->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Département',
            'Réf. Mission',
            'Auditeur',
            'Date Entretien',
            'Durée (h)',
            'Responsable Interviewé',
            'Fonction',
            'Bureau',
            'Effectif',
            'Agents Formés',
            'Date de soumission',
        ];
    }

    public function map($row): array
    {
        $dateEntretien = '';
        if (!empty($row->date_entretien)) {
            $dateEntretien = is_object($row->date_entretien)
                ? $row->date_entretien->format('d/m/Y')
                : date('d/m/Y', strtotime($row->date_entretien));
        }

        $createdAt = '';
        if (!empty($row->created_at)) {
            $createdAt = is_object($row->created_at)
                ? $row->created_at->format('d/m/Y H:i')
                : date('d/m/Y H:i', strtotime($row->created_at));
        }

        return [
            $row->id,
            strtoupper($row->department),
            $row->reference_mission,
            $row->auditeur,
            $dateEntretien,
            $row->duree,
            $row->responsable_interviewe,
            $row->fonction,
            $row->bureau,
            $row->effectif,
            $row->agents_formes,
            $createdAt,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Bold the header row
            1 => ['font' => ['bold' => true, 'size' => 11]],
        ];
    }
}
