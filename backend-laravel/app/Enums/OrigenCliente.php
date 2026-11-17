<?php

namespace App\Enums;

enum OrigenCliente: string
{
    case Referido = 'referido';
    case Web = 'web';
    case Redes = 'redes';
    case Otro = 'otro';
}

