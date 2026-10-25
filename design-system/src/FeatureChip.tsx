import * as React from 'react';
import { cx } from './cx';

export interface FeatureChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Emoji o icona nel cerchio. */
  icon: React.ReactNode;
  children?: React.ReactNode;
}

/** Etichetta con icona tonda, per i punti di forza sotto il titolo. Raggruppale in FeatureChips. */
export function FeatureChip({ icon, className, children, ...rest }: FeatureChipProps) {
  return (
    <span className={cx('hp-chip', className)} {...rest}>
      <i className="hp-chip__icon">{icon}</i>{children}
    </span>
  );
}

export interface FeatureChipsProps extends React.HTMLAttributes<HTMLDivElement> { children?: React.ReactNode }

/** Riga di FeatureChip che va a capo. */
export function FeatureChips({ className, ...rest }: FeatureChipsProps) {
  return <div className={cx('hp-chips', className)} {...rest} />;
}
