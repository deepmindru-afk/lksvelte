<script lang="ts">
  import { cn } from '$lib/cn';
  import AgentChatTranscript from '$lib/components/agents-ui/agent-chat-transcript.svelte';
  import AgentControlBar from '$lib/components/agents-ui/agent-control-bar.svelte';
  import TileLayout from './tile-view.svelte';

  let {
    preConnectMessage = 'Agent is listening, ask it a question',
    supportsChatInput = true,
    supportsVideoInput = true,
    supportsScreenShare = true,
    isPreConnectBufferEnabled = true,
    audioVisualizerType,
    audioVisualizerColor,
    audioVisualizerColorShift,
    audioVisualizerBarCount,
    isConnected = false,
    onDisconnect = () => {},
    className = '',
  }: {
    preConnectMessage?: string;
    supportsChatInput?: boolean;
    supportsVideoInput?: boolean;
    supportsScreenShare?: boolean;
    isPreConnectBufferEnabled?: boolean;
    audioVisualizerType?: string;
    audioVisualizerColor?: string;
    audioVisualizerColorShift?: number;
    audioVisualizerBarCount?: number;
    isConnected?: boolean;
    onDisconnect?: () => void;
    className?: string;
  } = $props();

  let chatOpen = $state(false);
  let messages: Array<{ id: string; timestamp: number; from: { isLocal: boolean }; message: string }> = $state([]);
  let clearedAt = $state(0);

  const filteredMessages = $derived(clearedAt > 0 ? messages.filter(m => m.timestamp > clearedAt) : messages);

  function handleClear() { clearedAt = Date.now(); }
</script>

<section class={cn('bg-background relative z-10 h-full w-full overflow-hidden', className)}>
  <div class="absolute top-0 bottom-[135px] flex w-full flex-col md:bottom-[170px]">
    {#if chatOpen}
      <div class="flex h-full w-full flex-col gap-4 transition-opacity duration-300 ease-out">
        <AgentChatTranscript agentState="speaking" messages={filteredMessages} class="mx-auto w-full max-w-2xl [&_.is-user>div]:rounded-[22px] [&>div>div]:px-4 [&>div>div]:pt-40 md:[&>div>div]:px-6" />
      </div>
    {/if}
  </div>

  <TileLayout {chatOpen} {audioVisualizerType} {audioVisualizerColor} {audioVisualizerColorShift} {audioVisualizerBarCount} />

  <div class="absolute inset-x-3 bottom-0 z-50 md:inset-x-12">
    {#if isPreConnectBufferEnabled && messages.length === 0}
      <p class="pointer-events-none mx-auto block w-full max-w-2xl pb-4 text-center text-sm font-semibold text-muted-foreground animate-pulse">{preConnectMessage}</p>
    {/if}
    <div class="bg-background relative mx-auto max-w-2xl pb-3 md:pb-12">
      <AgentControlBar
        variant="livekit"
        bind:isChatOpen={chatOpen}
        {isConnected}
        onDisconnect={onDisconnect}
        onIsChatOpenChange={(v) => chatOpen = v}
        onClear={handleClear}
      />
    </div>
  </div>
</section>
