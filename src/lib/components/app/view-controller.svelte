<script lang="ts">
  import { cn } from '$lib/cn';
  import WelcomeView from '$lib/components/app/welcome-view.svelte';
  import { AgentSessionView_01 } from '$lib/components/agents-ui/blocks/agent-session-view-01/index.js';
  import type { AppConfig } from '$lib/app-config';
  import { getResolvedTheme } from '$lib/stores/theme';
  import type { Room } from 'livekit-client';

  let {
    appConfig,
    username = '',
    roomName = '',
    onUsernameChange = (v: string) => {},
    onRoomNameChange = (v: string) => {},
  }: {
    appConfig: AppConfig;
    username?: string;
    roomName?: string;
    onUsernameChange?: (v: string) => void;
    onRoomNameChange?: (v: string) => void;
  } = $props();

  let isConnected = $state(false);
  let room = $state<Room | null>(null);

  async function startConnection() {
    const fallbackUser = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('user') ?? `va_user_${Math.floor(Math.random() * 10000)}`;
    const identity = username || fallbackUser;
    const rname = roomName || `va_room_${Math.floor(Math.random() * 10000)}`;

    const sandboxEndpoint = (typeof window !== 'undefined' ? (window as any).__env?.PUBLIC_CONN_DETAILS_ENDPOINT : undefined) || undefined;
    const url = sandboxEndpoint ?? '/api/token';
    const sandboxId = appConfig.sandboxId;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sandboxEndpoint && sandboxId) headers['X-Sandbox-Id'] = sandboxId;

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          room_name: rname,
          participant_identity: identity,
          participant_name: identity,
          room_config: appConfig.agentName ? { agents: [{ agent_name: appConfig.agentName }] } : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Token request failed: ${res.status}`);
      }

      const data = await res.json();
      const { Room: LiveKitRoom } = await import('livekit-client');
      const livekitRoom = new LiveKitRoom();
      room = livekitRoom;

      livekitRoom.on('disconnected', () => {
        isConnected = false;
        room = null;
      });

      await livekitRoom.connect(data.serverUrl, data.participantToken);
      isConnected = true;
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }

  function disconnect() {
    room?.disconnect();
    room = null;
    isConnected = false;
  }

  const resolvedTheme = $derived(getResolvedTheme());
</script>

{#if !isConnected}
  <WelcomeView startButtonText={appConfig.startButtonText} onStartCall={startConnection} bind:username bind:roomName />
{:else}
  <AgentSessionView_01
    supportsChatInput={appConfig.supportsChatInput}
    supportsVideoInput={appConfig.supportsVideoInput}
    supportsScreenShare={appConfig.supportsScreenShare}
    isPreConnectBufferEnabled={appConfig.isPreConnectBufferEnabled}
    audioVisualizerType={appConfig.audioVisualizerType}
    audioVisualizerColor={resolvedTheme === 'dark' ? appConfig.audioVisualizerColorDark : appConfig.audioVisualizerColor}
    audioVisualizerColorShift={appConfig.audioVisualizerColorShift}
    audioVisualizerBarCount={appConfig.audioVisualizerBarCount}
    isConnected={isConnected}
    onDisconnect={disconnect}
    {room}
    class="fixed inset-0"
  />
{/if}
