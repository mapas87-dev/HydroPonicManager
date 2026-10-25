import * as React from 'react';
import { cx } from './cx';

export interface SegmentedTabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Etichette delle opzioni, a larghezza uguale. */
  options: string[];
  /** Indice dell'opzione selezionata. */
  value: number;
  onChange?: (index: number) => void;
}

/** Selettore a segmenti dentro una card, es. "Serra 1 / Serra 2". */
export function SegmentedTabs({ options, value, onChange, className, ...rest }: SegmentedTabsProps) {
  return (
    <div className={cx('hp-seg', className)} role="tablist" {...rest}>
      {options.map((o, i) => (
        <button key={i} type="button" role="tab" aria-selected={i === value}
          className={cx('hp-seg__item', i === value && 'hp-seg__item--on')} onClick={() => onChange?.(i)}>
          {o}
        </button>
      ))}
    </div>
  );
}
