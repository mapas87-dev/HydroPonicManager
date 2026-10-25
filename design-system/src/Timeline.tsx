import * as React from 'react';
import { cx } from './cx';

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> { children?: React.ReactNode }

/** Elenco cronologico di scadenze: contiene TimelineItem. */
export function Timeline({ className, ...rest }: TimelineProps) {
  return <div className={cx('hp-timeline', className)} {...rest} />;
}

export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Data o intervallo, in verde a sinistra (es. "dom 26 ott" o "5 nov → 9 nov"). */
  when: React.ReactNode;
  /** Mostra "oggi" sotto la data. */
  today?: boolean;
  /** Evento passato: sbiadito. */
  past?: boolean;
  /** Descrizione dell'evento. */
  children?: React.ReactNode;
}

/** Una scadenza del calendario: data a sinistra, descrizione a destra. */
export function TimelineItem({ when, today, past, className, children, ...rest }: TimelineItemProps) {
  return (
    <div className={cx('hp-ev', past && 'hp-ev--past', className)} {...rest}>
      <b className="hp-ev__when">{when}{today && <small>oggi</small>}</b>
      <span>{children}</span>
    </div>
  );
}
