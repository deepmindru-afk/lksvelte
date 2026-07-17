import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const BEARER_KEY = process.env.CHAT_API_BEARER_KEY;

const mockSessions = [
  {
    id: 'session-1', title: 'Getting Started with AI',
    createdAt: '2026-05-23T10:30:00Z', updatedAt: '2026-05-23T10:35:00Z',
    messages: [
      { id: 'm1', sessionId: 'session-1', role: 'user', content: 'How do I get started with this AI agent?', timestamp: '2026-05-23T10:30:00Z' },
      { id: 'm2', sessionId: 'session-1', role: 'assistant', content: 'Welcome! To get started, simply click the "Open Portal" button to connect.', timestamp: '2026-05-23T10:30:05Z' },
    ],
  },
  {
    id: 'session-2', title: 'Project Architecture Review',
    createdAt: '2026-05-22T14:20:00Z', updatedAt: '2026-05-22T14:45:00Z',
    messages: [
      { id: 'm5', sessionId: 'session-2', role: 'user', content: 'We need to discuss our microservices migration strategy.', timestamp: '2026-05-22T14:20:00Z' },
      { id: 'm6', sessionId: 'session-2', role: 'assistant', content: "I'd be happy to help with that.", timestamp: '2026-05-22T14:20:10Z' },
    ],
  },
  {
    id: 'session-3', title: 'Bug Investigation: Login Issue',
    createdAt: '2026-05-21T09:15:00Z', updatedAt: '2026-05-21T09:30:00Z',
    messages: [
      { id: 'm9', sessionId: 'session-3', role: 'user', content: 'Users are reporting login failures after the latest deployment.', timestamp: '2026-05-21T09:15:00Z' },
      { id: 'm10', sessionId: 'session-3', role: 'assistant', content: "Let's investigate.", timestamp: '2026-05-21T09:15:10Z' },
    ],
  },
];

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!BEARER_KEY) {
      return json({ error: 'Chat API bearer key is not configured on the server' }, { status: 500 });
    }
    const auth = request.headers.get('Authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return json({ error: 'Missing or malformed Authorization header' }, { status: 401 });
    }
    const token = auth.slice(7);
    if (token !== BEARER_KEY) {
      return json({ error: 'Invalid bearer token' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { sessionId, limit } = body;
    let sessions = [...mockSessions];
    if (sessionId) sessions = sessions.filter((s) => s.id === sessionId);
    if (limit && typeof limit === 'number') sessions = sessions.slice(0, limit);
    return json({ sessions }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return json({ error: message }, { status: 500 });
  }
};
