import * as React from 'react';
import { cx } from './cx';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Titolo della card. */
  title?: React.ReactNode;
  /** Numero del passo mostrato in un cerchio arancione prima del titolo (es. 1, 2). */
  step?: number;
  /** Bordo arancione e titolo su etichetta arancione: per i calcolatori principali. */
  highlight?: boolean;
  /** Testo descrittivo grigio sotto il titolo. */
  description?: React.ReactNode;
  children?: React.ReactNode;
}

/** Riquadro di contenuto con titolo opzionale. È il blocco base di ogni sezione. */
export function Card({ title, step, highlight, description, className, children, ...rest }: CardProps) {
  return (
    <div className={cx('hp-card', highlight && 'hp-card--highlight', className)} {...rest}>
      {title != null && (
        <h2 className="hp-card__title">
          {step != null && !highlight && <span className="hp-card__step">{step}</span>}
          {title}
        </h2>
      )}
      {description != null && <p className="hp-card__desc">{description}</p>}
      {children}
    </div>
  );
}
