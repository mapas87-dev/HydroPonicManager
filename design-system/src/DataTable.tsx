import * as React from 'react';
import { cx } from './cx';

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Intestazioni delle colonne. La prima colonna è allineata a sinistra, le altre a destra. */
  columns: React.ReactNode[];
  /** Righe di celle. */
  rows: React.ReactNode[][];
  /** Indice della riga da evidenziare (es. la fase o la temperatura attuale). */
  highlightRow?: number;
}

/** Tabella numerica compatta con scorrimento orizzontale. */
export function DataTable({ columns, rows, highlightRow, className, ...rest }: DataTableProps) {
  return (
    <div className={cx('hp-table-wrap', className)} {...rest}>
      <table className="hp-table">
        <thead><tr>{columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className={i === highlightRow ? 'hp-table__hl' : undefined}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
