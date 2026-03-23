<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('department'); // audit, conformite, credit, daf, informatique, marketing
            $table->string('reference_mission')->nullable();
            $table->string('version')->default('V 1.0');
            $table->string('responsable_interviewe')->nullable();
            $table->string('fonction')->nullable();
            $table->string('telephone')->nullable();
            $table->string('bureau')->nullable();
            $table->integer('effectif')->nullable();
            $table->integer('agents_formes')->nullable();
            $table->date('date_entretien')->nullable();
            $table->decimal('duree', 8, 2)->nullable();
            $table->string('chef_mission')->nullable();
            $table->string('auditeur')->nullable();
            $table->json('responses')->nullable(); // JSON payload for all 10 sections
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_submissions');
    }
};
