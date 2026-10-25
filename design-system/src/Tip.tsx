import * as React from 'react';
import { cx } from './cx';
import { Icon } from './Icon';

export interface TipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** info = verde con foglia (consiglio), warning = terracotta con triangolo (incompatibilità o attenzione). */
  tone?: 'info' | 'warning';
  children?: React.ReactNode;
}

/** Riquadro di consiglio con icona. */
export function Tip({ tone = 'info', className, children, ...rest }: TipProps) {
  return (
    <div role={tone === 'warning' ? 'note' : undefined} className={cx('hp-tip', tone === 'warning' && 'hp-tip--warning', className)} {...rest}>
      <Icon name={tone === 'warning' ? 'alert' : 'leaf'} />
      <div>{children}</div>
    </div>
  );
}
