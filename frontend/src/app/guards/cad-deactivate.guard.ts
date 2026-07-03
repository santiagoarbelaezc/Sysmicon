import { CanDeactivateFn } from '@angular/router';
import { CreaTuDisenoComponent } from '../pages/crea-tu-diseno/crea-tu-diseno.component';

export const cadDeactivateGuard: CanDeactivateFn<CreaTuDisenoComponent> = () => {
  return true;
};

