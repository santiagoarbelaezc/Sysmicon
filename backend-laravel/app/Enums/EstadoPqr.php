<?php

namespace App\Enums;

enum EstadoPqr: string
{
    case Radicado = 'radicado';
    case EnTramite = 'en_tramite';
    case Respondido = 'respondido';
    case Cerrado = 'cerrado';
}

