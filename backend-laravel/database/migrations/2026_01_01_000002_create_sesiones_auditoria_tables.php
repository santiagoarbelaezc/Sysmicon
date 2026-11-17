<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Se crea después de `clientes` (ver migración crm) para la FK; aquí solo sesiones y auditoría.
        Schema::create('sesiones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('guard', 10)->index();
            $table->unsignedBigInteger('sujeto_id')->index(); // usuarios.id o cuentas_clientes.id según guard
            $table->string('refresh_hash', 64)->unique();
            $table->uuid('familia_id')->index();
            $table->string('ip', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamp('ultimo_uso_at')->nullable();
            $table->timestamp('expira_at'); // absoluta: login + 12h
            $table->timestamp('revocada_at')->nullable();
            $table->uuid('reemplazada_por')->nullable();
            $table->timestamps();
        });

        Schema::create('auditoria_accesos', function (Blueprint $table) {
            $table->id();
            $table->string('guard', 10)->nullable();
            $table->unsignedBigInteger('sujeto_id')->nullable();
            $table->string('email', 255)->nullable();
            $table->string('evento', 40)->index(); // login_ok, login_fallido, logout, bloqueo, reuso_refresh, cambio_password
            $table->string('ip', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditoria_accesos');
        Schema::dropIfExists('sesiones');
    }
};
