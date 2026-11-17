<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    public $timestamps = false;

    protected $table = 'page_views';

    protected $fillable = ['pagina', 'dispositivo', 'referrer', 'ip_hash'];
}
