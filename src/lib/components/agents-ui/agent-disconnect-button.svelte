<script lang="ts">
  import { cn } from '$lib/cn';
  import { PhoneOffIcon } from 'lucide-svelte';

  let className: string = '';
  let disabled: boolean = false;
  let size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
  let variant: 'default' | 'outline' | 'destructive' | 'ghost' | 'link' = 'destructive';
  export { className as class, disabled, size, variant };

  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60',
    outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  const sizes: Record<string, string> = {
    default: 'h-9 px-4 py-2 has-[>svg]:px-3',
    sm: 'h-8 rounded-md gap-1.5 px-3',
    lg: 'h-10 rounded-md px-6',
    icon: 'size-9',
  };
</script>

<button {disabled} class={cn('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none', variants[variant], sizes[size], className)} on:click>
  <PhoneOffIcon class="size-4" />
  <slot><span class={cn(size === 'icon' && 'sr-only')}>END CALL</span></slot>
</button>
