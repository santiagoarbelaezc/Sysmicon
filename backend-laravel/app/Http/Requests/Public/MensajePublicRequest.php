<?php

namespace App\Http\Requests\Public;

use App\Enums\TipoServicio;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class MensajePublicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_completo' => ['required', 'string', 'min:3', 'max:120'],
            'correo' => ['required', 'string', 'email:rfc', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:30'],
            'tipo_servicio' => ['required', new Enum(TipoServicio::class)],
            'detalles' => ['required', 'string', 'min:10', 'max:3000'],
            'consentimiento_datos' => ['nullable', 'boolean'],
        ];
    }
}
