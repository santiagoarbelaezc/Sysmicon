<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'page_views';

    protected $fillable = ['pagina', 'dispositivo', 'referrer', 'ip_hash'];
}
