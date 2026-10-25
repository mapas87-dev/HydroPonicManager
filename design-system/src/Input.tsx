import * as React from 'react';
import { cx } from './cx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/** Campo di testo, numero, data o ora a tutta larghezza. Usalo dentro Field. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cx('hp-input', className)} {...rest} />;
});

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Opzioni semplici; in alternativa passa <option>/<optgroup> come children. */
  options?: Array<string | { value: string; label: string }>;
  children?: React.ReactNode;
}

/** Menu a tendina a tutta larghezza. Usalo dentro Field. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select({ options, className, children, ...rest }, ref) {
  return (
    <select ref={ref} className={cx('hp-input', className)} {...rest}>
      {options?.map(o => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>)}
      {children}
    </select>
  );
});
