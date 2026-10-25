import * as React from 'react';
import { cx } from './cx';
import { Icon, IconName } from './Icon';

export interface BottomNavItem { id: string; label: string; icon: IconName }

export interface BottomNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 3–5 sezioni principali dell'app. */
  items: BottomNavItem[];
  /** id della sezione attiva. */
  value: string;
  onChange?: (id: string) => void;
  /** Non fissata in basso: per anteprime o per inserirla in un layout. */
  inline?: boolean;
}

/** Barra di navigazione fissa in basso con icona ed etichetta. Usala con <AppShell withBottomNav>, che lascia lo spazio sotto il contenuto. */
export function BottomNav({ items, value, onChange, inline, className, ...rest }: BottomNavProps) {
  return (
    <nav aria-label="Sezioni" className={cx('hp-bottom', inline && 'hp-bottom--static', className)} {...rest}>
      {items.map(it => (
        <button key={it.id} type="button" aria-current={it.id === value ? 'page' : undefined}
          className={cx('hp-bottom__item', it.id === value && 'hp-bottom__item--on')} onClick={() => onChange?.(it.id)}>
          <Icon name={it.icon} />
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
