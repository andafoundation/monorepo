import type { And } from './types';

/** The name an oath goes by: its title, else its version label, else its ISO date; null when it has none. */
export function oathLabel(oath: Pick<And, 'title' | 'version' | 'date'>): string | null {
  return oath.title ?? oath.version ?? oath.date;
}
