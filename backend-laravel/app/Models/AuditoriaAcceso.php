<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditoriaAcceso extends Model
{
    public $timestamps = false;

    protected $table = 'auditoria_accesos';

    protected $fillable = ['guard', 'sujeto_id', 'email', 'evento', 'ip', 'user_agent'];
}
