import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const LM_API_BASE = process.env.LM_API_BASE_URL ?? 'https://lm.portalos.ru';
const LM_API_KEY = process.env.LM_API_KEY;

export const POST: RequestHandler = async () => {
  try {
    if (!LM_API_KEY) {
      return json({ error: 'LM_API_KEY environment variable is not configured' }, { status: 500 });
    }
    const res = await fetch(`${LM_API_BASE}/v1/models`, {
      headers: { Authorization: `Bearer ${LM_API_KEY}` },
    });
    if (!res.ok) {
      return json({ error: `Upstream API error: ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    const models = (data.data ?? []).map((m: { id: string }) => ({ id: m.id, name: m.id }));
    return json({ models });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return json({ error: message }, { status: 500 });
  }
};
