<?php

use App\Http\Controllers\AuditController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AuditController::class, 'index'])->name('audits.index');

// Formulary routes
Route::get('/audit/{department}', [AuditController::class, 'show'])->name('audits.show');
Route::post('/audit', [AuditController::class, 'store'])->name('audits.store');
Route::get('/audit/view/{auditSubmission}', [AuditController::class, 'view'])->name('audits.view');

// Export routes
Route::get('/export-page', [AuditController::class, 'exportPage'])->name('audits.export-page');
Route::get('/download-pdf', [AuditController::class, 'downloadPdf'])
    ->name('audits.download')
    ->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class]);
Route::get('/export', [AuditController::class, 'export'])
    ->name('audits.export')
    ->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class]);

// Default fallback to index
Route::fallback(fn() => redirect()->route('audits.index'));
