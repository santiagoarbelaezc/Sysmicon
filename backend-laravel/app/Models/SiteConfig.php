<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteConfig extends Model
{
    protected $table = 'site_config';

    protected $fillable = ['clave', 'valor'];

    protected function casts(): array
    {
        return ['valor' => 'array'];
    }
}
