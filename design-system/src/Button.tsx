import * as React from 'react';
import { cx } from './cx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = pieno verde, outline = bordo verde (predefinito), danger = bordo arancione per azioni distruttive. */
  variant?: 'primary' | 'outline' | 'danger';
  /** Occupa tutta la larghezza, testo più grande. */
  block?: boolean;
  children?: React.ReactNode;
}

/** Pulsante d'azione. */
export function Button({ variant = 'outline', block, className, type = 'button', children, ...rest }: ButtonProps) {
  return (
    <button type={type} className={cx('hp-btn', variant === 'primary' && 'hp-btn--primary', variant === 'danger' && 'hp-btn--danger', block && 'hp-btn--block', className)} {...rest}>
      {children}
    </button>
  );
}

export interface ButtonRowProps extends React.HTMLAttributes<HTMLDivElement> { children?: React.ReactNode }

/** Riga di pulsanti affiancati che va a capo su schermi stretti. */
export function ButtonRow({ className, ...rest }: ButtonRowProps) {
  return <div className={cx('hp-btn-row', className)} {...rest} />;
}
