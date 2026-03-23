<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 9px;
            color: #1e293b;
            background: #fff;
        }

        /* ── Header ── */
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 20px 24px 16px;
            margin-bottom: 18px;
        }
        .header h1 { font-size: 18px; font-weight: bold; letter-spacing: 0.5px; }
        .header p  { font-size: 9px; opacity: 0.85; margin-top: 3px; }
        .header-meta { float: right; text-align: right; font-size: 8px; opacity: 0.9; }
        .header::after { content: ''; display: block; clear: both; }

        /* ── Summary badges ── */
        .summary {
            display: flex;
            gap: 10px;
            margin: 0 24px 16px;
        }
        .badge {
            flex: 1;
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 6px;
            padding: 8px 12px;
            text-align: center;
        }
        .badge-value { font-size: 20px; font-weight: bold; color: #1d4ed8; }
        .badge-label { font-size: 7px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

        /* ── Table ── */
        .table-wrapper { margin: 0 24px; }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7.5px;
        }
        thead tr {
            background: #1e40af;
            color: white;
        }
        thead th {
            padding: 7px 6px;
            text-align: left;
            font-weight: 600;
            letter-spacing: 0.3px;
            white-space: nowrap;
        }
        tbody tr { border-bottom: 1px solid #e2e8f0; }
        tbody tr:nth-child(even) { background: #f8fafc; }
        tbody tr:hover { background: #eff6ff; }
        tbody td { padding: 6px 6px; vertical-align: top; }

        /* Department badge colours */
        .dept { display: inline-block; padding: 2px 6px; border-radius: 10px; font-weight: 700; font-size: 7px; text-transform: uppercase; }
        .dept-audit       { background: #dbeafe; color: #1d4ed8; }
        .dept-conformite  { background: #fee2e2; color: #b91c1c; }
        .dept-credit      { background: #d1fae5; color: #065f46; }
        .dept-daf         { background: #fef3c7; color: #92400e; }
        .dept-informatique{ background: #ede9fe; color: #5b21b6; }
        .dept-marketing   { background: #fce7f3; color: #9d174d; }

        /* ── Footer ── */
        .footer {
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: #f1f5f9;
            border-top: 1px solid #cbd5e1;
            padding: 6px 24px;
            font-size: 7px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
        }

        .page-number:after { content: counter(page); }
    </style>
</head>
<body>

    {{-- Header --}}
    <div class="header">
        <div class="header-meta">
            Généré le {{ now()->format('d/m/Y à H:i') }}<br>
            Total : {{ count($submissions) }} audit(s)
        </div>
        <h1>Rapport d'Audit — Excelencis Group</h1>
        <p>Tableau récapitulatif de toutes les soumissions de formulaires d'audit archivage</p>
    </div>

    {{-- Summary badges --}}
    <table style="width: calc(100% - 48px); margin: 0 24px 16px; border-collapse: separate; border-spacing: 8px 0;">
        <tr>
            <td style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:8px 12px;text-align:center;">
                <div style="font-size:18px;font-weight:bold;color:#1d4ed8;">{{ count($submissions) }}</div>
                <div style="font-size:7px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Total Audits</div>
            </td>
            <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:8px 12px;text-align:center;">
                <div style="font-size:18px;font-weight:bold;color:#15803d;">{{ $departments->count() }}</div>
                <div style="font-size:7px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Départements</div>
            </td>
            <td style="background:#fefce8;border:1px solid #fde68a;border-radius:6px;padding:8px 12px;text-align:center;">
                <div style="font-size:18px;font-weight:bold;color:#b45309;">{{ $submissions->where('created_at', '>=', now()->subDays(7))->count() }}</div>
                <div style="font-size:7px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">7 Derniers jours</div>
            </td>
        </tr>
    </table>

    {{-- Data table (Summary) --}}
    <h2 style="margin: 0 24px 8px; font-size: 14px; color: #1e40af;">Tableau récapitulatif</h2>
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th style="width:20px;">#</th>
                    <th style="width:55px;">Département</th>
                    <th style="width:65px;">Réf. Mission</th>
                    <th style="width:65px;">Auditeur</th>
                    <th style="width:50px;">Date entretien</th>
                    <th style="width:32px;">Durée</th>
                    <th style="width:80px;">Responsable</th>
                    <th style="width:50px;">Bureau</th>
                    <th style="width:30px;">Effectif</th>
                    <th style="width:55px;">Soumis le</th>
                </tr>
            </thead>
            <tbody>
                @forelse($submissions as $sub)
                <?php
                    $dept = strtolower($sub->department ?? '');
                    $deptClass = 'dept-' . $dept;
                    $dateEntretien = '';
                    if (!empty($sub->getRawOriginal('date_entretien'))) {
                        $dateEntretien = date('d/m/Y', strtotime($sub->getRawOriginal('date_entretien')));
                    }
                    $createdAt = $sub->created_at ? $sub->created_at->format('d/m/Y') : '';
                ?>
                <tr>
                    <td style="color:#94a3b8;">{{ $sub->id }}</td>
                    <td><span class="dept {{ $deptClass }}">{{ strtoupper($dept) }}</span></td>
                    <td>{{ $sub->reference_mission ?? '—' }}</td>
                    <td>{{ $sub->auditeur ?? '—' }}</td>
                    <td>{{ $dateEntretien ?: '—' }}</td>
                    <td>{{ $sub->duree ? $sub->duree . 'h' : '—' }}</td>
                    <td>{{ $sub->responsable_interviewe ?? '—' }}</td>
                    <td>{{ $sub->bureau ?? '—' }}</td>
                    <td style="text-align:center;">{{ $sub->effectif ?? '—' }}</td>
                    <td style="color:#64748b;">{{ $createdAt }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="10" style="text-align:center;padding:20px;color:#94a3b8;">Aucun audit enregistré</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- Detailed Views (One per submission) --}}
    @foreach($submissions as $sub)
    <div style="page-break-before: always; margin: 24px;">
        <div style="border-bottom: 2px solid #1e40af; padding-bottom: 8px; margin-bottom: 16px;">
            <h2 style="font-size: 16px; color: #1e40af; display: inline-block;">
                DÉTAILS DE LA SOUMISSION #{{ $sub->id }} — {{ strtoupper($sub->department) }}
            </h2>
            <span style="float: right; color: #64748b; font-size: 9px;">Soumis le {{ $sub->created_at->format('d/m/Y à H:i') }}</span>
        </div>

        {{-- Info Box --}}
        <div style="background: #f8fafc; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <table style="width: 100%; border: none; font-size: 9px;">
                <tr>
                    <td style="width: 25%; color: #64748b;">Auditeur :</td>
                    <td style="width: 25%; font-weight: bold;">{{ $sub->auditeur ?: '—' }}</td>
                    <td style="width: 25%; color: #64748b;">Réf. Mission :</td>
                    <td style="width: 25%; font-weight: bold;">{{ $sub->reference_mission ?: '—' }}</td>
                </tr>
                <tr>
                    <td style="color: #64748b;">Responsable interrogé :</td>
                    <td style="font-weight: bold;">{{ $sub->responsable_interviewe ?: '—' }}</td>
                    <td style="color: #64748b;">Fonction :</td>
                    <td style="font-weight: bold;">{{ $sub->fonction ?: '—' }}</td>
                </tr>
                <tr>
                    <td style="color: #64748b;">Date entretien :</td>
                    <td style="font-weight: bold;">{{ $sub->date_entretien ? $sub->date_entretien->format('d/m/Y') : '—' }}</td>
                    <td style="color: #64748b;">Durée :</td>
                    <td style="font-weight: bold;">{{ $sub->duree ? $sub->duree . ' h' : '—' }}</td>
                </tr>
                <tr>
                    <td style="color: #64748b;">Téléphone :</td>
                    <td style="font-weight: bold;">{{ $sub->telephone ?: '—' }}</td>
                    <td style="color: #64748b;">Chef de mission :</td>
                    <td style="font-weight: bold;">{{ $sub->chef_mission ?: '—' }}</td>
                </tr>
                <tr>
                    <td style="color: #64748b;">Bureau :</td>
                    <td style="font-weight: bold;">{{ $sub->bureau ?: '—' }}</td>
                    <td style="color: #64748b;">Agents formés :</td>
                    <td style="font-weight: bold;">{{ $sub->agents_formes ?: '0' }}</td>
                </tr>
            </table>
        </div>

        {{-- Loop through responses JSON --}}
        @if($sub->responses && is_array($sub->responses))
            @foreach($sub->responses as $sectionTitle => $sectionData)
                <div style="margin-bottom: 12px;">
                    <h3 style="background: #eff6ff; color: #1d4ed8; padding: 4px 8px; font-size: 10px; border-left: 3px solid #1d4ed8; margin-bottom: 6px;">
                        Section {{ $sectionTitle }}
                    </h3>

                    @if(is_array($sectionData))
                        <div style="margin-left: 8px;">
                            @foreach($sectionData as $key => $value)
                                @if(is_array($value))
                                    {{-- List for nested arrays (simpler than table) --}}
                                    <div style="margin-bottom: 8px; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden;">
                                        <div style="background: #f1f5f9; padding: 4px 8px; font-weight: bold; font-size: 8px; border-bottom: 1px solid #e2e8f0; color: #475569;">
                                            Audit Item #{{ $key + 1 }}
                                        </div>
                                        <div style="padding: 4px;">
                                            @foreach($value as $k => $v)
                                                <div style="margin-bottom: 2px;">
                                                    <span style="color: #64748b; font-size: 7px; font-weight: bold;">{{ ucwords(str_replace('_', ' ', $k)) }}:</span>
                                                    <span style="font-size: 7.5px; color: #1e293b;">
                                                        @if(is_bool($v)) {{ $v ? 'Oui' : 'Non' }}
                                                        @elseif(is_array($v)) {{ implode(', ', $v) }}
                                                        @else {{ $v ?: '—' }}
                                                        @endif
                                                    </span>
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                @else
                                    <div style="margin-bottom: 4px; padding-bottom: 2px; border-bottom: 1px solid #f1f5f9;">
                                        <div style="color: #64748b; font-size: 7.5px; margin-bottom: 1px;">{{ ucwords(str_replace('_', ' ', $key)) }}</div>
                                        <div style="font-weight: bold; font-size: 8.5px; color: #1e293b;">
                                            @if(is_bool($value)) {{ $value ? 'Oui' : 'Non' }}
                                            @else {{ $value ?: '—' }}
                                            @endif
                                        </div>
                                    </div>
                                @endif
                            @endforeach
                        </div>
                    @else
                        <p style="padding: 4px 8px;">{{ $sectionData }}</p>
                    @endif
                </div>
            @endforeach
        @else
            <p style="color: #94a3b8; font-style: italic;">Aucune réponse détaillée disponible pour cette soumission.</p>
        @endif
    </div>
    @endforeach

    {{-- Footer --}}
    <div class="footer">
        <span>Excelencis Group — Rapport Complet Confidentiel</span>
        <span>Généré le {{ now()->format('d/m/Y H:i') }}</span>
        <span>Page <span class="page-number"></span></span>
    </div>

</body>
</html>
