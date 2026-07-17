<script lang="ts">
  import { cn } from '$lib/cn';
  let className: string = '';
  export { className as class };
</script>

<div data-slot="alert-title" class={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}>
  <slot />
</div>
