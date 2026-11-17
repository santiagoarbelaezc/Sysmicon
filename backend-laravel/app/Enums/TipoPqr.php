<?php

namespace App\Enums;

enum TipoPqr: string
{
    case Peticion = 'peticion';
    case Queja = 'queja';
    case Reclamo = 'reclamo';
    case Sugerencia = 'sugerencia';
}

