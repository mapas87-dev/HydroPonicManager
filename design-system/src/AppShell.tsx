import * as React from 'react';
import { cx } from './cx';

export interface AppShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Titolo dell'app: con il titolo compare l'intestazione verde con le foglie. */
  title?: React.ReactNode;
  /** Sottotitolo sotto il titolo. */
  subtitle?: React.ReactNode;
  /** Contenuto in fondo all'intestazione, di solito <FeatureChips>. */
  badges?: React.ReactNode;
  /** Lascia spazio in fondo per <BottomNav>. */
  withBottomNav?: boolean;
  children?: React.ReactNode;
}

/** Contenitore radice dell'app: sfondo crema, font Raleway, margini laterali e intestazione verde. Avvolgi ogni schermata in AppShell. */
export function AppShell({ title, subtitle, badges, withBottomNav, className, children, ...rest }: AppShellProps) {
  return (
    <div className={cx('hp-app', withBottomNav && 'hp-app--with-bar', className)} {...rest}>
      {title != null && (
        <header className="hp-hero">
          <svg className="hp-hero__blob" viewBox="0 0 200 200" aria-hidden="true"><path transform="translate(100 100)" d="M45.7-62.1C58.6-52.7 68-38.2 72.8-22.2 77.6-6.2 77.8 11.3 70.9 25.1 64 38.9 50 49 35 57.6 20 66.2 4 73.3-13.4 73.1-30.8 72.9-49.6 65.4-61.5 51.8-73.4 38.2-78.4 18.5-77.1-.4-75.8-19.3-68.2-37.4-55.7-47.1-43.2-56.8-25.8-58.1-9.3-57.3 7.2-56.5 32.8-71.5 45.7-62.1Z" /></svg>
          <svg className="hp-hero__leaf" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /></svg>
          <h1 className="hp-title">{title}</h1>
          {subtitle != null && <p className="hp-subtitle">{subtitle}</p>}
          {badges}
        </header>
      )}
      {children}
    </div>
  );
}
