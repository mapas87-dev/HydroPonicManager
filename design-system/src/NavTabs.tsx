import * as React from 'react';
import { cx } from './cx';

export interface NavTabItem { id: string; label: React.ReactNode }

export interface NavTabsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Sezioni dell'app. */
  items: NavTabItem[];
  /** id della sezione attiva. */
  value: string;
  /** Chiamata con l'id della sezione toccata. */
  onChange?: (id: string) => void;
}

/** Navigazione principale a pillole, scorrevole in orizzontale. Una sola sezione attiva (pieno verde). */
export function NavTabs({ items, value, onChange, className, ...rest }: NavTabsProps) {
  return (
    <nav className={cx('hp-nav', className)} {...rest}>
      {items.map(it => (
        <button key={it.id} type="button" aria-current={it.id === value ? 'page' : undefined}
          className={cx('hp-nav__item', it.id === value && 'hp-nav__item--on')} onClick={() => onChange?.(it.id)}>
          {it.label}
        </button>
      ))}
    </nav>
  );
}
