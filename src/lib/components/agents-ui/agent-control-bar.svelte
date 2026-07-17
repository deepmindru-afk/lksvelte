<script lang="ts">
  import { cn } from '$lib/cn';
  import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, MonitorUpIcon, MessageSquareTextIcon, PhoneOffIcon, SendHorizontal, PaperclipIcon, LoaderIcon, CommandIcon, XIcon } from 'lucide-svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Toggle from '$lib/components/ui/toggle.svelte';

  let {
    variant = 'default',
    isChatOpen = false,
    isConnected = false,
    onDisconnect = () => {},
    onIsChatOpenChange = (v: boolean) => {},
    onClear = () => {},
    className = '',
  }: {
    variant?: 'default' | 'outline' | 'livekit';
    isChatOpen?: boolean;
    isConnected?: boolean;
    onDisconnect?: () => void;
    onIsChatOpenChange?: (v: boolean) => void;
    onClear?: () => void;
    className?: string;
  } = $props();

  let message = $state('');
  let isSending = $state(false);
  let showCommands = $state(false);
  let selectedIndex = $state(0);
  let attachments: Array<{ file: File; preview: string }> = $state([]);
  let micEnabled = $state(false);
  let cameraEnabled = $state(false);
  let screenShareEnabled = $state(false);

  const commands = [
    { command: '/help', description: 'Show available commands', example: '/help' },
    { command: '/clear', description: 'Clear the chat transcript', example: '/clear' },
    { command: '/voice', description: 'Switch to voice-only mode', example: '/voice' },
    { command: '/realtime', description: 'Switch to real-time mode', example: '/realtime' },
  ];

  function getCommandFromText(text: string): string | null {
    const match = text.match(/(?:^|\s)(\/[a-zA-Z]*)$/);
    return match ? match[1] : null;
  }

  function getCommandText(text: string): string {
    const match = text.match(/(?:^|\s)(\/[a-zA-Z]*)/);
    return match ? match[0].trimStart() : '';
  }

  const activeCommandPrefix = $derived(getCommandFromText(message));
  const filteredCommands = $derived(activeCommandPrefix ? commands.filter(c => c.command.startsWith(activeCommandPrefix.toLowerCase())) : []);

  $effect(() => {
    showCommands = activeCommandPrefix !== null;
    selectedIndex = 0;
  });

  function handleSelectCommand(cmd: typeof commands[0]) {
    const text = getCommandText(message);
    const before = message.slice(0, message.lastIndexOf(text));
    const after = message.slice(message.lastIndexOf(text) + text.length);
    message = before + cmd.command + ' ';
    showCommands = false;
  }

  async function handleSend() {
    if (!message.trim() && attachments.length === 0) return;
    if (message.trim() === '/clear') { onClear(); message = ''; attachments = []; return; }
    isSending = true;
    try {
      // Send message via LiveKit - simplified for now
      console.log('Send:', message, attachments);
      message = '';
      attachments = [];
    } catch (e) { console.error(e); }
    finally { isSending = false; }
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    for (const file of files) {
      attachments = [...attachments, { file, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '' }];
    }
    input.value = '';
  }

  function handleRemoveAttachment(index: number) {
    attachments = attachments.filter((_, i) => i !== index);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (showCommands && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = (selectedIndex + 1) % filteredCommands.length; return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length; return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); handleSelectCommand(filteredCommands[selectedIndex]); return; }
      if (e.key === 'Escape') { e.preventDefault(); showCommands = false; return; }
    }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }
</script>

<div class={cn('bg-background border-input/50 dark:border-muted flex flex-col border p-3 drop-shadow-md/3', variant === 'livekit' ? 'rounded-[31px]' : 'rounded-lg', className)}>
  {#if isChatOpen}
    <div class="border-input/50 flex w-full items-start overflow-hidden border-b mb-3">
      <div class="relative mb-3 flex grow flex-col text-sm w-full">
        {#if showCommands && filteredCommands.length > 0}
          <div role="listbox" class="bg-popover text-popover-foreground border-border absolute bottom-full left-0 right-0 mb-2 rounded-lg border p-1 shadow-md">
            {#each filteredCommands as cmd, i}
              <button
                role="option"
                aria-selected={i === selectedIndex}
                onclick={() => handleSelectCommand(cmd)}
                onmouseenter={() => selectedIndex = i}
                class={cn('w-full justify-start gap-3 rounded-md px-3 py-2 text-left text-sm font-normal flex items-center', i === selectedIndex && 'bg-muted text-foreground')}
              >
                <CommandIcon class="text-muted-foreground size-4 shrink-0" />
                <div class="flex min-w-0 flex-1 flex-col">
                  <span class="font-medium">{cmd.command}</span>
                  <span class="text-muted-foreground text-xs">{cmd.description}</span>
                </div>
              </button>
            {/each}
          </div>
        {/if}

        {#if attachments.length > 0}
          <div class="mx-1 mb-2 flex flex-wrap gap-2">
            {#each attachments as att, i}
              <div class="group relative size-16 overflow-hidden rounded-lg border">
                {#if att.preview}
                  <img alt={att.file.name} src={att.preview} class="size-full object-cover" width={64} height={64} />
                {:else}
                  <div class="bg-muted text-muted-foreground flex size-full items-center justify-center text-xs"><PaperclipIcon class="size-4" /></div>
                {/if}
                <button onclick={() => handleRemoveAttachment(i)} class="bg-background/80 hover:bg-background absolute top-0.5 right-0.5 size-5 rounded-full opacity-0 group-hover:opacity-100 inline-flex items-center justify-center"><XIcon class="size-3" /></button>
              </div>
            {/each}
          </div>
        {/if}

        <div class="flex grow items-end gap-2 rounded-md pl-1">
          <textarea
            bind:value={message}
            disabled={!isChatOpen || isSending}
            placeholder="Type / for commands..."
            onkeydown={handleKeyDown}
            class="field-sizing-content max-h-16 min-h-8 flex-1 resize-none py-2 text-base [scrollbar-width:thin] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-transparent"
          ></textarea>
          <div class="flex items-end gap-1 self-end">
            <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json" onchange={handleFileSelect} class="hidden" id="file-input" />
            <Button size="icon" variant="ghost" disabled={!isChatOpen || isSending} onclick={() => document.getElementById('file-input')?.click()} class="text-muted-foreground hover:text-foreground size-9 shrink-0"><PaperclipIcon class="size-5" /></Button>
            <Button size="icon" disabled={!message.trim() && attachments.length === 0} onclick={handleSend} class="disabled:cursor-not-allowed">
              {#if isSending}<LoaderIcon class="animate-spin size-4" />{:else}<SendHorizontal class="size-4" />{/if}
            </Button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div class="flex gap-1">
    <div class="flex grow gap-1">
      <Toggle pressed={micEnabled} onpressedchange={(v) => micEnabled = v} variant={variant === 'outline' ? 'outline' : 'default'} class={cn(variant === 'livekit' && 'rounded-full')} aria-label="Toggle microphone">
        {#if micEnabled}<MicIcon class="size-4" />{:else}<MicOffIcon class="size-4" />{/if}
      </Toggle>
      <Toggle pressed={cameraEnabled} onpressedchange={(v) => cameraEnabled = v} variant={variant === 'outline' ? 'outline' : 'default'} class={cn(variant === 'livekit' && 'rounded-full')} aria-label="Toggle camera">
        {#if cameraEnabled}<VideoIcon class="size-4" />{:else}<VideoOffIcon class="size-4" />{/if}
      </Toggle>
      <Toggle pressed={screenShareEnabled} onpressedchange={(v) => screenShareEnabled = v} variant={variant === 'outline' ? 'outline' : 'default'} class={cn(variant === 'livekit' && 'rounded-full')} aria-label="Toggle screen share">
        {#if screenShareEnabled}<MonitorUpIcon class="size-4" />{:else}<MonitorOffIcon class="size-4" />{/if}
      </Toggle>
      <Toggle pressed={isChatOpen} onpressedchange={(v) => { onIsChatOpenChange(v); }} variant={variant === 'outline' ? 'outline' : 'default'} class={cn(variant === 'livekit' && 'rounded-full')} aria-label="Toggle transcript">
        <MessageSquareTextIcon class="size-4" />
      </Toggle>
    </div>
    <button onclick={onDisconnect} disabled={!isConnected} class={cn('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 outline-none h-9 px-4 py-2', variant === 'livekit' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-full font-mono text-xs font-bold tracking-wider' : 'bg-destructive text-white hover:bg-destructive/90')}>
      <PhoneOffIcon class="size-4" />
      <span class="hidden md:inline">END CALL</span>
      <span class="inline md:hidden">END</span>
    </button>
  </div>
</div>
