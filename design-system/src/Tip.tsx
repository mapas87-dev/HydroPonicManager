import * as React from 'react';
import { cx } from './cx';

export interface TipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** info = verde (consiglio), warning = arancione (incompatibilità o attenzione). */
  tone?: 'info' | 'warning';
  children?: React.ReactNode;
}

/** Riquadro di consiglio con barra colorata a sinistra. */
export function Tip({ tone = 'info', className, ...rest }: TipProps) {
  return <div role={tone === 'warning' ? 'note' : undefined} className={cx('hp-tip', tone === 'warning' && 'hp-tip--warning', className)} {...rest} />;
}
