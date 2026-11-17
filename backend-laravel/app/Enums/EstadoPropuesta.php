<?php

namespace App\Enums;

enum EstadoPropuesta: string
{
    case Borrador = 'borrador';
    case Enviada = 'enviada';
    case Aceptada = 'aceptada';
    case Rechazada = 'rechazada';
}

