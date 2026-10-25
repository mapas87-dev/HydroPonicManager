import * as React from 'react';
import { cx } from './cx';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Testo accanto alla casella. */
  label: React.ReactNode;
}

/** Casella di spunta grande con etichetta, per attivare un'impostazione. */
export function Toggle({ label, className, ...rest }: ToggleProps) {
  return (
    <label className={cx('hp-toggle', className)}>
      <input type="checkbox" {...rest} />
      {label}
    </label>
  );
}
