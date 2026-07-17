import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface SampleRow {
  [key: string]: unknown;
}

interface SampleTable {
  columns: string[];
  types: Record<string, string>;
  rows: SampleRow[];
}

const sampleData: Record<string, SampleTable> = {
  tasks: {
    columns: ['id', 'task', 'status', 'priority', 'assignee', 'created_at'],
    types: { id: 'integer', created_at: 'datetime' },
    rows: [
      { id: 1, task: 'Implement auth middleware', status: 'Done', priority: 'High', assignee: 'Alice', created_at: '2026-06-01T09:15:00Z' },
      { id: 2, task: 'Write API documentation', status: 'In Progress', priority: 'Medium', assignee: 'Bob', created_at: '2026-06-02T14:30:00Z' },
      { id: 3, task: 'Fix login redirect bug', status: 'Done', priority: 'High', assignee: 'Alice', created_at: '2026-06-03T11:00:00Z' },
      { id: 4, task: 'Design dashboard layout', status: 'Pending', priority: 'Low', assignee: 'Carol', created_at: '2026-06-04T08:45:00Z' },
      { id: 5, task: 'Database migration script', status: 'In Progress', priority: 'High', assignee: 'Bob', created_at: '2026-06-05T16:20:00Z' },
      { id: 6, task: 'End-to-end tests', status: 'Pending', priority: 'Medium', assignee: 'Carol', created_at: '2026-06-06T10:00:00Z' },
      { id: 7, task: 'Set up CI/CD pipeline', status: 'Done', priority: 'High', assignee: 'Alice', created_at: '2026-06-07T13:15:00Z' },
      { id: 8, task: 'User research interviews', status: 'In Progress', priority: 'Low', assignee: 'Carol', created_at: '2026-06-08T09:30:00Z' },
      { id: 9, task: 'Performance optimization', status: 'Pending', priority: 'Medium', assignee: 'Bob', created_at: '2026-06-09T15:45:00Z' },
      { id: 10, task: 'Security audit', status: 'Pending', priority: 'High', assignee: 'Alice', created_at: '2026-06-10T07:00:00Z' },
      { id: 11, task: 'Mobile responsive fixes', status: 'In Progress', priority: 'Medium', assignee: 'Carol', created_at: '2026-06-11T12:30:00Z' },
      { id: 12, task: 'API rate limiting', status: 'Done', priority: 'High', assignee: 'Bob', created_at: '2026-06-12T18:00:00Z' },
    ],
  },
  users: {
    columns: ['id', 'name', 'email', 'role', 'active', 'created_at'],
    types: { id: 'integer', active: 'boolean', created_at: 'datetime' },
    rows: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', active: true, created_at: '2026-01-15T08:00:00Z' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', active: true, created_at: '2026-02-20T10:30:00Z' },
      { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Designer', active: true, created_at: '2026-03-10T14:15:00Z' },
      { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: 'Developer', active: false, created_at: '2026-04-05T09:00:00Z' },
      { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Manager', active: true, created_at: '2026-05-01T11:45:00Z' },
    ],
  },
  orders: {
    columns: ['id', 'product', 'amount', 'status', 'customer', 'date'],
    types: { id: 'integer', amount: 'number', date: 'datetime' },
    rows: [
      { id: 101, product: 'Wireless Headphones', amount: 79.99, status: 'Shipped', customer: 'Acme Corp', date: '2026-06-01T10:00:00Z' },
      { id: 102, product: 'USB-C Hub', amount: 34.50, status: 'Processing', customer: 'Globex Inc', date: '2026-06-02T15:30:00Z' },
      { id: 103, product: 'Mechanical Keyboard', amount: 149.00, status: 'Delivered', customer: 'Initech', date: '2026-05-28T12:00:00Z' },
      { id: 104, product: '27" Monitor', amount: 399.99, status: 'Shipped', customer: 'Acme Corp', date: '2026-06-03T09:15:00Z' },
      { id: 105, product: 'Webcam HD', amount: 89.99, status: 'Pending', customer: 'Umbrella Co', date: '2026-06-04T14:45:00Z' },
      { id: 106, product: 'Desk Lamp', amount: 45.00, status: 'Processing', customer: 'Globex Inc', date: '2026-06-05T11:30:00Z' },
      { id: 107, product: 'Ergonomic Chair', amount: 599.00, status: 'Delivered', customer: 'Initech', date: '2026-05-20T08:00:00Z' },
      { id: 108, product: 'Noise Cancelling Earbuds', amount: 199.99, status: 'Shipped', customer: 'Acme Corp', date: '2026-06-06T16:00:00Z' },
    ],
  },
};

const sampleTables = Object.keys(sampleData);
const DATABASE_URL = process.env.DATABASE_URL;

function parseDateSafe(v: unknown): Date | null {
  if (typeof v !== 'string') return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function applyDateFilter(rows: SampleRow[], column: string, dateFrom?: string, dateTo?: string): SampleRow[] {
  let filtered = rows;
  if (dateFrom) {
    const from = new Date(dateFrom);
    if (!isNaN(from.getTime())) filtered = filtered.filter((row) => { const d = parseDateSafe(row[column]); return d && d >= from; });
  }
  if (dateTo) {
    const to = new Date(dateTo);
    if (!isNaN(to.getTime())) filtered = filtered.filter((row) => { const d = parseDateSafe(row[column]); return d && d <= to; });
  }
  return filtered;
}

function applySort(rows: SampleRow[], column: string, dir: 'asc' | 'desc'): SampleRow[] {
  return [...rows].sort((a, b) => {
    const va = a[column];
    const vb = b[column];
    if (va === null || va === undefined) return 1;
    if (vb === null || vb === undefined) return -1;
    const da = parseDateSafe(va);
    const db = parseDateSafe(vb);
    if (da && db) return dir === 'asc' ? da.getTime() - db.getTime() : db.getTime() - da.getTime();
    if (typeof va === 'number' && typeof vb === 'number') return dir === 'asc' ? va - vb : vb - va;
    const sa = String(va);
    const sb = String(vb);
    return dir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
  });
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const table = url.searchParams.get('table');
    const search = url.searchParams.get('search') || undefined;
    const page = url.searchParams.get('page') ? Number(url.searchParams.get('page')) : undefined;
    const pageSize = url.searchParams.get('pageSize') ? Number(url.searchParams.get('pageSize')) : undefined;
    const sort = url.searchParams.get('sort') || undefined;
    const sortDir = url.searchParams.get('sortDir') as 'asc' | 'desc' | undefined;
    const dateColumn = url.searchParams.get('dateColumn') || undefined;
    const dateFrom = url.searchParams.get('dateFrom') || undefined;
    const dateTo = url.searchParams.get('dateTo') || undefined;

    if (DATABASE_URL) {
      try {
        if (!table) {
          const res = await fetch(DATABASE_URL, { signal: AbortSignal.timeout(5000) });
          const body = await res.json();
          let tables: string[] = [];
          if (Array.isArray(body)) tables = body;
          else if (body.tables && Array.isArray(body.tables)) tables = body.tables;
          else if (typeof body === 'object' && body !== null) tables = Object.keys(body);
          return json({ source: 'live', tables });
        }
        const params = new URLSearchParams({ table });
        if (search) params.set('search', search);
        if (page !== undefined) params.set('page', String(page));
        if (pageSize !== undefined) params.set('pageSize', String(pageSize));
        if (sort) params.set('sort', sort);
        if (sortDir) params.set('sortDir', sortDir);
        if (dateColumn) params.set('dateColumn', dateColumn);
        if (dateFrom) params.set('dateFrom', dateFrom);
        if (dateTo) params.set('dateTo', dateTo);
        const res = await fetch(`${DATABASE_URL.replace(/\/+$/, '')}?${params.toString()}`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`Upstream responded with ${res.status}`);
        const data = await res.json();
        if (data.columns && data.rows) {
          return json({ source: 'live', columns: data.columns, types: data.types ?? data.columnTypes ?? {}, rows: data.rows, total: data.total ?? data.rows.length, table });
        }
        if (Array.isArray(data)) {
          const rows = data as SampleRow[];
          const cols = rows.length > 0 ? Object.keys(rows[0]) : [];
          const types: Record<string, string> = {};
          if (rows.length > 0) {
            for (const col of cols) {
              const v = rows[0][col];
              if (typeof v === 'number') types[col] = Number.isInteger(v) ? 'integer' : 'number';
              else if (typeof v === 'boolean') types[col] = 'boolean';
              else if (typeof v === 'string' && !isNaN(Date.parse(v))) types[col] = 'datetime';
              else types[col] = 'string';
            }
          }
          return json({ source: 'live', columns: cols, types, rows, total: rows.length, table });
        }
        return json({ source: 'live', columns: [], types: {}, rows: [], total: 0, table });
      } catch {
        return json({ error: 'Failed to connect to the external database. Check DATABASE_URL.' }, { status: 502 });
      }
    }

    if (!table) return json({ source: 'sample', tables: sampleTables });

    const sample = sampleData[table];
    if (!sample) return json({ error: `Table "${table}" not found` }, { status: 404 });

    let filtered = sample.rows;
    if ((dateFrom || dateTo) && dateColumn) filtered = applyDateFilter(filtered, dateColumn, dateFrom, dateTo);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((row) => Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q)));
    }
    if (sort && sortDir) filtered = applySort(filtered, sort, sortDir);

    const total = filtered.length;
    const safePage = page && page > 0 ? page : 1;
    const safePageSize = pageSize && pageSize > 0 ? pageSize : 50;
    const start = (safePage - 1) * safePageSize;
    const paged = filtered.slice(start, start + safePageSize);

    return json({ source: 'sample', columns: sample.columns, types: sample.types, rows: paged, total, table });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return json({ error: message }, { status: 500 });
  }
};
