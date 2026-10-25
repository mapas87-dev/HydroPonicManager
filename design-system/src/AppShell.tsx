import * as React from 'react';
import { cx } from './cx';

export interface AppShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Titolo dell'app, in alto. */
  title?: React.ReactNode;
  /** Sottotitolo verde sotto il titolo. */
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

/** Contenitore radice dell'app: sfondo, font Poppins, margini laterali e titolo. Avvolgi ogni schermata in AppShell. */
export function AppShell({ title, subtitle, className, children, ...rest }: AppShellProps) {
  return (
    <div className={cx('hp-app', className)} {...rest}>
      {title != null && <h1 className="hp-title">{title}</h1>}
      {subtitle != null && <p className="hp-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}
