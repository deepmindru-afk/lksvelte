<script lang="ts">
  import { cn } from '$lib/cn';
  import WelcomeView from '$lib/components/app/welcome-view.svelte';
  import { AgentSessionView_01 } from '$lib/components/agents-ui/blocks/agent-session-view-01/index.js';
  import type { AppConfig } from '$lib/app-config';
  import { getResolvedTheme } from '$lib/stores/theme';

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

  async function startConnection() {
    const fallbackUser = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('user') ?? `va_user_${Math.floor(Math.random() * 10000)}`;
    const identity = username || fallbackUser;
    const room = roomName || `va_room_${Math.floor(Math.random() * 10000)}`;

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
          room_name: room,
          participant_identity: identity,
          participant_name: identity,
          room_config: appConfig.agentName ? { agents: [{ agent_name: appConfig.agentName }] } : undefined,
        }),
      });

      if (res.ok) {
        isConnected = true;
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }

  function disconnect() {
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
    class="fixed inset-0"
  />
{/if}
