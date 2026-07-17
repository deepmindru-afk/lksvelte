import { type LocalParticipant } from 'livekit-client';

const CHUNK_SIZE = 64 * 1024;

export async function sendFile(participant: LocalParticipant, file: File): Promise<{ name: string }> {
  const encoder = new TextEncoder();
  const name = `${Date.now()}-${file.name}`;

  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const header = JSON.stringify({ type: 'file', name, size: file.size, totalChunks });
  await participant.publishData(encoder.encode(header), { topic: 'file' });

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    const buffer = await chunk.arrayBuffer();
    const meta = JSON.stringify({ index: i, name });
    const combined = new Uint8Array(encoder.encode(meta).length + 1 + buffer.byteLength);
    combined.set(encoder.encode(meta));
    combined.set(new Uint8Array([0]), encoder.encode(meta).length);
    combined.set(new Uint8Array(buffer), encoder.encode(meta).length + 1);
    await participant.publishData(combined, { topic: 'file' });
  }

  return { name };
}
