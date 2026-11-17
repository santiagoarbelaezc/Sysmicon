<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cuentas_clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->string('email')->unique();
            $table->string('telefono', 30)->nullable();
            $table->string('password');
            $table->timestamp('email_verificado_at')->nullable();
            $table->boolean('acepta_novedades')->default(true);
            $table->timestamp('consentimiento_datos_at')->nullable();
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->nullOnDelete();
            $table->boolean('activo')->default(true);
            $table->unsignedTinyInteger('intentos_fallidos')->default(0);
            $table->unsignedTinyInteger('nivel_bloqueo')->default(0);
            $table->timestamp('bloqueado_hasta')->nullable();
            $table->timestamps();
        });

        Schema::create('novedades_proyecto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->cascadeOnDelete();
            $table->string('titulo', 180);
            $table->text('contenido');
            $table->boolean('publicada')->default(false);
            $table->timestamp('publicada_at')->nullable();
            $table->foreignId('autor_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_completo', 120);
            $table->string('correo');
            $table->string('telefono', 30)->nullable();
            $table->string('tipo_servicio', 40)->default('diseno_construccion_integral');
            $table->text('detalles');
            $table->string('estado', 15)->default('nuevo')->index();
            $table->foreignId('convertido_cliente_id')->nullable()->constrained('clientes')->nullOnDelete();
            $table->string('ip_hash', 64)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->boolean('consentimiento_datos')->default(false);
            $table->timestamp('leido_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('pqr', function (Blueprint $table) {
            $table->id();
            $table->string('radicado', 20)->unique();
            $table->string('tipo', 15);
            $table->string('nombre_completo', 120);
            $table->string('correo');
            $table->string('telefono', 30)->nullable();
            $table->string('asunto', 180);
            $table->text('descripcion');
            $table->string('estado', 15)->default('radicado')->index();
            $table->text('respuesta')->nullable();
            $table->foreignId('respondido_por')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamp('respondido_at')->nullable();
            $table->date('fecha_limite_respuesta')->nullable();
            $table->foreignId('cuenta_cliente_id')->nullable()->constrained('cuentas_clientes')->nullOnDelete();
            $table->boolean('consentimiento_datos')->default(false);
            $table->timestamps();
        });

        Schema::create('portafolio_proyectos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 180);
            $table->text('descripcion')->nullable();
            $table->string('categoria', 60)->nullable()->index();
            $table->string('ubicacion', 120)->nullable();
            $table->boolean('activo')->default(true);
            $table->unsignedInteger('orden')->default(0);
            $table->timestamps();
        });

        Schema::create('portafolio_imagenes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portafolio_proyecto_id')->constrained('portafolio_proyectos')->cascadeOnDelete();
            $table->string('url');
            $table->string('public_id')->nullable();
            $table->unsignedInteger('orden')->default(0);
            $table->timestamps();
        });

        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('pagina', 255)->index();
            $table->string('dispositivo', 20)->nullable();
            $table->string('referrer', 255)->nullable();
            $table->string('ip_hash', 64)->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });

        Schema::create('site_config', function (Blueprint $table) {
            $table->id();
            $table->string('clave', 100)->unique();
            $table->json('valor')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['site_config', 'page_views', 'portafolio_imagenes', 'portafolio_proyectos', 'pqr', 'mensajes', 'novedades_proyecto', 'cuentas_clientes'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
