/**
 * Transforma URLs de Cloudinary aplicando optimización automática de formato (f_auto),
 * compresión inteligente (q_auto) y redimensionamiento dinámico (w_{width}).
 */
export function optimizedImage(url: string | undefined | null, width: number = 800, quality: string = 'auto'): string {
  if (!url || typeof url !== 'string') return url || '';

  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
      return url;
    }
    const params = `f_auto,q_${quality},w_${width}`;
    return url.replace('/upload/', `/upload/${params}/`);
  }

  return url;
}
