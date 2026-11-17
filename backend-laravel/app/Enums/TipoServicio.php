<?php

namespace App\Enums;

enum TipoServicio: string
{
    case DisenoConstruccionIntegral = 'diseno_construccion_integral';
    case DisenoArquitectonico = 'diseno_arquitectonico';
    case Remodelacion = 'remodelacion';
    case Interiorismo = 'interiorismo';
    case Otro = 'otro';
}

