import * as React from 'react';
import { cx } from './cx';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Etichetta grigia sopra il controllo. */
  label: React.ReactNode;
  /** id del controllo, collega l'etichetta. */
  htmlFor?: string;
  /** Nota piccola sotto il controllo. */
  hint?: React.ReactNode;
  /** Il controllo: Input o Select. */
  children?: React.ReactNode;
}

/** Etichetta + controllo di un modulo. */
export function Field({ label, htmlFor, hint, className, children, ...rest }: FieldProps) {
  return (
    <div className={cx('hp-field', className)} {...rest}>
      <label className="hp-field__label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint != null && <div className="hp-field__hint">{hint}</div>}
    </div>
  );
}

export interface FieldGridProps extends React.HTMLAttributes<HTMLDivElement> { children?: React.ReactNode }

/** Griglia a due colonne per campi affiancati (es. litri e fase). */
export function FieldGrid({ className, ...rest }: FieldGridProps) {
  return <div className={cx('hp-grid2', className)} {...rest} />;
}
