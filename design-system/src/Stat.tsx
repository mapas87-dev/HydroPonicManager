import * as React from 'react';
import { cx } from './cx';

export interface StatProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Il numero, già formattato (es. "54,0"). */
  value: React.ReactNode;
  /** Unità di misura (es. "mL"). */
  unit?: React.ReactNode;
  /** warn = arancione (predefinito, risultati dei calcoli), accent = verde. */
  tone?: 'warn' | 'accent';
}

/** Numero grande per il risultato di un calcolo (dose, EC). Spesso usato come value di KeyValue. */
export function Stat({ value, unit, tone = 'warn', className, ...rest }: StatProps) {
  return (
    <span className={cx('hp-stat', tone === 'accent' && 'hp-stat--accent', className)} {...rest}>
      {value}{unit != null && <span className="hp-stat__unit">{unit}</span>}
    </span>
  );
}
