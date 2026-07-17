<script lang="ts">
  import { cn } from '$lib/cn';
  let className: string = '';
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  export { className as class, variant };

  const variants: Record<string, string> = {
    default: 'border-transparent bg-primary text-primary-foreground shadow-xs',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border-transparent bg-destructive text-white shadow-xs',
    outline: 'text-foreground',
  };
</script>

<span class={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', variants[variant], className)}>
  <slot />
</span>
