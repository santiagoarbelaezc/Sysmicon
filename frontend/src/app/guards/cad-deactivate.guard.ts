import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { CreaTuDisenoComponent } from '../pages/crea-tu-diseno/crea-tu-diseno.component';

export const cadDeactivateGuard: CanDeactivateFn<CreaTuDisenoComponent> = (component) => {
  // Si no hay elementos en el lienzo o el formulario ya fue enviado, permitir la navegación libre
  if (component.elementosLienzo().length === 0 || component.isSubmitted()) {
    return true;
  }

  // Mostrar el modal personalizado de confirmación de salida
  // Construimos una Promise que resolverá cuando el usuario decida en el modal
  return new Promise<boolean>((resolve) => {
    component.mostrarModalSalida.set(true);

    // Sobrescribimos temporalmente los métodos del modal para resolver la Promise
    const originalConfirmar = component.confirmarSalida.bind(component);
    const originalCancelar = component.cancelarSalida.bind(component);

    component.confirmarSalida = () => {
      originalConfirmar();
      resolve(true);
      // Restaurar referencias originales
      component.confirmarSalida = originalConfirmar;
      component.cancelarSalida = originalCancelar;
    };

    component.cancelarSalida = () => {
      originalCancelar();
      resolve(false);
      // Restaurar referencias originales
      component.confirmarSalida = originalConfirmar;
      component.cancelarSalida = originalCancelar;
    };
  });
};
