import * as React from 'react';
import { cx } from './cx';

export interface KeyValueProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nome della grandezza, in grigio a sinistra. */
  label: React.ReactNode;
  /** Valore in grassetto a destra. */
  value: React.ReactNode;
  /** Nota piccola sotto il valore. */
  note?: React.ReactNode;
}

/** Riga etichetta/valore separata da una linea. Impila più KeyValue dentro una Card. */
export function KeyValue({ label, value, note, className, ...rest }: KeyValueProps) {
  return (
    <div className={cx('hp-kv', className)} {...rest}>
      <span className="hp-kv__k">{label}</span>
      <span className="hp-kv__v">{value}{note != null && <span className="hp-kv__note">{note}</span>}</span>
    </div>
  );
}
