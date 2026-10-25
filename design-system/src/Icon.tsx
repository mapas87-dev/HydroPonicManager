import * as React from 'react';
import { cx } from './cx';

const PATHS = {
  drop: <><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></>,
  sprout: <><path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" /></>,
  home: <><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
  leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>,
  book: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></>,
  cycle: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>,
  flask: <><path d="M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.5a1 1 0 0 0 .9 1.5h12.8a1 1 0 0 0 .9-1.5l-5.1-10.1a2 2 0 0 1-.2-.9V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></>,
  zap: <><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></>,
  gauge: <><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>,
  tower: <><rect x="8" y="3" width="8" height="15" rx="3" /><path d="M5 21h14" /><path d="M12 18v3" /><circle cx="12" cy="8" r="1.3" /><circle cx="12" cy="13" r="1.3" /></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
  alert: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
} satisfies Record<string, React.ReactNode>;

/** Nomi delle icone disponibili (le stesse dell'app). */
export type IconName = keyof typeof PATHS;
export const iconNames = Object.keys(PATHS) as IconName[];

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  /** drop (acqua), sprout (semina), home, leaf (crescita), book (piante), cycle (ricambio), flask (nutrienti), zap (EC), gauge (pH), bell (avvisi), tower (torre), alert (attenzione). */
  name: IconName;
  /** Lato in px (predefinito 20). */
  size?: number;
  /** Testo per i lettori di schermo; senza, l'icona è decorativa. */
  label?: string;
}

/** Icona a tratto in stile Lucide, colorata con currentColor. */
export function Icon({ name, size = 20, label, className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={cx('hp-icon', className)}
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...rest}>
      {PATHS[name]}
    </svg>
  );
}
