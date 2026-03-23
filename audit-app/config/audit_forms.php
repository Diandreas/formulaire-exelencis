<?php

return [
    'forms' => [
        'audit' => [
            'name' => 'Audit Interne',
            'items' => [
                ['label' => 'Plan d\'audit annuel (PAA) approuvé par le Conseil', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Programme de travail de chaque mission d\'audit', 'retention' => '10 ans', 'sorting' => 'Par mission'],
                ['label' => 'Charte d\'audit interne approuvée par le CA', 'retention' => 'Permanent', 'sorting' => 'Thématique'],
                ['label' => 'Univers d\'audit (cartographie des entités auditables)', 'retention' => 'MAJ permanente', 'sorting' => 'Thématique'],
                ['label' => 'Dossier permanent de la mission (DP)', 'retention' => '10 ans', 'sorting' => 'Par mission + chrono'],
                ['label' => 'Dossier de travail courant (feuilles de travail, tests)', 'retention' => '10 ans', 'sorting' => 'Par mission'],
                ['label' => 'Rapport provisoire d\'audit (avant contradiction)', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Procès-verbal de réunion de restitution / contradiction', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Rapport définitif d\'audit interne validé', 'retention' => '10 ans', 'sorting' => 'Chrono'],
            ]
        ],
        'compliance' => [
            'name' => 'Conformité & Contrôle Interne',
            'items' => [
                ['label' => 'Dossiers KYC complets des membres/clients', 'retention' => '10 ans', 'sorting' => 'Alphab. / Num.'],
                ['label' => 'Déclarations de soupçon (DS) transmises à la CENTIF', 'retention' => 'Permanent', 'sorting' => 'Chrono'],
                ['label' => 'Rapports de conformité réglementaire (mensuel/trimestriel)', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Correspondances avec la COBAC (inspections, injonctions)', 'retention' => 'Permanent', 'sorting' => 'Chrono'],
                ['label' => 'Rapports d\'inspection de la COBAC', 'retention' => 'Permanent', 'sorting' => 'Chrono'],
                ['label' => 'Plans de mise en conformité et suivi des recommandations COBAC', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Registre des transactions suspectes ou atypiques', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Programme annuel de contrôle interne (PACI)', 'retention' => '10 ans', 'sorting' => 'Chrono'],
            ]
        ],
        'credit' => [
            'name' => 'Crédit & Engagements',
            'items' => [
                ['label' => 'Dossier de demande de crédit (fiche de renseignements)', 'retention' => '10 ans', 'sorting' => 'Chronologique'],
                ['label' => 'Rapport d\'analyse financière du demandeur', 'retention' => '10 ans', 'sorting' => 'Chronologique'],
                ['label' => 'Fiche de scoring / notation du risque', 'retention' => '10 ans', 'sorting' => 'Chronologique'],
                ['label' => 'Procès-verbal du Comité de Crédit', 'retention' => '10 ans', 'sorting' => 'Chronologique'],
                ['label' => 'Lettre de notification de décision (accord/rejet)', 'retention' => '10 ans', 'sorting' => 'Chrono par client'],
                ['label' => 'Contrat de prêt signé (toutes clauses)', 'retention' => '10 ans après fin', 'sorting' => 'Alphab. + Num.'],
            ]
        ],
        'daf' => [
            'name' => 'Direction Administrative et Financière',
            'items' => [
                ['label' => 'Grand livre comptable', 'retention' => '10 ans', 'sorting' => 'Chrono / par compte'],
                ['label' => 'Journal comptable général (journalier)', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Balance générale mensuelle', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Rapport du Commissaire aux Comptes (CAC)', 'retention' => 'Permanent', 'sorting' => 'Chrono'],
                ['label' => 'Pièces comptables justificatives (factures, reçus)', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Fichier des immobilisations (amortissements)', 'retention' => 'Durée vie + 10', 'sorting' => 'Par catégorie'],
                ['label' => 'Plan de trésorererie prévisionnel', 'retention' => '5 ans', 'sorting' => 'Chrono'],
            ]
        ],
        'it' => [
            'name' => 'Informatique & SI',
            'items' => [
                ['label' => 'Inventaire du matériel informatique (parc machines)', 'retention' => 'Durée vie + 5', 'sorting' => 'Par type'],
                ['label' => 'Schéma d\'architecture réseau (topologie)', 'retention' => 'MAJ permanente', 'sorting' => 'Thématique'],
                ['label' => 'Fiches techniques des équipements (serveurs, switchs)', 'retention' => 'Durée vie', 'sorting' => 'Par équipement'],
                ['label' => 'Contrats de maintenance matérielle', 'retention' => 'Durée contrat + 5', 'sorting' => 'Chrono'],
                ['label' => 'Licences logicielles (contrats, clés)', 'retention' => 'Durée + 5', 'sorting' => 'Par logiciel'],
                ['label' => 'Documentation technique des applications', 'retention' => 'MAJ permanente', 'sorting' => 'Par application'],
                ['label' => 'Procédures de déploiement et de mise à jour', 'retention' => 'MAJ permanente', 'sorting' => 'Thématique'],
            ]
        ],
        'marketing' => [
            'name' => 'Marketing & Opérations',
            'items' => [
                ['label' => 'Fiche d\'adhésion membre / sociétaire', 'retention' => 'Permanent', 'sorting' => 'Alphab.'],
                ['label' => 'Copie pièce d\'identité et justificatif domicile (KYC)', 'retention' => '10 ans', 'sorting' => 'Num. par membre'],
                ['label' => 'Contrat d\'ouverture de compte épargne', 'retention' => '10 ans après clôture', 'sorting' => 'Num. + Alphab.'],
                ['label' => 'Contrat de dépôt à terme (DAT)', 'retention' => '10 ans après fin', 'sorting' => 'Chrono'],
                ['label' => 'Fiche de signature / spécimen de signature', 'retention' => 'MAJ permanente', 'sorting' => 'Alphab.'],
                ['label' => 'Dossier de clôture de compte', 'retention' => '10 ans', 'sorting' => 'Chrono'],
                ['label' => 'Fiches / bons de dépôt (épargne)', 'retention' => '10 ans', 'sorting' => 'Chrono journalier'],
            ]
        ],
    ]
];
