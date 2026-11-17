<?php

namespace App\Enums;

enum EstadoMensaje: string
{
    case Nuevo = 'nuevo';
    case Leido = 'leido';
    case EnGestion = 'en_gestion';
    case Convertido = 'convertido';
    case Archivado = 'archivado';
}

