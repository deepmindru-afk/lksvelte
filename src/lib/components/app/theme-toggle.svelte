<script lang="ts">
  import { cn } from '$lib/cn';
  import { theme } from '$lib/stores/theme';
  import { MoonIcon, SunIcon, MonitorIcon } from 'lucide-svelte';

  let className: string = '';
  export { className as class };
</script>

<div class={cn('text-foreground bg-background flex w-full flex-row justify-end divide-x overflow-hidden rounded-full border', className)}>
  <span class="sr-only">Color scheme toggle</span>
  <button type="button" onclick={() => theme.set('dark')} class="rounded-none p-1 pl-1.5 inline-flex items-center justify-center size-9 hover:bg-accent hover:text-accent-foreground">
    <span class="sr-only">Enable dark color scheme</span>
    <MoonIcon size={16} class={cn($theme !== 'dark' && 'opacity-25')} />
  </button>
  <button type="button" onclick={() => theme.set('light')} class="rounded-none px-1.5 py-1 inline-flex items-center justify-center size-9 hover:bg-accent hover:text-accent-foreground">
    <span class="sr-only">Enable light color scheme</span>
    <SunIcon size={16} class={cn($theme !== 'light' && 'opacity-25')} />
  </button>
  <button type="button" onclick={() => theme.set('system')} class="rounded-none p-1 pr-1.5 inline-flex items-center justify-center size-9 hover:bg-accent hover:text-accent-foreground">
    <span class="sr-only">Enable system color scheme</span>
    <MonitorIcon size={16} class={cn($theme !== 'system' && 'opacity-25')} />
  </button>
</div>
