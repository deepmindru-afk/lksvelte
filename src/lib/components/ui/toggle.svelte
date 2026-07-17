<script lang="ts">
  import { cn } from '$lib/cn';

  let className: string = '';
  let pressed: boolean = false;
  let disabled: boolean = false;
  let variant: 'default' | 'outline' = 'default';
  let size: 'default' | 'sm' | 'lg' = 'default';
  export { className as class, pressed, disabled, variant, size };

  const variants: Record<string, string> = {
    default: 'bg-transparent',
    outline: 'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground',
  };
  const sizes: Record<string, string> = {
    default: 'h-9 px-2 min-w-9',
    sm: 'h-8 px-1.5 min-w-8',
    lg: 'h-10 px-2.5 min-w-10',
  };
</script>

<button
  class={cn("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] whitespace-nowrap", variants[variant], sizes[size], className)}
  aria-pressed={pressed}
  data-state={pressed ? 'on' : 'off'}
  {disabled}
  onclick={() => pressed = !pressed}
>
  <slot />
</button>
