<script lang="ts">
  import { cn } from '$lib/cn';
  let className: string = '';
  let content: string = '';
  export { className as class, content };
</script>

<div class="group relative inline-flex">
  <slot />
  <div class={cn('invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs rounded-md bg-popover text-popover-foreground border shadow-sm whitespace-nowrap z-50', className)}>
    {content}
  </div>
</div>
