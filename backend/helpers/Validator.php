<?php
/**
 * Sysmicon Backend — Helper de Validación
 */

declare(strict_types=1);

class Validator
{
    private array $data;
    private array $errors = [];

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public static function make(array $data, array $rules): self
    {
        $v = new self($data);
        foreach ($rules as $field => $ruleStr) {
            $fieldRules = explode('|', $ruleStr);
            foreach ($fieldRules as $rule) {
                $v->applyRule($field, $rule);
            }
        }
        return $v;
    }

    private function applyRule(string $field, string $rule): void
    {
        $value = $this->data[$field] ?? null;

        if ($rule === 'required') {
            if ($value === null || $value === '' || (is_string($value) && trim($value) === '')) {
                $this->errors[$field][] = "El campo '{$field}' es obligatorio.";
            }
            return;
        }

        // Si no es requerido y está vacío, saltar las otras validaciones
        if ($value === null || $value === '') {
            return;
        }

        if ($rule === 'email') {
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $this->errors[$field][] = "El campo '{$field}' debe ser un email válido.";
            }
        }

        if (str_starts_with($rule, 'min:')) {
            $min = (int) substr($rule, 4);
            if (strlen((string)$value) < $min) {
                $this->errors[$field][] = "El campo '{$field}' debe tener al menos {$min} caracteres.";
            }
        }

        if (str_starts_with($rule, 'max:')) {
            $max = (int) substr($rule, 4);
            if (strlen((string)$value) > $max) {
                $this->errors[$field][] = "El campo '{$field}' no puede superar {$max} caracteres.";
            }
        }

        if ($rule === 'numeric') {
            if (!is_numeric($value)) {
                $this->errors[$field][] = "El campo '{$field}' debe ser numérico.";
            }
        }

        if (str_starts_with($rule, 'in:')) {
            $options = explode(',', substr($rule, 3));
            if (!in_array($value, $options, true)) {
                $this->errors[$field][] = "El campo '{$field}' tiene un valor no permitido.";
            }
        }
    }

    public function fails(): bool
    {
        return !empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function validated(): array
    {
        return $this->data;
    }

    public static function sanitizeString(mixed $value): string
    {
        return htmlspecialchars(strip_tags(trim((string)$value)), ENT_QUOTES, 'UTF-8');
    }
}
