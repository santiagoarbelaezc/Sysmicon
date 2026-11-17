<?php

namespace App\Enums;

enum EstadoProyecto: string
{
    case Activo = 'activo';
    case Pausado = 'pausado';
    case Terminado = 'terminado';
}

