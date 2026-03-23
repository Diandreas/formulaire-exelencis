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
        Schema::create('audit_submissions', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $blueprint->string('department'); // audit, compliance, credit, daf, it, marketing
            $blueprint->string('reference')->nullable();
            $blueprint->string('interviewee_name')->nullable();
            $blueprint->string('interviewee_role')->nullable();
            $blueprint->date('date_interview')->nullable();
            $blueprint->json('data')->nullable(); // Questions and responses
            $blueprint->decimal('score', 5, 2)->default(0);
            $blueprint->timestamps();
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
