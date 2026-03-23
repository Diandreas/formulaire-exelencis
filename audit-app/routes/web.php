<?php

use App\Http\Controllers\AuditController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuditController::class, 'index'])->name('audits.index');

// Formulary routes
Route::get('/audit/{department}', [AuditController::class, 'show'])->name('audits.show');
Route::post('/audit', [AuditController::class, 'store'])->name('audits.store');
Route::get('/audit/view/{auditSubmission}', [AuditController::class, 'view'])->name('audits.view');

// Export route
Route::get('/export', [AuditController::class, 'export'])->name('audits.export');

// Default fallback to index
Route::fallback(fn() => redirect()->route('audits.index'));
