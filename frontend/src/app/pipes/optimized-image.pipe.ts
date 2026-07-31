import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optimizedImage',
  standalone: true
})
export class OptimizedImagePipe implements PipeTransform {
  /**
   * Transforma URLs de Cloudinary aplicando optimización automática de formato (f_auto),
   * compresión inteligente (q_auto) y redimensionamiento dinámico (w_{width}).
   * 
   * @param url URL original de Cloudinary
   * @param width Ancho deseado en píxeles (por defecto 800px para móvil / tarjetas)
   * @param quality Nivel de calidad ('auto', 'auto:eco', 'auto:good', 'auto:best')
   */
  transform(url: string, width: number = 800, quality: string = 'auto'): string {
    if (!url || typeof url !== 'string') return url;

    // Solo transformar si es una URL de Cloudinary
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      // Previene duplicar transformaciones si ya existen
      if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
        return url;
      }

      // Inyectar parámetros f_auto,q_auto,w_width después de /upload/
      const params = `f_auto,q_${quality},w_${width}`;
      return url.replace('/upload/', `/upload/${params}/`);
    }

    return url;
  }
}
