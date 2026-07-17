export function load({ params }: { params: Record<string, string> }) {
  return { room_name: params.room_name };
}
