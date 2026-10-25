import * as React from 'react';
import { cx } from './cx';
import { Icon, IconName } from './Icon';

export interface FeatureChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Nome di un'icona del sistema (es. "drop", "sprout") o un nodo React. */
  icon: IconName | React.ReactNode;
  children?: React.ReactNode;
}

/** Pillola con icona per i punti di forza: bianca traslucida nell'intestazione di AppShell, verde chiaro altrove. Raggruppale in FeatureChips. */
export function FeatureChip({ icon, className, children, ...rest }: FeatureChipProps) {
  return (
    <span className={cx('hp-chip', className)} {...rest}>
      {typeof icon === 'string' ? <Icon name={icon as IconName} /> : icon}{children}
    </span>
  );
}

export interface FeatureChipsProps extends React.HTMLAttributes<HTMLDivElement> { children?: React.ReactNode }

/** Riga di FeatureChip che va a capo. Passala come `badges` di AppShell. */
export function FeatureChips({ className, ...rest }: FeatureChipsProps) {
  return <div className={cx('hp-chips', className)} {...rest} />;
}
