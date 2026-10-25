import * as React from 'react';
import { cx } from './cx';
import { Icon, IconName } from './Icon';

export interface NavTabItem { id: string; label: React.ReactNode; icon?: IconName }

export interface NavTabsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Schede della sezione (es. Nutrienti, EC, pH-), con icona facoltativa. */
  items: NavTabItem[];
  /** id della scheda attiva. */
  value: string;
  /** Chiamata con l'id della scheda toccata. */
  onChange?: (id: string) => void;
}

/** Schede a pillola in alto, scorrevoli in orizzontale: le sotto-schede della sezione scelta in BottomNav. */
export function NavTabs({ items, value, onChange, className, ...rest }: NavTabsProps) {
  return (
    <nav className={cx('hp-nav', className)} {...rest}>
      {items.map(it => (
        <button key={it.id} type="button" aria-current={it.id === value ? 'page' : undefined}
          className={cx('hp-nav__item', it.id === value && 'hp-nav__item--on')} onClick={() => onChange?.(it.id)}>
          {it.icon && <Icon name={it.icon} />}
          {it.label}
        </button>
      ))}
    </nav>
  );
}
