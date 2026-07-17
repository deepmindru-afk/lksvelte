<script lang="ts">
  import { cn } from '$lib/cn';
  import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, MonitorUpIcon, MonitorOffIcon, LoaderIcon } from 'lucide-svelte';

  let className: string = '';
  let source: 'camera' | 'microphone' | 'screen_share' = 'microphone';
  let pressed: boolean = false;
  let pending: boolean = false;
  let disabled: boolean = false;
  let size: 'sm' | 'default' | 'lg' = 'default';
  let variant: 'default' | 'outline' = 'default';
  export { className as class, source, pressed, pending, disabled, size, variant };

  const variants: Record<string, string> = {
    default: 'data-[state=off]:bg-destructive/10 data-[state=off]:text-destructive data-[state=off]:hover:bg-destructive/15 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-foreground/10',
    outline: 'data-[state=off]:bg-destructive/10 data-[state=off]:text-destructive data-[state=off]:border-destructive/20 data-[state=off]:hover:bg-destructive/15 data-[state=on]:hover:bg-foreground/10',
  };
  const sizes: Record<string, string> = {
    sm: 'h-8 px-1.5 min-w-8',
    default: 'h-9 px-2 min-w-9',
    lg: 'h-10 px-2.5 min-w-10',
  };
</script>

<button
  aria-pressed={pressed}
  data-state={pressed ? 'on' : 'off'}
  {disabled}
  onclick={() => pressed = !pressed}
  class={cn('inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow]', variants[variant], sizes[size], className)}
>
  {#if pending}
    <LoaderIcon class={cn(pending && 'animate-spin')} />
  {:else if source === 'microphone'}
    {#if pressed}
      <MicIcon class="size-4" />
    {:else}
      <MicOffIcon class="size-4" />
    {/if}
  {:else if source === 'camera'}
    {#if pressed}
      <VideoIcon class="size-4" />
    {:else}
      <VideoOffIcon class="size-4" />
    {/if}
  {:else if source === 'screen_share'}
    {#if pressed}
      <MonitorUpIcon class="size-4" />
    {:else}
      <MonitorOffIcon class="size-4" />
    {/if}
  {/if}
  <slot />
</button>
