<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuditController;

use App\Http\Controllers\ExportController;

Route::get('/', [AuditController::class, 'dashboard'])->name('dashboard');
Route::get('/audit/{department}', [AuditController::class, 'create'])->name('audit.create');
Route::post('/audit/{department}', [AuditController::class, 'store'])->name('audit.store');
Route::get('/export/{submission}', [ExportController::class, 'export'])->name('audit.export');
