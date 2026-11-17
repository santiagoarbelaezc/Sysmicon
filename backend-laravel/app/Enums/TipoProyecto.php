<?php

namespace App\Enums;

enum TipoProyecto: string
{
    case Vivienda = 'vivienda';
    case Remodelacion = 'remodelacion';
    case Comercial = 'comercial';
    case Otro = 'otro';
}

