<?php

namespace App\Enums;

enum TipoActividad: string
{
    case Llamada = 'llamada';
    case Reunion = 'reunion';
    case Email = 'email';
    case Nota = 'nota';
    case Visita = 'visita';
}

