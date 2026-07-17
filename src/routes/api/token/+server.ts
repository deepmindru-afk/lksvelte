import { json } from '@sveltejs/kit';
import { AccessToken } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';
import type { RequestHandler } from './$types';

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!LIVEKIT_URL) throw new Error('LIVEKIT_URL is not defined');
    if (!API_KEY) throw new Error('LIVEKIT_API_KEY is not defined');
    if (!API_SECRET) throw new Error('LIVEKIT_API_SECRET is not defined');

    const body = await request.json();
    const roomConfig = body?.room_config
      ? RoomConfiguration.fromJson(body.room_config, { ignoreUnknownFields: true })
      : undefined;

    const roomName: string = body?.room_name;
    const participantIdentity: string = body?.participant_identity;
    const participantName: string = body?.participant_name;
    const participantMetadata: string | undefined = body?.participant_metadata;
    const participantAttributes: Record<string, string> | undefined = body?.participant_attributes;

    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: participantIdentity,
      name: participantName,
      metadata: participantMetadata,
      attributes: participantAttributes,
      ttl: '15m',
    });
    at.addGrant({ room: roomName, roomJoin: true, canPublish: true, canPublishData: true, canSubscribe: true });
    if (roomConfig) at.roomConfig = roomConfig;
    const participantToken = await at.toJwt();

    return json({
      serverUrl: LIVEKIT_URL,
      roomName,
      participantName,
      participantToken,
      participantMetadata,
      participantAttributes,
    }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('POST /api/token failed:', message);
    return json({ error: message }, { status: 500 });
  }
};
