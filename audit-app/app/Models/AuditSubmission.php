<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditSubmission extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'responses' => 'array',
        'date_entretien' => 'date',
        'duree' => 'decimal:2',
    ];
}
