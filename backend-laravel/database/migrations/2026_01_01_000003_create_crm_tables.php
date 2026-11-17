<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('tipo', 10)->default('persona');
            $table->string('nombre', 150);
            $table->string('email')->nullable()->index();
            $table->string('telefono', 30)->nullable();
            $table->string('direccion')->nullable();
            $table->string('ciudad', 80)->nullable()->index();
            $table->string('origen', 20)->default('otro');
            $table->text('notas')->nullable();
            $table->foreignId('responsable_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('contactos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->string('nombre', 120);
            $table->string('cargo', 80)->nullable();
            $table->string('email')->nullable();
            $table->string('telefono', 30)->nullable();
            $table->timestamps();
        });

        Schema::create('oportunidades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->string('titulo', 180);
            $table->string('tipo_proyecto', 20)->default('vivienda');
            $table->string('etapa', 20)->default('contacto');
            $table->decimal('valor_estimado', 14, 2)->default(0);
            $table->unsignedTinyInteger('probabilidad')->default(10);
            $table->date('fecha_cierre_estimada')->nullable();
            $table->text('motivo_perdida')->nullable();
            $table->unsignedInteger('orden')->default(0);
            $table->foreignId('responsable_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['etapa', 'orden']);
        });

        Schema::create('propuestas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('oportunidad_id')->constrained('oportunidades')->cascadeOnDelete();
            $table->string('numero', 30)->unique();
            $table->date('fecha_envio')->nullable();
            $table->decimal('valor', 14, 2)->default(0);
            $table->string('estado', 15)->default('borrador');
            $table->string('archivo_url')->nullable();
            $table->timestamps();
        });

        Schema::create('proyectos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignId('oportunidad_id')->nullable()->unique()->constrained('oportunidades')->nullOnDelete();
            $table->string('nombre', 180);
            $table->string('direccion_obra')->nullable();
            $table->string('fase', 15)->default('diseno');
            $table->string('estado', 15)->default('activo')->index();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin_estimada')->nullable();
            $table->decimal('presupuesto', 14, 2)->default(0);
            $table->foreignId('responsable_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('hitos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->cascadeOnDelete();
            $table->string('nombre', 150);
            $table->date('fecha_limite')->nullable();
            $table->boolean('completado')->default(false);
            $table->timestamp('completado_at')->nullable();
            $table->timestamps();
        });

        Schema::create('tareas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 180);
            $table->text('descripcion')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->boolean('completada')->default(false);
            $table->timestamp('completada_at')->nullable();
            $table->foreignId('asignado_a')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->nullOnDelete();
            $table->foreignId('oportunidad_id')->nullable()->constrained('oportunidades')->nullOnDelete();
            $table->foreignId('proyecto_id')->nullable()->constrained('proyectos')->nullOnDelete();
            $table->timestamps();
            $table->index(['asignado_a', 'completada', 'fecha_vencimiento']);
        });

        Schema::create('actividades', function (Blueprint $table) {
            $table->id();
            $table->string('tipo', 15)->default('nota');
            $table->text('descripcion');
            $table->dateTime('fecha');
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->nullOnDelete();
            $table->foreignId('oportunidad_id')->nullable()->constrained('oportunidades')->nullOnDelete();
            $table->foreignId('proyecto_id')->nullable()->constrained('proyectos')->nullOnDelete();
            $table->timestamps();
            $table->index('fecha');
        });
    }

    public function down(): void
    {
        foreach (['actividades', 'tareas', 'hitos', 'proyectos', 'propuestas', 'oportunidades', 'contactos', 'clientes'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
