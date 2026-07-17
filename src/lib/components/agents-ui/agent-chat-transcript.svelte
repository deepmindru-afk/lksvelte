<script lang="ts">
  import { cn } from '$lib/cn';
  import AgentChatIndicator from '$lib/components/agents-ui/agent-chat-indicator.svelte';

  let className: string = $state('');
  let agentState: string | undefined = $state(undefined);
  let messages: Array<{ id: string; timestamp: number; from: { isLocal: boolean }; message: string }> = $state([]);
  export { className as class, agentState, messages };
</script>

<div class={cn('flex flex-col gap-2', className)}>
  {#each messages as msg}
    {@const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US'}
    {@const origin = msg.from?.isLocal ? 'user' : 'assistant'}
    {@const time = new Date(msg.timestamp)}
    {@const title = time.toLocaleTimeString(locale, { timeStyle: 'full' })}
    <div class={cn('flex flex-col gap-1', origin === 'user' ? 'items-end' : 'items-start')}>
      <span class="text-xs text-muted-foreground">{title}</span>
      <div class={cn('rounded-2xl px-4 py-2 max-w-[80%]', origin === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
        {msg.message}
      </div>
    </div>
  {/each}
  {#if agentState === 'thinking'}
    <AgentChatIndicator size="sm" />
  {/if}
</div>
