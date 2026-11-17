<?php

namespace App\Enums;

enum EtapaOportunidad: string
{
    case Contacto = 'contacto';
    case Visita = 'visita';
    case Propuesta = 'propuesta';
    case Negociacion = 'negociacion';
    case Ganado = 'ganado';
    case Perdido = 'perdido';
}

