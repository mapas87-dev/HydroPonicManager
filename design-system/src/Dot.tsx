import * as React from 'react';
import { cx } from './cx';

export interface DotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Colore del pallino: un valore CSS, di solito var(--hp-cat-N) o var(--hp-level-*). */
  color: string;
}

/** Pallino colorato che identifica una fila, una coltura o un livello della torre. */
export function Dot({ color, className, style, ...rest }: DotProps) {
  return <span aria-hidden="true" className={cx('hp-dot', className)} style={{ background: color, ...style }} {...rest} />;
}
