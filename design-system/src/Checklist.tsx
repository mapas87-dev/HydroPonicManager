import * as React from 'react';
import { cx } from './cx';

export interface ChecklistItem { id: string; label: React.ReactNode; done?: boolean }

export interface ChecklistProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onChange'> {
  items: ChecklistItem[];
  /** Chiamata quando una voce viene spuntata o tolta. */
  onChange?: (id: string, done: boolean) => void;
}

/** Elenco di passaggi da spuntare; le voci fatte appaiono barrate. */
export function Checklist({ items, onChange, className, ...rest }: ChecklistProps) {
  const uid = React.useId();
  return (
    <ul className={cx('hp-checklist', className)} {...rest}>
      {items.map(it => {
        const id = `${uid}-${it.id}`;
        return (
          <li key={it.id}>
            <input type="checkbox" id={id} checked={!!it.done} onChange={e => onChange?.(it.id, e.target.checked)} readOnly={!onChange} />
            <label htmlFor={id}>{it.label}</label>
          </li>
        );
      })}
    </ul>
  );
}
