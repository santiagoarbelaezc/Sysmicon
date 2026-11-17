<?php

namespace App\Http\Requests\Public;

use App\Enums\TipoPqr;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class PqrPublicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => ['required', new Enum(TipoPqr::class)],
            'nombre_completo' => ['required', 'string', 'min:3', 'max:120'],
            'correo' => ['required', 'string', 'email:rfc', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:30'],
            'asunto' => ['required', 'string', 'min:5', 'max:180'],
            'descripcion' => ['required', 'string', 'min:10', 'max:4000'],
            'consentimiento_datos' => ['nullable', 'boolean'],
        ];
    }
}
