<?php

namespace App\Enums;

enum FaseProyecto: string
{
    case Diseno = 'diseno';
    case Licencias = 'licencias';
    case Obra = 'obra';
    case Entregado = 'entregado';
}

