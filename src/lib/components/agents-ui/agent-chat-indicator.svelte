<script lang="ts">
  import { cn } from '$lib/cn';

  let className: string = '';
  let size: 'sm' | 'md' | 'lg' = 'md';
  export { className as class, size };

  const sizes: Record<string, string> = {
    sm: 'size-2.5',
    md: 'size-4',
    lg: 'size-6',
  };
</script>

<span class={cn('bg-muted-foreground inline-block rounded-full animate-pulse', sizes[size], className)}></span>
