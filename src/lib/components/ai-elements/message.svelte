<script lang="ts">
  import { cn } from '$lib/cn';

  let className: string = '';
  let title: string = '';
  let from: 'user' | 'assistant' = 'assistant';
  export { className as class, title, from };
</script>

<div class={cn('flex flex-col gap-1', from === 'user' ? 'is-user items-end' : 'items-start', className)}>
  <span class="text-xs text-muted-foreground">{title}</span>
  <div class={cn('rounded-2xl px-4 py-2 max-w-[80%]', from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
    <slot />
  </div>
</div>
