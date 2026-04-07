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
        Schema::create('seats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('seat_category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('section');
            $table->integer('row');
            $table->integer('number');
            $table->enum('status', ['AVAILABLE', 'LOCKED', 'SOLD'])->default('AVAILABLE');
            $table->decimal('x', 10, 2);
            $table->decimal('y', 10, 2);
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};
